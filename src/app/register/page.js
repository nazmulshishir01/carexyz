'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiPhone,
  FiCreditCard,
  FiCheck,
  FiX,
  FiCheckCircle,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nid: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const passwordChecks = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.nid) {
      newErrors.nid = 'NID number is required';
    } else if (!/^\d{10,17}$/.test(formData.nid)) {
      newErrors.nid = 'Please enter a valid NID number (10-17 digits)';
    }

    if (!formData.contact) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid Bangladesh phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.lowercase) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          nid: formData.nid,
          contact: formData.contact,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Registration successful! Signing you in...');

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push('/login');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error(error.message);
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
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl" />
      </div>

      <div className="container-custom">
        <div className="max-w-lg mx-auto">
          
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-slate-200">
            
            {/* Header Section */}
            <div className="px-8 pt-10 pb-8 border-b border-slate-200">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                <p className="text-slate-600 text-sm">Join Care.xyz and find trusted caregivers</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Full Name
                  </label>
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors.name
                          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                          : 'border-slate-200 focus:border-teal-500 focus:bg-teal-50/30'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs font-medium mt-2">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors.email
                          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                          : 'border-slate-200 focus:border-teal-500 focus:bg-teal-50/30'
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium mt-2">{errors.email}</p>
                  )}
                </div>

                {/* NID Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    NID Number
                  </label>
                  <div className="relative group">
                    <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                    <input
                      type="text"
                      name="nid"
                      value={formData.nid}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors.nid
                          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                          : 'border-slate-200 focus:border-teal-500 focus:bg-teal-50/30'
                      }`}
                      placeholder="10-17 digit NID number"
                    />
                  </div>
                  {errors.nid && (
                    <p className="text-red-500 text-xs font-medium mt-2">{errors.nid}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Contact Number
                  </label>
                  <div className="relative group">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors.contact
                          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                          : 'border-slate-200 focus:border-teal-500 focus:bg-teal-50/30'
                      }`}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  {errors.contact && (
                    <p className="text-red-500 text-xs font-medium mt-2">{errors.contact}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Password
                  </label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors.password
                          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                          : 'border-slate-200 focus:border-teal-500 focus:bg-teal-50/30'
                      }`}
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  <div className="mt-3 space-y-2 bg-slate-50 rounded-lg p-4">
                    {[
                      { check: passwordChecks.length, text: 'At least 6 characters' },
                      { check: passwordChecks.uppercase, text: 'One uppercase letter' },
                      { check: passwordChecks.lowercase, text: 'One lowercase letter' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                          item.check ? 'text-green-600' : 'text-slate-400'
                        }`}
                      >
                        {item.check ? (
                          <FiCheck className="w-4 h-4 bg-green-600 text-white rounded-full p-0.5" />
                        ) : (
                          <FiX className="w-4 h-4 text-slate-300" />
                        )}
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors.confirmPassword
                          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                          : 'border-slate-200 focus:border-teal-500 focus:bg-teal-50/30'
                      }`}
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs font-medium mt-2">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FiArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-8">
                <div className="flex-grow h-px bg-slate-200" />
                <span className="text-xs text-slate-500 font-medium">OR CONTINUE WITH</span>
                <div className="flex-grow h-px bg-slate-200" />
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 font-medium text-slate-700"
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </button>

              {/* Sign In Link */}
              <p className="text-center mt-8 text-slate-600 text-sm">
                Already have an account?{' '}
                <Link
                  href={`/login${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                  className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Footer Security Info */}
            <div className="bg-slate-50 border-t border-slate-200 px-8 py-6">
              <div className="flex items-center gap-2 text-slate-600">
                <FiCheckCircle size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-xs font-medium">Your data is secure & encrypted</span>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center mt-6 text-slate-600 text-xs">
            Questions?{' '}
            <Link href="/contact" className="text-teal-600 font-semibold hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}