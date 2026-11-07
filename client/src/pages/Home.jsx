import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import {
  Heart,
  Truck,
  Building2,
  Utensils,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  Globe2,
} from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    totalMealsRescued: 14250,
    totalDonations: 430,
    activeVolunteers: 85,
    partnerOrganizations: 48,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        if (data.success && data.stats) {
          setStats((prev) => ({
            ...prev,
            ...data.stats,
          }));
        }
      } catch (err) {
        // Fallback default values remain intact
      }
    };
    fetchStats();
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Donate Surplus Food',
      desc: 'Restaurants, event organizers, and households list unconsumed fresh food in under 2 minutes.',
      icon: Utensils,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      number: '02',
      title: 'NGOs Claim Food',
      desc: 'Shelters, orphanages, and old age homes receive instant alerts and request needed servings.',
      icon: Building2,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      number: '03',
      title: 'Volunteer Pickup & Transit',
      desc: 'Certified local volunteers accept pickup missions, collect food safely, and handle transport.',
      icon: Truck,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      number: '04',
      title: 'Nourish People in Need',
      desc: 'The receiving charity confirms delivery and hot, wholesome meals are served to vulnerable citizens.',
      icon: Heart,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
  ];

  const features = [
    {
      title: 'Zero Food Wastage',
      desc: 'Divert hundreds of tons of fresh, surplus banquet and restaurant food away from landfills.',
      icon: Sparkles,
    },
    {
      title: 'Volunteer-Powered Logistics',
      desc: 'Decentralized local heroes with thermal transport cases handle safe end-to-end delivery.',
      icon: Truck,
    },
    {
      title: 'Verified NGO Network',
      desc: 'Every orphanage, shelter, and charitable trust is authenticated for genuine community impact.',
      icon: ShieldCheck,
    },
    {
      title: 'Live Real-Time Tracking',
      desc: 'Transparent status lifecycle from kitchen stove to beneficiary plate with stage verification.',
      icon: Clock,
    },
  ];

  const testimonials = [
    {
      quote:
        'FeedForward transformed our banquet operations. Instead of discarding surplus trays from 500-guest weddings, we feed two nearby orphanages within two hours.',
      author: 'Marcus Vance',
      role: 'Executive Chef, Grand Palace Hotel',
      city: 'San Francisco',
    },
    {
      quote:
        'As an orphanage home housing 65 children, predictable access to nutritious, freshly cooked meals from quality caterers has dramatically reduced our food expenses.',
      author: 'Sister Teresa Maria',
      role: 'Director, Hope Haven Care Home',
      city: 'Oakland',
    },
    {
      quote:
        'Being a FeedForward delivery volunteer is the most rewarding 45 minutes of my week. The joy when delivering warm meals to senior homes is priceless.',
      author: 'David Chen',
      role: 'Community Volunteer Hero',
      city: 'Berkeley',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-white via-forest-50/20 to-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Community Food Redistribution Network
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
                Turn Surplus Food Into <br />
                <span className="text-forest-800 underline decoration-emeraldBrand/40 decoration-wavy">
                  Someone's Tomorrow.
                </span>
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                FeedForward connects hotels, event caterers, and generous donors with local
                orphanages, old age homes, and shelters. Driven by passionate volunteer couriers
                who deliver nourishment before good food goes to waste.
              </p>

              {/* Action CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/register?role=donor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-forest-800 hover:bg-forest-900 rounded-2xl transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
                >
                  <Utensils className="w-5 h-5 text-emeraldBrand-light" />
                  Donate Surplus Food
                </Link>

                <Link
                  to="/register?role=volunteer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-gray-800 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl transition shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
                >
                  <Truck className="w-5 h-5 text-forest-700" />
                  Join as Volunteer
                </Link>
              </div>

              {/* Trust markers */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free Platform
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified NGO Partners
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real-time Logistics
                </span>
              </div>
            </div>

            {/* Right Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
                {/* Visual badge */}
                <div className="relative rounded-2xl overflow-hidden bg-forest-900 text-white p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-forest-800/80 border border-forest-700 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-emeraldBrand-light fill-emeraldBrand-light" />
                  </div>
                  <h3 className="text-2xl font-bold">Share More. Waste Less.</h3>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    Over 1/3 of prepared food in events gets wasted while millions face nutritional
                    insecurity. Together, we close that loop.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/browse"
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl transition"
                    >
                      Browse Available Food Now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Micro preview stats widget */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-xl font-black text-forest-800">2 hrs</span>
                    <p className="text-[11px] text-gray-500">Avg. Pickup Time</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-xl font-black text-emerald-600">0%</span>
                    <p className="text-[11px] text-gray-500">Platform Cost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Counter Section */}
      <section id="impact" className="py-12 bg-forest-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-forest-700/60">
            <div className="pt-4 sm:pt-0">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-emeraldBrand-light">
                {stats.totalMealsRescued.toLocaleString()}+
              </span>
              <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-forest-200">
                Meals Rescued
              </p>
            </div>

            <div className="pt-4 sm:pt-0">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {stats.totalDonations.toLocaleString()}+
              </span>
              <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-forest-200">
                Total Donations
              </p>
            </div>

            <div className="pt-4 sm:pt-0">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-emeraldBrand-light">
                {stats.activeVolunteers.toLocaleString()}+
              </span>
              <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-forest-200">
                Active Volunteers
              </p>
            </div>

            <div className="pt-4 sm:pt-0">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {stats.partnerOrganizations.toLocaleString()}+
              </span>
              <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-forest-200">
                Partner Organizations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-50 px-3 py-1 rounded-full border border-forest-100">
              Simple 4-Step Process
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
              How FeedForward Works
            </h2>
            <p className="mt-3 text-base text-gray-600">
              A seamless, transparent bridge from event banquet tables to community dining halls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-offwhite rounded-2xl p-6 border border-gray-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl border ${step.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-gray-300">{step.number}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="about" className="py-20 bg-offwhite border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-50 px-3 py-1 rounded-full border border-forest-100">
              Why FeedForward
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Engineered for Speed, Hygiene, & Impact
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Every feature is built around the strict timelines required to transport fresh cooked meals safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-elevated transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center mb-5 border border-forest-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-50 px-3 py-1 rounded-full border border-forest-100">
              Voices of Change
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Loved by Donors, Volunteers & Charities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-offwhite rounded-2xl p-8 border border-gray-100 flex flex-col justify-between shadow-sm"
              >
                <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                  <div className="w-10 h-10 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-sm">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{t.author}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-forest-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Make a Direct Difference Today?
          </h2>
          <p className="text-base text-forest-100 max-w-2xl mx-auto">
            Whether you have surplus banquet food, want to volunteer your vehicle, or represent a
            care home in need of nutritious meals, join our network now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-forest-900 bg-white hover:bg-forest-50 rounded-xl transition shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/browse"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-forest-800 hover:bg-forest-700 border border-forest-600 rounded-xl transition"
            >
              Explore Current Listings
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
