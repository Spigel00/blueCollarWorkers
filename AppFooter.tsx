
import React from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

export const AppFooter = () => {
  return (
    <footer className="bg-blue-collar-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold">Blue Collar Connect</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Connecting skilled workers with the right jobs. We help blue-collar professionals
              find opportunities that match their skills and experience.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">For Workers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-blue-collar-300">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-collar-300">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/career-resources" className="hover:text-blue-collar-300">
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/post-job" className="hover:text-blue-collar-300">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-collar-300">
                  Create Company Profile
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-collar-300">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-collar-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-collar-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-collar-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-collar-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-collar-800 text-sm text-gray-400 text-center">
          <p>&copy; 2025 Blue Collar Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
