const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor reference is required'],
    },
    foodName: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    foodCategory: {
      type: String,
      enum: {
        values: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
        message: '{VALUE} is not a valid food category',
      },
      required: [true, 'Food category is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity (servings) is required'],
      min: [1, 'Quantity must be at least 1 serving'],
    },
    preparationTime: {
      type: Date,
      required: [true, 'Preparation time is required'],
    },
    pickupDeadline: {
      type: Date,
      required: [true, 'Pickup deadline is required'],
    },
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    instructions: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Requested', 'Assigned', 'Picked Up', 'Delivered', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups
donationSchema.index({ status: 1, city: 1, foodCategory: 1 });
donationSchema.index({ donor: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
