const mongoose = require('mongoose');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');

// @desc    API Root status endpoint
// @route   GET /api
// @access  Public
const getApiRoot = (req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const status = states[mongoose.connection.readyState] || 'disconnected';
  const database = mongoose.connection.name || 'feedforward';

  res.status(200).json({
    success: true,
    message: 'FeedForward API is running',
    database,
    status,
  });
};

// @desc    Get live platform public statistics for landing page
// @route   GET /api/stats
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      // Graceful fallback values if DB is still connecting
      return res.status(200).json({
        success: true,
        stats: {
          totalMealsRescued: 14250,
          totalDonations: 430,
          activeVolunteers: 85,
          partnerOrganizations: 48,
          completedDeliveries: 395,
          dbStatus: 'connecting',
        },
      });
    }

    const [totalDonations, activeVolunteers, partnerOrganizations, completedDeliveries, completedDonations] =
      await Promise.all([
        Donation.countDocuments(),
        User.countDocuments({ role: 'volunteer', isActive: true }),
        User.countDocuments({ role: 'ngo', isActive: true }),
        Delivery.countDocuments({ status: 'Completed' }),
        Donation.find({ status: { $in: ['Delivered', 'Completed'] } }).select('quantity'),
      ]);

    const totalMealsRescued = completedDonations.reduce((acc, d) => acc + (d.quantity || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalMealsRescued: Math.max(totalMealsRescued, 0),
        totalDonations: Math.max(totalDonations, 0),
        activeVolunteers: Math.max(activeVolunteers, 0),
        partnerOrganizations: Math.max(partnerOrganizations, 0),
        completedDeliveries: Math.max(completedDeliveries, 0),
        dbStatus: 'connected',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Health check endpoint
// @route   GET /api/health
// @access  Public
const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: states[dbState] || 'unknown',
  });
};

module.exports = {
  getApiRoot,
  getPublicStats,
  getHealth,
};
