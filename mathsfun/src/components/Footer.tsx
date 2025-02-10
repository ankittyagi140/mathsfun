'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-yellow-500 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-yellow-600">
                  Our Mission
                </Link>
              </li>
              {/* <li>
                <Link href="/team" className="text-gray-600 hover:text-yellow-600">
                  Team
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-yellow-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-yellow-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-yellow-600">
                  Contact Form
                </Link>
              </li>
              <li>
                <a href="mailto:support@maths4fun.com" className="text-gray-600 hover:text-yellow-600">
                  support@maths4fun.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} maths4fun. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;