'use client';

import Link from 'next/link';
import { FiArrowRight, FiPhone, FiMail } from 'react-icons/fi';

export default function CTA() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 rounded-3xl overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl" />
          </div>

          {/* Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-50" />

          <div className="relative px-8 py-16 md:px-16 md:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Ready to Experience
                  <span className="block text-orange-400">Quality Care?</span>
                </h2>
                <p className="text-teal-100 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                  Join thousands of families who trust Care.xyz for their caregiving needs.
                  Book your first service today and experience the difference.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link
                    href="/service/baby-care"
                    className="bg-white text-teal-700 px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-orange-400 hover:text-white transition-colors"
                  >
                    Book Now
                    <FiArrowRight />
                  </Link>
                  <a
                    href="tel:+8801234567890"
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-white hover:text-teal-700 transition-colors"
                  >
                    <FiPhone />
                    Call Us
                  </a>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-orange-400 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-orange-400 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-orange-400 transition-colors"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={3}
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Send Message
                    <FiMail />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
