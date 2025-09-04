import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <FaUserMd className="text-3xl text-indigo-400 mr-2" />
              <span className="text-2xl font-bold text-white">MediCare</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted healthcare platform for booking appointments with top doctors and managing your medical needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-indigo-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/book-appointment" className="text-gray-300 hover:text-indigo-400 transition-colors">Book Appointment</Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-300 hover:text-indigo-400 transition-colors">Our Doctors</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-indigo-400 mt-1 mr-3" />
                <span className="text-gray-300">123 Healthcare Ave, Medical District</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-indigo-400 mr-3" />
                <span className="text-gray-300">+91 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-indigo-400 mr-3" />
                <span className="text-gray-300">info@medicare.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} MediCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;