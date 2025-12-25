'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/service/baby-care', label: 'Baby Care' },
    { href: '/service/elderly-care', label: 'Elderly Care' },
    { href: '/service/sick-care', label: 'Sick Care' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setIsDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white text-xl">🏠</span>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-teal-700">Care</span>
              <span className="text-orange-500">.xyz</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-medium transition-colors duration-300 ${
                  isActive(link.href)
                    ? 'text-teal-700'
                    : 'text-gray-600 hover:text-teal-700'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-white rounded-full pl-2 pr-4 py-2 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-white text-sm" />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium text-sm">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/my-bookings"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiCalendar className="text-lg" />
                      <span>My Bookings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <FiLogOut className="text-lg" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 font-medium hover:text-teal-700 transition-colors"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-6">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-teal-700 transition-colors"
          >
            {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-white rounded-2xl shadow-xl p-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-2 font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-teal-700'
                      : 'text-gray-600 hover:text-teal-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              {session ? (
                <>
                  <Link
                    href="/my-bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-gray-700"
                  >
                    <FiCalendar className="text-lg" />
                    <span>My Bookings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 py-2 text-red-600"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 text-gray-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
