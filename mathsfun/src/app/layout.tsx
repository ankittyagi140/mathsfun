import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './fonts.css';
import HydrateStore from '@/components/HydrateStore';
import { SnackbarProvider } from '@/context/SnackbarContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Metadata needs to be in a separate file for app router
export const metadata: Metadata = {
  metadataBase: new URL('https://maths2fun.com'),
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
  alternates: {
    canonical: 'https://maths2fun.com',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  verification: {
    google: 'zLtGgfAeZHTInXu9ONOVqwRsiz_AdOy1yZPcMNcKDqc',
  }
};

// Choose one of these fonts:


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
          href="/maths2fun.png"
          type="image/png"
          sizes="512x512"
        />
        <meta name="google-site-verification" content="zLtGgfAeZHTInXu9ONOVqwRsiz_AdOy1yZPcMNcKDqc" />
      </head>
      <body className="bg-yellow-50">
        <ThemeProvider>
          <Providers>
            <SnackbarProvider>
                <HydrateStore />
                <Header />
                <main className="min-h-screen p-8 bg-white">{children}</main>
                <Footer />
            </SnackbarProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
