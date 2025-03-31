import React from 'react';

const BudgetOverview = ({ data }) => {
  const { budget, spent, remaining, savingsGoal, savingsProgress } = data;
  
  // Calculate percentages for progress bars
  const spentPercentage = Math.min(100, Math.round((spent / budget) * 100));
  const savingsPercentage = Math.min(100, Math.round((savingsProgress / savingsGoal) * 100));
  
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Budget Overview</h2>
        <div className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
          April 2023
        </div>
      </div>
      
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Budget */}
        <div className="rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-4">
          <div className="mb-2 text-sm font-medium text-primary-700">Monthly Budget</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-primary-900">${budget}</div>
            <div className="text-xs text-primary-700">Available</div>
          </div>
        </div>
        
        {/* Spent So Far */}
        <div className="rounded-lg bg-gradient-to-br from-secondary-50 to-secondary-100 p-4">
          <div className="mb-2 text-sm font-medium text-secondary-700">Spent So Far</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-secondary-900">${spent}</div>
            <div className="text-xs text-secondary-700">{spentPercentage}% of budget</div>
          </div>
        </div>
        
        {/* Remaining */}
        <div className="rounded-lg bg-gradient-to-br from-accent-50 to-accent-100 p-4">
          <div className="mb-2 text-sm font-medium text-accent-700">Remaining</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-accent-900">${remaining}</div>
            <div className="text-xs text-accent-700">Until next month</div>
          </div>
        </div>
      </div>

      {/* Spending Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Budget Used</div>
          <div className="text-sm font-medium text-gray-700">{spentPercentage}%</div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              spentPercentage < 70 
                ? 'bg-green-500' 
                : spentPercentage < 90 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
            }`}
            style={{ width: `${spentPercentage}%` }}
          ></div>
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <div>$0</div>
          <div>${budget}</div>
        </div>
      </div>

      {/* Savings Goal Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Savings Goal Progress</div>
          <div className="text-sm font-medium text-gray-700">${savingsProgress} of ${savingsGoal}</div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div 
            className="h-full rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${savingsPercentage}%` }}
          ></div>
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <div>$0</div>
          <div>${savingsGoal}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Recent Transactions</h3>
          <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-800">
            View All
          </a>
        </div>
        <div className="space-y-3">
          {/* Transaction Item */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Campus Bookstore</p>
                <p className="text-xs text-gray-500">Apr 3, 2023</p>
              </div>
            </div>
            <div className="text-sm font-semibold text-red-600">-$58.99</div>
          </div>

          {/* Transaction Item */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 text-secondary-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Campus Cafe</p>
                <p className="text-xs text-gray-500">Apr 2, 2023</p>
              </div>
            </div>
            <div className="text-sm font-semibold text-red-600">-$12.50</div>
          </div>

          {/* Transaction Item */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Part-time Job</p>
                <p className="text-xs text-gray-500">Apr 1, 2023</p>
              </div>
            </div>
            <div className="text-sm font-semibold text-green-600">+$150.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
