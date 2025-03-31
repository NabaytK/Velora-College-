import React, { useState } from 'react';

const DebtHelper = ({ data }) => {
  const { debt } = data;
  const [showDetails, setShowDetails] = useState(false);
  
  // Sample debt breakdown - in a real app, this would come from the backend
  const debtDetails = [
    { type: 'Federal Student Loans', amount: 10000, interestRate: 4.5 },
    { type: 'Private Student Loan', amount: 2000, interestRate: 5.8 },
    { type: 'Credit Card', amount: 500, interestRate: 15.99 },
  ];
  
  // Calculate monthly interest
  const calculateMonthlyInterest = (amount, rate) => {
    return (amount * (rate / 100)) / 12;
  };
  
  // Calculate total monthly interest
  const totalMonthlyInterest = debtDetails.reduce(
    (sum, debt) => sum + calculateMonthlyInterest(debt.amount, debt.interestRate),
    0
  );
  
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Debt Helper</h2>
      </div>

      {/* Debt Overview */}
      <div className="mb-4 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="mb-2 text-sm font-medium text-gray-700">Total Debt</div>
        <div className="mb-2 text-2xl font-bold text-gray-900">${debt.toLocaleString()}</div>
        <div className="flex justify-between text-sm">
          <div>
            <span className="font-medium text-red-600">${totalMonthlyInterest.toFixed(2)}</span> in interest per month
          </div>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary-600 hover:text-primary-800"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {/* Debt Details */}
      {showDetails && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Debt Breakdown</h3>
          
          <div className="space-y-3">
            {debtDetails.map((debt, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium text-gray-800">{debt.type}</div>
                  <div className="text-xs text-gray-500">{debt.interestRate}% interest</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-800">${debt.amount.toLocaleString()}</div>
                  <div className="text-xs text-red-600">
                    ${calculateMonthlyInterest(debt.amount, debt.interestRate).toFixed(2)}/mo interest
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repayment Strategy */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Recommended Repayment Strategy</h3>
        <ol className="ml-5 list-decimal space-y-2 text-sm text-gray-700">
          <li>Pay off the Credit Card debt first (highest interest rate)</li>
          <li>Make minimum payments on federal loans while in school</li>
          <li>Consider refinancing private loans after graduation</li>
        </ol>
      </div>

      {/* Payoff Calculator */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">Debt Payoff Calculator</h3>
        
        <div className="mb-3">
          <label htmlFor="monthly-payment" className="block text-xs text-gray-500">
            Monthly Payment
          </label>
          <input
            type="number"
            id="monthly-payment"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="250"
            defaultValue="250"
          />
        </div>
        
        <div className="mb-3 flex justify-between text-sm">
          <div className="text-gray-700">Estimated payoff time:</div>
          <div className="font-medium text-gray-900">5 years, 2 months</div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="text-gray-700">Total interest paid:</div>
          <div className="font-medium text-red-600">$1,845</div>
        </div>
        
        <button className="mt-3 w-full rounded-md bg-gradient-to-r from-red-600 to-orange-600 py-2 text-sm font-medium text-white hover:from-red-700 hover:to-orange-700">
          Create Detailed Payoff Plan
        </button>
      </div>

      {/* AI Tips */}
      <div className="mt-4 rounded-lg bg-amber-50 p-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-5 w-5 text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <h4 className="text-sm font-medium text-amber-800">AI Tip</h4>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Look into income-driven repayment plans for your federal loans. Based on your situation, you might qualify for reduced monthly payments.
        </p>
      </div>
    </div>
  );
};

export default DebtHelper;
