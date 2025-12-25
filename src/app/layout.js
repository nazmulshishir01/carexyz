import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/providers/AuthProvider';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata = {
  title: {
    default: 'Care.xyz - Trusted Care Services for Your Family',
    template: '%s | Care.xyz',
  },
  description:
    'Care.xyz provides reliable and trusted care services for children, elderly, and other family members. Find and hire caretakers for babysitting, elderly care, or special care at home.',
  keywords: [
    'babysitting',
    'elderly care',
    'home care',
    'caretaker',
    'childcare',
    'senior care',
    'family care services',
  ],
  authors: [{ name: 'Care.xyz Team' }],
  creator: 'Care.xyz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://care-xyz.vercel.app',
    siteName: 'Care.xyz',
    title: 'Care.xyz - Trusted Care Services for Your Family',
    description:
      'Find reliable caretakers for babysitting, elderly care, and special care services.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Care.xyz - Trusted Care Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Care.xyz - Trusted Care Services',
    description: 'Find reliable caretakers for your family needs.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0d9488" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#134e4a',
                color: '#f0fdfa',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f0fdfa',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f0fdfa',
                },
              },
            }}
          />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
