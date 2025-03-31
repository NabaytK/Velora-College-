import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import dashboard components
import BudgetOverview from '../components/dashboard/BudgetOverview';
import AiTips from '../components/dashboard/AiTips';
import ScholarshipFinder from '../components/dashboard/ScholarshipFinder';
import DebtHelper from '../components/dashboard/DebtHelper';
import EarnExtra from '../components/dashboard/EarnExtra';
import WeeklyChallenge from '../components/dashboard/WeeklyChallenge';

const DashboardPage = () => {
  const [user, setUser] = useState({
    name: 'Taylor',
    email: 'taylor@student.edu',
    avatar: null, // Will use initials if null
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    budget: 800,
    spent: 345,
    remaining: 455,
    savingsGoal: 200,
    savingsProgress: 75,
    debt: 12500,
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Function to toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <span className="text-2xl font-bold text-gray-800">Velora</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            <Link
              to="/dashboard"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-primary-600 bg-primary-50"
            >
              <svg
                className="mr-3 h-6 w-6 text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>

            <Link
              to="/transactions"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="mr-3 h-6 w-6 text-gray-400 group-hover:text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Transactions
            </Link>

            <Link
              to="/budget"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="mr-3 h-6 w-6 text-gray-400 group-hover:text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Budget
            </Link>

            <Link
              to="/scholarships"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="mr-3 h-6 w-6 text-gray-400 group-hover:text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
              Scholarships
            </Link>

            <Link
              to="/loans"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="mr-3 h-6 w-6 text-gray-400 group-hover:text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Loans & Debt
            </Link>

            <Link
              to="/earnings"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-600"
            >
              <svg
                className="mr-3 h-6 w-6 text-gray-400 group-hover:text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              Earn Extra
            </Link>
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <Link to="/profile" className="group block flex-shrink-0">
              <div className="flex items-center">
                {user.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    View profile
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                type="button"
                className="text-gray-500 focus:outline-none md:hidden"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-800 md:text-xl">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="rounded-md bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="rounded-md bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading your financial data...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Budget Overview Card */}
              <div className="col-span-1 md:col-span-2 lg:col-span-2">
                <BudgetOverview data={userData} />
              </div>

              {/* AI Tips Card */}
              <div className="col-span-1">
                <AiTips />
              </div>

              {/* Scholarship Finder Card */}
              <div className="col-span-1">
                <ScholarshipFinder />
              </div>

              {/* Debt Helper Card */}
              <div className="col-span-1">
                <DebtHelper data={userData} />
              </div>

              {/* Earn Extra Card */}
              <div className="col-span-1">
                <EarnExtra />
              </div>

              {/* Weekly Challenge Card */}
              <div className="col-span-1">
                <WeeklyChallenge />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardPage;
