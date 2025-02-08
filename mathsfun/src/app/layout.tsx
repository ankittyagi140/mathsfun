import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Comic_Neue } from 'next/font/google';
import { Providers } from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserProvider } from '../context/UserContext';
import { ReduxProvider } from '../providers/ReduxProvider';
import { Lilita_One, Luckiest_Guy, Fredoka } from 'next/font/google';
import './fonts.css';
import HydrateStore from '@/components/HydrateStore';
import { SnackbarProvider } from '@/context/SnackbarContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comicNeue = Comic_Neue({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-comic-neue'
});

// Metadata needs to be in a separate file for app router
export const metadata: Metadata = {
  title: 'maths2fun - Interactive Math Learning',
  description: 'Learn math through fun interactive games and puzzles',
  icons: {
    icon: '/favicon.ico',
  },
};

// Choose one of these fonts:
const headingFont = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="icon"
          href="/maths4fun.png"
          type="image/png"
          sizes="512x512"
        />
      </head>
      <body className="bg-yellow-50">
        <Providers>
          <SnackbarProvider>
            <HydrateStore />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </SnackbarProvider>
        </Providers>
      </body>
    </html>
  );
}
