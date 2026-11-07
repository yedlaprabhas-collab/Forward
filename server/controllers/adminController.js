const User = require('../models/User');
const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');

// @desc    Get comprehensive platform analytics and stats for admin
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalNGOs = await User.countDocuments({ role: 'ngo' });

    const totalDonations = await Donation.countDocuments();
    const completedDonationsList = await Donation.find({
      status: { $in: ['Delivered', 'Completed'] },
    });
    const totalCompletedDeliveries = await Delivery.countDocuments({
      status: 'Completed',
    });

    const totalServingsRescued = completedDonationsList.reduce(
      (sum, d) => sum + (d.quantity || 0),
      0
    );

    // Food category breakdown
    const categoryStats = await Donation.aggregate([
      {
        $group: {
          _id: '$foodCategory',
          count: { $sum: 1 },
          servings: { $sum: '$quantity' },
        },
      },
    ]);

    // Status distribution
    const statusStats = await Donation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly donations over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyStats = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          servings: { $sum: '$quantity' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Format monthly data for Recharts
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const formattedMonthly = monthlyStats.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      donations: item.count,
      servings: item.servings,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalVolunteers,
        totalNGOs,
        totalDonations,
        totalServingsRescued,
        totalCompletedDeliveries,
        categoryStats: categoryStats.map((c) => ({
          name: c._id || 'Unknown',
          count: c.count,
          servings: c.servings,
        })),
        statusStats: statusStats.map((s) => ({
          status: s._id || 'Unknown',
          count: s.count,
        })),
        monthlyStats: formattedMonthly,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users with filter/search
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, status } = req.query;

    const query = {};
    if (role && role !== 'all') {
      query.role = role.toLowerCase();
    }
    if (status !== undefined && status !== 'all') {
      query.isActive = status === 'active';
    }
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { organizationName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate or deactivate user account
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent deactivating own admin account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own administrative account.',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations for admin monitoring
// @route   GET /api/admin/donations
// @access  Private (Admin only)
const getAllDonationsAdmin = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email phone')
      .populate('requestedBy', 'name email organizationName')
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

// @desc    Get all deliveries for admin monitoring
// @route   GET /api/admin/deliveries
// @access  Private (Admin only)
const getAllDeliveriesAdmin = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find()
      .populate('donation')
      .populate('donor', 'name email phone')
      .populate('ngo', 'name email organizationName')
      .populate('volunteer', 'name email phone')
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

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllDonationsAdmin,
  getAllDeliveriesAdmin,
};
