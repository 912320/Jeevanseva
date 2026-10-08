import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlusSquare } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* About JeevanSeva */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaPlusSquare className="text-primary-300 text-3xl" />
              <span className="font-bold text-xl tracking-tight">
                JeevanSeva
              </span>
            </div>

            <p className="text-primary-100 text-sm leading-relaxed">
              JeevanSeva is a comprehensive healthcare discovery platform.
              Find nearby hospitals, doctors, and pharmacies quickly when you
              need them the most.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm text-primary-200">
              <li>
                <Link
                  to="/hospitals"
                  className="hover:text-white transition-colors"
                >
                  Find Hospital
                </Link>
              </li>

              <li>
                <Link
                  to="/doctors"
                  className="hover:text-white transition-colors"
                >
                  Find Doctor
                </Link>
              </li>

              <li>
                <Link
                  to="/medicines"
                  className="hover:text-white transition-colors"
                >
                  Medicines
                </Link>
              </li>

              <li>
                <Link
                  to="/emergency"
                  className="text-emergency-400 hover:text-emergency-300 transition-colors font-medium"
                >
                  Emergency
                </Link>
              </li>
            </ul>
          </div>

          {/* For Doctors & Hospitals */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">
              For Doctors & Hospitals
            </h3>

            <ul className="space-y-2 text-sm text-primary-200">
              <li>
                <Link
                  to="/register"
                  className="hover:text-white transition-colors"
                >
                  Register as Provider
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Provider Login
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">
              Contact
            </h3>

            <ul className="space-y-2 text-sm text-primary-200">
              <li>
                Email: dassamresh01@gmail.com
              </li>

              <li>
                Phone: +91 9123209380
              </li>

              <li>
                Address: Jamshedpur, Jharkhand, India
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 border-t border-primary-800 text-center">

          <p className="text-sm text-primary-300 mb-2">
            &copy; {new Date().getFullYear()} JeevanSeva. All rights reserved.
          </p>

          <p className="text-xs text-primary-400 max-w-3xl mx-auto">
            Disclaimer: JeevanSeva is a healthcare discovery platform.
            Information provided is for general educational purposes only.
            Always consult qualified medical professionals for diagnosis and
            treatment. In case of emergency, please call your local emergency
            services immediately.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;