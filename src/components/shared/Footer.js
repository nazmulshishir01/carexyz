import Link from 'next/link';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Baby Care', href: '/service/baby-care' },
    { name: 'Elderly Care', href: '/service/elderly-care' },
    { name: 'Sick People Care', href: '/service/sick-care' },
  ];

  const quickLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Contact', href: '/#contact' },
  ];

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white">
      {/* Main Footer */}
      <div className="container-custom pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Care.xyz Logo"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold">
                <span className="text-white">Care</span>
                <span className="text-orange-400">.xyz</span>
              </span>
            </Link>
            <p className="text-teal-200 text-sm leading-relaxed">
              Providing trusted and reliable care services for your loved ones. We make caregiving easy, secure, and accessible for everyone.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-teal-300 hover:text-orange-400 transition-colors duration-300"
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-base font-semibold mb-4 relative inline-block text-white">
              Our Services
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-orange-500 rounded-full" />
            </h3>
            <ul className="space-y-3 mt-4">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-teal-200 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-base font-semibold mb-4 relative inline-block text-white">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-orange-500 rounded-full" />
            </h3>
            <ul className="space-y-3 mt-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-teal-200 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-base font-semibold mb-4 relative inline-block text-white">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-orange-500 rounded-full" />
            </h3>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3 text-teal-200 text-sm">
                <FiMapPin className="text-orange-400 text-base mt-0.5 flex-shrink-0" />
                <span>House 123, Gulshan-2, Dhaka 1212, Bangladesh</span>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="flex items-center gap-3 text-teal-200 hover:text-orange-400 transition-colors text-sm"
                >
                  <FiPhone className="text-orange-400 text-base" />
                  +880 1234-567890
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@care.xyz"
                  className="flex items-center gap-3 text-teal-200 hover:text-orange-400 transition-colors text-sm"
                >
                  <FiMail className="text-orange-400 text-base" />
                  support@care.xyz
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-teal-700/30">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-teal-400 text-xs">
              © {currentYear} Care.xyz. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs">
              <Link
                href="#"
                className="text-teal-400 hover:text-orange-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-teal-400 hover:text-orange-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
