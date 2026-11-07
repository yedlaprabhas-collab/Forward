import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Leaf, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-gray-100 shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-4 border border-forest-100">
            <Leaf className="w-8 h-8 text-emeraldBrand" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">404</h1>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-xs text-gray-500 mb-6">
            The destination you are looking for does not exist or may have been relocated.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
