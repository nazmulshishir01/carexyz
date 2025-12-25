'use client';

import Link from 'next/link';
import { FiArrowRight, FiPlay, FiShield, FiHeart, FiClock } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-float delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSIjMGQ5NDg4IiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-50" />
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                Trusted by 10,000+ Families
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-800">Caring for</span>
              <br />
              <span className="gradient-text">Your Loved Ones</span>
              <br />
              <span className="text-gray-800">Like Family</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Professional caregivers for babies, elderly, and those who need special care.
              Experience peace of mind with our trusted, verified, and compassionate care
              services available 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/service/baby-care" className="btn-primary group">
                Book a Caregiver
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="flex items-center gap-3 px-6 py-3 rounded-full border-2 border-teal-600 text-teal-700 font-semibold hover:bg-teal-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <FiPlay className="text-teal-700 ml-1" />
                </div>
                Watch How It Works
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                  <FiShield className="text-teal-700 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Verified</p>
                  <p className="text-sm text-gray-500">Background Checked</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FiHeart className="text-orange-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Caring</p>
                  <p className="text-sm text-gray-500">Compassionate Staff</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiClock className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">24/7</p>
                  <p className="text-sm text-gray-500">Always Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative animate-fade-in-up delay-200">
            {/* Main Image */}
            <div className="relative z-10">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-pulse-glow">
                <img
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop"
                  alt="Caring for elderly"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 via-transparent to-transparent" />

                {/* Floating Stats Card */}
                <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Happy Families</p>
                      <p className="text-2xl font-bold text-teal-700">10,000+</p>
                    </div>
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-teal-400 to-teal-600"
                        />
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        +99
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400 rounded-2xl rotate-12 opacity-20" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal-400 rounded-full opacity-20" />

            {/* Floating Badge */}
            <div className="absolute -top-6 right-12 bg-white rounded-2xl shadow-xl p-4 animate-bounce-gentle">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">4.9/5</p>
                  <p className="text-xs text-gray-500">2000+ Reviews</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
