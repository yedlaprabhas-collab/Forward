const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private (Donor only)
const createDonation = async (req, res, next) => {
  try {
    const {
      foodName,
      description,
      foodCategory,
      quantity,
      preparationTime,
      pickupDeadline,
      pickupAddress,
      city,
      contactNumber,
      instructions,
    } = req.body;

    if (
      !foodName ||
      !description ||
      !foodCategory ||
      !quantity ||
      !preparationTime ||
      !pickupDeadline ||
      !pickupAddress ||
      !city ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required donation details.',
      });
    }

    const donation = await Donation.create({
      donor: req.user._id,
      foodName,
      description,
      foodCategory,
      quantity: Number(quantity),
      preparationTime: new Date(preparationTime),
      pickupDeadline: new Date(pickupDeadline),
      pickupAddress,
      city,
      contactNumber,
      instructions: instructions || '',
      status: 'Available',
    });

    const populatedDonation = await Donation.findById(donation._id).populate(
      'donor',
      'name email phone organizationName'
    );

    res.status(201).json({
      success: true,
      message: 'Donation created successfully!',
      donation: populatedDonation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (browse for NGOs and public with filters)
// @route   GET /api/donations
// @access  Public
const getAllDonations = async (req, res, next) => {
  try {
    const { status, category, city, search, minQuantity } = req.query;

    const query = {};

    // Filter by status if specified, otherwise default to Available if role is NGO browsing
    if (status) {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.foodCategory = category;
    }

    if (city && city.trim() !== '') {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    if (minQuantity) {
      query.quantity = { $gte: Number(minQuantity) };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { foodName: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { pickupAddress: { $regex: search.trim(), $options: 'i' } },
        { city: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone address organizationName')
      .populate('requestedBy', 'name email phone organizationName organizationType')
      .populate('assignedVolunteer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public
const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone address city organizationName')
      .populate('requestedBy', 'name email phone address city organizationName organizationType')
      .populate('assignedVolunteer', 'name email phone');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found.',
      });
    }

    // Also look for associated delivery if available
    const delivery = await Delivery.findOne({ donation: donation._id })
      .populate('volunteer', 'name email phone')
      .populate('ngo', 'name email phone organizationName address')
      .populate('donor', 'name email phone address');

    res.status(200).json({
      success: true,
      donation,
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donor's own donations
// @route   GET /api/donations/my
// @access  Private (Donor only)
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('requestedBy', 'name email phone organizationName organizationType address')
      .populate('assignedVolunteer', 'name email phone')
      .sort({ createdAt: -1 });

    // Calculate donor-specific statistics
    const totalDonations = donations.length;
    const mealsDonated = donations.reduce((acc, d) => acc + (d.quantity || 0), 0);
    const activeDonations = donations.filter((d) =>
      ['Available', 'Requested', 'Assigned', 'Picked Up'].includes(d.status)
    ).length;
    const completedDonations = donations.filter((d) =>
      ['Delivered', 'Completed'].includes(d.status)
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        mealsDonated,
        activeDonations,
        completedDonations,
      },
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private (Donor only)
const updateDonation = async (req, res, next) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found.',
      });
    }

    // Verify ownership
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this donation.',
      });
    }

    // Only allow editing if still Available
    if (donation.status !== 'Available' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `Cannot edit donation because it is already '${donation.status}'.`,
      });
    }

    const {
      foodName,
      description,
      foodCategory,
      quantity,
      preparationTime,
      pickupDeadline,
      pickupAddress,
      city,
      contactNumber,
      instructions,
    } = req.body;

    const fieldsToUpdate = {};
    if (foodName) fieldsToUpdate.foodName = foodName;
    if (description) fieldsToUpdate.description = description;
    if (foodCategory) fieldsToUpdate.foodCategory = foodCategory;
    if (quantity) fieldsToUpdate.quantity = Number(quantity);
    if (preparationTime) fieldsToUpdate.preparationTime = new Date(preparationTime);
    if (pickupDeadline) fieldsToUpdate.pickupDeadline = new Date(pickupDeadline);
    if (pickupAddress) fieldsToUpdate.pickupAddress = pickupAddress;
    if (city) fieldsToUpdate.city = city;
    if (contactNumber) fieldsToUpdate.contactNumber = contactNumber;
    if (instructions !== undefined) fieldsToUpdate.instructions = instructions;

    donation = await Donation.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate('donor', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Donation updated successfully.',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or cancel donation
// @route   DELETE /api/donations/:id
// @access  Private (Donor or Admin)
const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found.',
      });
    }

    // Check authorization
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this donation.',
      });
    }

    if (donation.status !== 'Available' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete donation because it is already in '${donation.status}' state.`,
      });
    }

    await Donation.findByIdAndDelete(req.params.id);
    await Delivery.deleteMany({ donation: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Donation removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO requests an available donation
// @route   POST /api/donations/:id/request
// @access  Private (NGO only)
const requestDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donor');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found.',
      });
    }

    if (donation.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `This donation is no longer available (Current status: ${donation.status}).`,
      });
    }

    // Atomic update status to 'Requested'
    donation.status = 'Requested';
    donation.requestedBy = req.user._id;
    await donation.save();

    // Create a corresponding Delivery record
    const delivery = await Delivery.create({
      donation: donation._id,
      donor: donation.donor._id,
      ngo: req.user._id,
      pickupAddress: donation.pickupAddress,
      deliveryAddress: req.user.address || 'NGO Center',
      status: 'Requested',
    });

    res.status(200).json({
      success: true,
      message: 'Donation requested successfully! A volunteer will be notified for pickup.',
      donation,
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO cancels request before volunteer assignment
// @route   PUT /api/requests/:id/cancel
// @access  Private (NGO only)
const cancelRequest = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found.',
      });
    }

    if (donation.requestedBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this request.',
      });
    }

    if (donation.status !== 'Requested') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel request because the donation has already progressed to '${donation.status}'.`,
      });
    }

    donation.status = 'Available';
    donation.requestedBy = null;
    await donation.save();

    // Cancel or delete delivery record
    await Delivery.findOneAndDelete({ donation: donation._id });

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully. Donation is now available for others.',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO view their requests and received donations
// @route   GET /api/requests/my
// @access  Private (NGO only)
const getMyRequests = async (req, res, next) => {
  try {
    const donations = await Donation.find({ requestedBy: req.user._id })
      .populate('donor', 'name email phone address city organizationName')
      .populate('assignedVolunteer', 'name email phone')
      .sort({ updatedAt: -1 });

    const deliveries = await Delivery.find({ ngo: req.user._id })
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone organizationName' },
      })
      .populate('volunteer', 'name email phone')
      .sort({ updatedAt: -1 });

    const totalRequests = donations.length;
    const pendingRequests = donations.filter((d) => ['Requested', 'Assigned', 'Picked Up'].includes(d.status)).length;
    const completedDonations = donations.filter((d) => ['Delivered', 'Completed'].includes(d.status));
    const receivedDonations = completedDonations.length;
    const mealsReceived = completedDonations.reduce((acc, d) => acc + (d.quantity || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalRequests,
        pendingRequests,
        receivedDonations,
        mealsReceived,
      },
      donations,
      deliveries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  getMyDonations,
  updateDonation,
  deleteDonation,
  requestDonation,
  cancelRequest,
  getMyRequests,
};
