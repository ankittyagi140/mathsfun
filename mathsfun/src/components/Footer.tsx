'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-gray-500">
          © 2024 maths4fun. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-yellow-100">Privacy</Link>
          <Link href="/terms" className="hover:text-yellow-100">Terms</Link>
          <Link href="/contact" className="hover:text-yellow-100">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;