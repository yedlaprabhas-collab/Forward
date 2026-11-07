const Delivery = require('../models/Delivery');
const Donation = require('../models/Donation');

// @desc    Get all available pickups (donations requested by NGOs needing a volunteer)
// @route   GET /api/deliveries/available
// @access  Private (Volunteer only)
const getAvailableDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find({
      status: 'Requested',
      volunteer: null,
    })
      .populate('donation')
      .populate('donor', 'name email phone address city organizationName')
      .populate('ngo', 'name email phone address city organizationName organizationType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get volunteer's assigned and completed deliveries
// @route   GET /api/deliveries/my
// @access  Private (Volunteer only)
const getMyDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find({ volunteer: req.user._id })
      .populate('donation')
      .populate('donor', 'name email phone address city organizationName')
      .populate('ngo', 'name email phone address city organizationName organizationType')
      .sort({ updatedAt: -1 });

    const totalDeliveries = deliveries.length;
    const activeDeliveries = deliveries.filter((d) => ['Assigned', 'Picked Up'].includes(d.status));
    const completedDeliveries = deliveries.filter((d) => ['Delivered', 'Completed'].includes(d.status));

    const mealsDelivered = completedDeliveries.reduce((sum, d) => {
      return sum + (d.donation?.quantity || 0);
    }, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalDeliveries,
        activeDeliveriesCount: activeDeliveries.length,
        completedDeliveriesCount: completedDeliveries.length,
        mealsDelivered,
      },
      deliveries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Volunteer accepts an available delivery
// @route   PUT /api/deliveries/:id/accept
// @access  Private (Volunteer only)
const acceptDelivery = async (req, res, next) => {
  try {
    // Atomic update to avoid race conditions between volunteers
    const delivery = await Delivery.findOneAndUpdate(
      {
        _id: req.params.id,
        status: 'Requested',
        volunteer: null,
      },
      {
        volunteer: req.user._id,
        status: 'Assigned',
        acceptedAt: new Date(),
      },
      { new: true }
    )
      .populate('donation')
      .populate('donor', 'name email phone address')
      .populate('ngo', 'name email phone address organizationName');

    if (!delivery) {
      return res.status(400).json({
        success: false,
        message: 'This delivery is no longer available or has already been accepted by another volunteer.',
      });
    }

    // Update the associated donation
    await Donation.findByIdAndUpdate(delivery.donation._id, {
      status: 'Assigned',
      assignedVolunteer: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Delivery successfully accepted! Please coordinate with the donor for pickup.',
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Volunteer marks delivery as Picked Up
// @route   PUT /api/deliveries/:id/pickup
// @access  Private (Assigned Volunteer only)
const markPickedUp = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found.',
      });
    }

    if (delivery.volunteer?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not the assigned volunteer for this delivery.',
      });
    }

    if (delivery.status !== 'Assigned') {
      return res.status(400).json({
        success: false,
        message: `Cannot mark as picked up. Current status is '${delivery.status}'.`,
      });
    }

    delivery.status = 'Picked Up';
    delivery.pickedUpAt = new Date();
    await delivery.save();

    await Donation.findByIdAndUpdate(delivery.donation, {
      status: 'Picked Up',
    });

    const updatedDelivery = await Delivery.findById(delivery._id)
      .populate('donation')
      .populate('donor', 'name email phone address')
      .populate('ngo', 'name email phone address organizationName');

    res.status(200).json({
      success: true,
      message: 'Food marked as Picked Up. Safe travels to the destination!',
      delivery: updatedDelivery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Volunteer marks delivery as Delivered
// @route   PUT /api/deliveries/:id/deliver
// @access  Private (Assigned Volunteer only)
const markDelivered = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found.',
      });
    }

    if (delivery.volunteer?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not the assigned volunteer for this delivery.',
      });
    }

    if (delivery.status !== 'Picked Up') {
      return res.status(400).json({
        success: false,
        message: `Food must be picked up before marking as delivered. Current status: '${delivery.status}'.`,
      });
    }

    delivery.status = 'Delivered';
    delivery.deliveredAt = new Date();
    await delivery.save();

    await Donation.findByIdAndUpdate(delivery.donation, {
      status: 'Delivered',
    });

    const updatedDelivery = await Delivery.findById(delivery._id)
      .populate('donation')
      .populate('donor', 'name email phone address')
      .populate('ngo', 'name email phone address organizationName');

    res.status(200).json({
      success: true,
      message: 'Delivered successfully! Awaiting receipt confirmation from the NGO.',
      delivery: updatedDelivery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO confirms receipt of food
// @route   PUT /api/deliveries/:id/confirm
// @access  Private (Requesting NGO only)
const confirmDeliveryReceipt = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery record not found.',
      });
    }

    if (delivery.ngo?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient organization can confirm food receipt.',
      });
    }

    if (delivery.status !== 'Delivered' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm receipt until volunteer has marked it as Delivered. Current status: '${delivery.status}'.`,
      });
    }

    delivery.status = 'Completed';
    delivery.ngoConfirmedAt = new Date();
    await delivery.save();

    await Donation.findByIdAndUpdate(delivery.donation, {
      status: 'Completed',
    });

    const updatedDelivery = await Delivery.findById(delivery._id)
      .populate('donation')
      .populate('donor', 'name email phone address')
      .populate('volunteer', 'name email phone')
      .populate('ngo', 'name email phone address organizationName');

    res.status(200).json({
      success: true,
      message: 'Food receipt successfully confirmed! The cycle of kindness is complete.',
      delivery: updatedDelivery,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableDeliveries,
  getMyDeliveries,
  acceptDelivery,
  markPickedUp,
  markDelivered,
  confirmDeliveryReceipt,
};
