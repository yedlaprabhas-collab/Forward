const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedforward';
    console.log(`Connecting to MongoDB for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Donation.deleteMany({}),
      Delivery.deleteMany({}),
    ]);

    console.log('Creating users for all roles...');

    // 1. Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@feedforward.org',
      password: 'Admin@12345',
      phone: '+1 (555) 019-2831',
      role: 'admin',
      address: 'FeedForward HQ, 100 Green Innovation Way',
      city: 'San Francisco',
      isActive: true,
    });

    // 2. Donors
    const donor1 = await User.create({
      name: 'Green Bites Catering Co.',
      email: 'donor@greenbites.com',
      password: 'Donor@12345',
      phone: '+1 (555) 234-5678',
      role: 'donor',
      address: '452 Market Street, Financial District',
      city: 'San Francisco',
      isActive: true,
    });

    const donor2 = await User.create({
      name: 'Grand Palace Hotel & Banquets',
      email: 'grandpalace@hotel.com',
      password: 'Donor@12345',
      phone: '+1 (555) 345-6789',
      role: 'donor',
      address: '890 Ocean Boulevard',
      city: 'San Francisco',
      isActive: true,
    });

    // 3. NGOs
    const ngo1 = await User.create({
      name: 'Father Joseph Care Center',
      email: 'care@hopeorphanage.org',
      password: 'Ngo@12345',
      phone: '+1 (555) 456-7890',
      role: 'ngo',
      address: '124 Hope Lane, Mission District',
      city: 'San Francisco',
      organizationName: 'Hope Children Orphanage',
      organizationType: 'Orphanage',
      isActive: true,
    });

    const ngo2 = await User.create({
      name: 'Silver Lining Community Foundation',
      email: 'contact@silvercare.org',
      password: 'Ngo@12345',
      phone: '+1 (555) 567-8901',
      role: 'ngo',
      address: '778 Sunset Boulevard',
      city: 'San Francisco',
      organizationName: 'Silver Lining Senior Sanctuary',
      organizationType: 'Old Age Home',
      isActive: true,
    });

    // 4. Volunteers
    const volunteer1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@volunteer.org',
      password: 'Volunteer@12345',
      phone: '+1 (555) 678-9012',
      role: 'volunteer',
      address: '320 Castro Street',
      city: 'San Francisco',
      isActive: true,
    });

    const volunteer2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@volunteer.org',
      password: 'Volunteer@12345',
      phone: '+1 (555) 789-0123',
      role: 'volunteer',
      address: '614 Valencia Street',
      city: 'San Francisco',
      isActive: true,
    });

    console.log('Creating realistic food donations...');

    const now = new Date();

    // 1. Available: Vegetable Biryani & Paneer Butter Masala
    const don1 = await Donation.create({
      donor: donor1._id,
      foodName: 'Vegetable Dum Biryani with Paneer Butter Masala',
      description: 'Freshly prepared aromatic basmati rice cooked with fresh seasonal vegetables and rich cottage cheese curry. Prepared for an afternoon corporate seminar.',
      foodCategory: 'Vegetarian',
      quantity: 45,
      preparationTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      pickupDeadline: new Date(now.getTime() + 6 * 60 * 60 * 1000), // in 6 hours
      pickupAddress: '452 Market Street, Financial District',
      city: 'San Francisco',
      contactNumber: '+1 (555) 234-5678',
      instructions: 'Please bring thermal insulated crates. Loading dock is at rear entrance on Stevenson St.',
      status: 'Available',
    });

    // 2. Available: Gourmet Vegan Salad Bowls & Wraps
    const don2 = await Donation.create({
      donor: donor1._id,
      foodName: 'Gourmet Quinoa Bowls & Roasted Veggie Wraps',
      description: 'Wholesome organic bowls with avocado, quinoa, spinach, and roasted butternut squash, accompanied by freshly rolled hummus wraps.',
      foodCategory: 'Vegan',
      quantity: 30,
      preparationTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      pickupDeadline: new Date(now.getTime() + 8 * 60 * 60 * 1000),
      pickupAddress: '452 Market Street, Financial District',
      city: 'San Francisco',
      contactNumber: '+1 (555) 234-5678',
      instructions: 'Individually boxed in eco-friendly biodegradable containers.',
      status: 'Available',
    });

    // 3. Requested by NGO1 (Needing Volunteer Pickup!)
    const don3 = await Donation.create({
      donor: donor2._id,
      foodName: 'Herb Roasted Chicken with Jasmine Rice & Green Beans',
      description: 'Tender chicken roasted with rosemary, thyme, garlic butter, and served with fluffy jasmine rice and steamed green beans.',
      foodCategory: 'Non-Vegetarian',
      quantity: 50,
      preparationTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      pickupDeadline: new Date(now.getTime() + 4 * 60 * 60 * 1000),
      pickupAddress: '890 Ocean Boulevard, Kitchen Loading Dock',
      city: 'San Francisco',
      contactNumber: '+1 (555) 345-6789',
      instructions: 'Ask for Chef Marco at kitchen receiving bay.',
      status: 'Requested',
      requestedBy: ngo1._id,
    });

    // Create delivery in 'Requested' state for don3
    await Delivery.create({
      donation: don3._id,
      donor: donor2._id,
      ngo: ngo1._id,
      volunteer: null,
      pickupAddress: don3.pickupAddress,
      deliveryAddress: ngo1.address,
      status: 'Requested',
    });

    // 4. Assigned to Volunteer1
    const don4 = await Donation.create({
      donor: donor2._id,
      foodName: 'Pasta Primavera & Fresh Garlic Focaccia',
      description: 'Penne tossed with bell peppers, zucchini, mushrooms in a light marinara glaze, served alongside freshly baked warm focaccia bread.',
      foodCategory: 'Vegetarian',
      quantity: 60,
      preparationTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      pickupDeadline: new Date(now.getTime() + 3 * 60 * 60 * 1000),
      pickupAddress: '890 Ocean Boulevard',
      city: 'San Francisco',
      contactNumber: '+1 (555) 345-6789',
      instructions: 'Large containers, please bring two hands or a trolley.',
      status: 'Assigned',
      requestedBy: ngo2._id,
      assignedVolunteer: volunteer1._id,
    });

    await Delivery.create({
      donation: don4._id,
      donor: donor2._id,
      ngo: ngo2._id,
      volunteer: volunteer1._id,
      pickupAddress: don4.pickupAddress,
      deliveryAddress: ngo2.address,
      status: 'Assigned',
      acceptedAt: new Date(now.getTime() - 30 * 60 * 1000),
    });

    // 5. Picked Up by Volunteer2
    const don5 = await Donation.create({
      donor: donor1._id,
      foodName: 'Traditional South Indian Feast (Sambar, Rice, Vada)',
      description: 'Authentic South Indian wedding banquet remainder: steaming hot lentil sambar, lemon rice, curd rice, and crispy medu vadas.',
      foodCategory: 'Vegetarian',
      quantity: 80,
      preparationTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      pickupDeadline: new Date(now.getTime() + 2 * 60 * 60 * 1000),
      pickupAddress: '452 Market Street',
      city: 'San Francisco',
      contactNumber: '+1 (555) 234-5678',
      instructions: 'Everything packed in sealed food-grade buckets.',
      status: 'Picked Up',
      requestedBy: ngo1._id,
      assignedVolunteer: volunteer2._id,
    });

    await Delivery.create({
      donation: don5._id,
      donor: donor1._id,
      ngo: ngo1._id,
      volunteer: volunteer2._id,
      pickupAddress: don5.pickupAddress,
      deliveryAddress: ngo1.address,
      status: 'Picked Up',
      acceptedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      pickedUpAt: new Date(now.getTime() - 45 * 60 * 1000),
    });

    // 6. Completed Deliveries
    const don6 = await Donation.create({
      donor: donor2._id,
      foodName: 'Grand Wedding Celebration Buffet & Desserts',
      description: 'Exquisite multi-course meal including vegetable pulao, dal makhani, paneer tikka, and assorted Indian sweets (Gulab Jamun, Rasgulla).',
      foodCategory: 'Vegetarian',
      quantity: 120,
      preparationTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      pickupDeadline: new Date(now.getTime() - 18 * 60 * 60 * 1000),
      pickupAddress: '890 Ocean Boulevard',
      city: 'San Francisco',
      contactNumber: '+1 (555) 345-6789',
      instructions: 'Completed delivery.',
      status: 'Completed',
      requestedBy: ngo1._id,
      assignedVolunteer: volunteer1._id,
    });

    await Delivery.create({
      donation: don6._id,
      donor: donor2._id,
      ngo: ngo1._id,
      volunteer: volunteer1._id,
      pickupAddress: don6.pickupAddress,
      deliveryAddress: ngo1.address,
      status: 'Completed',
      acceptedAt: new Date(now.getTime() - 22 * 60 * 60 * 1000),
      pickedUpAt: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      deliveredAt: new Date(now.getTime() - 19 * 60 * 60 * 1000),
      ngoConfirmedAt: new Date(now.getTime() - 18 * 60 * 60 * 1000),
    });

    const don7 = await Donation.create({
      donor: donor1._id,
      foodName: 'Savory Barbecue Chicken Trays & Cornbread',
      description: 'Smoky grilled chicken pieces basted in homemade barbecue glaze, paired with warm buttery golden cornbread squares and coleslaw.',
      foodCategory: 'Non-Vegetarian',
      quantity: 90,
      preparationTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      pickupDeadline: new Date(now.getTime() - 40 * 60 * 60 * 1000),
      pickupAddress: '452 Market Street',
      city: 'San Francisco',
      contactNumber: '+1 (555) 234-5678',
      instructions: 'Completed delivery.',
      status: 'Completed',
      requestedBy: ngo2._id,
      assignedVolunteer: volunteer2._id,
    });

    await Delivery.create({
      donation: don7._id,
      donor: donor1._id,
      ngo: ngo2._id,
      volunteer: volunteer2._id,
      pickupAddress: don7.pickupAddress,
      deliveryAddress: ngo2.address,
      status: 'Completed',
      acceptedAt: new Date(now.getTime() - 46 * 60 * 60 * 1000),
      pickedUpAt: new Date(now.getTime() - 44 * 60 * 60 * 1000),
      deliveredAt: new Date(now.getTime() - 42 * 60 * 60 * 1000),
      ngoConfirmedAt: new Date(now.getTime() - 41 * 60 * 60 * 1000),
    });

    console.log('\n============================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('============================================================');
    console.log('Seed Accounts Created:');
    console.log('👑 Admin:      admin@feedforward.org     / Admin@12345');
    console.log('🍲 Donor:      donor@greenbites.com      / Donor@12345');
    console.log('🏢 NGO:        care@hopeorphanage.org    / Ngo@12345');
    console.log('🚴 Volunteer:  alex@volunteer.org        / Volunteer@12345');
    console.log('============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
