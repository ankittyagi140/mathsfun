import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Comic_Neue } from 'next/font/google';
import Providers from '../components/Providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserProvider } from '../context/UserContext';
import { ReduxProvider } from '../providers/ReduxProvider';

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
  title: "MathsFun - Learning Games",
  description: "Fun educational games for kids",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${comicNeue.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <ReduxProvider>
          <UserProvider>
            <Header />
            <main className="flex-1">
              <Providers>
                <div className="min-h-screen">
                  {children}
                </div>
              </Providers>
            </main>
            <Footer />
          </UserProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
