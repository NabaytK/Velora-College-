import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Placeholder for future logo
const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
    <span className="text-2xl font-bold text-gray-800">Velora</span>
  </div>
);

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ssn: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    // Formatting for SSN
    if (name === 'ssn') {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '');
      
      // Format as ***-**-1234
      if (digits.length <= 3) {
        newValue = digits;
      } else if (digits.length <= 5) {
        newValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        newValue = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
      }
    }

    // Formatting for phone
    if (name === 'phone') {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '');
      
      // Format as (123) 456-7890
      if (digits.length <= 3) {
        newValue = digits;
      } else if (digits.length <= 6) {
        newValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        newValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : newValue,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.ssn.trim()) {
      newErrors.ssn = 'SSN is required';
    } else if (formData.ssn.replace(/\D/g, '').length !== 9) {
      newErrors.ssn = 'SSN must be 9 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 2 && validateStep2()) {
      setIsLoading(true);
      
      try {
        // Here you would integrate with Firebase Auth and store the additional data
        // in Firestore with the sensitive data encrypted
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirect to dashboard after successful signup
        navigate('/dashboard');
      } catch (error) {
        setErrors({
          ...errors,
          submit: 'Failed to create account. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep1 = () => (
    <>
      <div className="mb-4">
        <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={`w-full rounded-lg border p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="John"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={`w-full rounded-lg border p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Doe"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full rounded-lg border p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full rounded-lg border p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="(123) 456-7890"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="mb-4">
        <label htmlFor="ssn" className="mb-1 block text-sm font-medium text-gray-700">
          Social Security Number (SSN)
        </label>
        <input
          type="text"
          id="ssn"
          name="ssn"
          value={formData.ssn}
          onChange={handleChange}
          className={`w-full rounded-lg border p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
            errors.ssn ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="123-45-6789"
          maxLength={11}
        />
        <p className="mt-1 text-xs text-gray-500">
          Your SSN is securely encrypted and never stored in plain text.
        </p>
        {errors.ssn && (
          <p className="mt-1 text-sm text-red-500">{errors.ssn}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full rounded-lg border p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters long with a mix of letters and numbers.
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full rounded-lg border p-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>
        {errors.agreeToTerms && (
          <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>
        )}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="m-auto w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl md:p-8 lg:p-12">
        <div className="flex justify-center">
          <Link to="/" className="mb-8 inline-block">
            <Logo />
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Create Your Account</h1>
          <p className="mt-2 text-gray-600">Join Velora and take control of your financial future.</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-medium text-gray-500">
            <span className={step >= 1 ? 'text-primary-600' : ''}>Personal Info</span>
            <span className={step >= 2 ? 'text-primary-600' : ''}>Security</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        {errors.submit && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 ? renderStep1() : renderStep2()}

          <div className="flex justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <div></div> {/* Empty div for spacing */}
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-2 text-sm font-medium text-white hover:from-primary-700 hover:to-secondary-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-2 text-sm font-medium text-white hover:from-primary-700 hover:to-secondary-700 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
