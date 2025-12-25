'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Welcome back!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-8 py-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👋</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
              <p className="text-teal-100 mt-2">Sign in to continue to Care.xyz</p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field pl-12 ${
                        errors.email ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`input-field pl-12 pr-12 ${
                        errors.password ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <span className="loader w-5 h-5 border-2"></span>
                  ) : (
                    <>
                      Sign In
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-grow h-px bg-gray-200" />
                <span className="text-sm text-gray-500">or continue with</span>
                <div className="flex-grow h-px bg-gray-200" />
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FcGoogle className="text-xl" />
                <span className="font-medium text-gray-700">Google</span>
              </button>

              {/* Register Link */}
              <p className="text-center mt-6 text-gray-600">
                Don't have an account?{' '}
                <Link
                  href={`/register${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                  className="text-teal-700 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
