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
import { SidebarProvider } from '@/context/Sidebar';

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
  title: 'Maths2Fun - Interactive Math Learning Platform',
  description: 'Master mathematics through engaging quizzes, interactive lessons, and fun problem-solving challenges. Suitable for all skill levels from beginner to advanced.',
  keywords: ['math learning', 'interactive quizzes', 'mathematics education', 'problem solving', 'online math practice'],
  openGraph: {
    title: 'Maths2Fun - Learn Math the Fun Way',
    description: 'Transform your math skills with our interactive learning platform',
    images: [
      {
        url: '/maths2fun-og.png',
        width: 1200,
        height: 630,
        alt: 'Maths2Fun Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maths2Fun - Interactive Math Learning',
    description: 'Engaging math education platform for all ages',
    images: ['/maths2fun-twitter.png'],
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
            <SidebarProvider>
              <HydrateStore />
              <Header />
              <main className="min-h-screen p-8 bg-white">{children}</main>
              <Footer />
            </SidebarProvider>
          </SnackbarProvider>
        </Providers>
      </body>
    </html>
  );
}
