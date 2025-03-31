import React, { useState } from 'react';

const WeeklyChallenge = () => {
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Current week's challenge data - in a real app, this would come from an API
  const challenge = {
    title: "Coffee Budget Challenge",
    description: "Skip buying coffee from cafes this week and make your own at home instead.",
    potentialSavings: 25,
    duration: "7 days",
    difficulty: "Easy",
    tips: [
      "Invest in a simple coffee maker if you don't have one.",
      "Prepare coffee at home and bring it in a travel mug.",
      "Calculate how much you'll save each day and watch it add up!"
    ]
  };
  
  // Handle accepting the challenge
  const acceptChallenge = () => {
    setChallengeAccepted(true);
  };
  
  // Handle updating progress
  const updateProgress = (newProgress) => {
    setProgress(newProgress);
  };
  
  // Calculate savings based on progress
  const calculatedSavings = Math.round((progress / 100) * challenge.potentialSavings);

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Weekly Challenge</h2>
      </div>
      
      <div className="mb-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
        <h3 className="mb-2 text-lg font-semibold text-amber-800">{challenge.title}</h3>
        <div className="mb-2 flex text-xs">
          <span className="mr-2 rounded-full bg-amber-200 px-2 py-0.5 font-medium text-amber-800">
            {challenge.difficulty}
          </span>
          <span className="rounded-full bg-amber-200 px-2 py-0.5 font-medium text-amber-800">
            {challenge.duration}
          </span>
        </div>
        <p className="text-sm text-gray-700">{challenge.description}</p>
      </div>
      
      {!challengeAccepted ? (
        <div className="mb-4 text-center">
          <div className="mb-3 text-sm text-gray-700">
            Potential Savings: <span className="font-bold text-green-600">${challenge.potentialSavings}</span>
          </div>
          <button 
            onClick={acceptChallenge}
            className="w-full rounded-md bg-gradient-to-r from-amber-600 to-yellow-500 py-2 text-sm font-medium text-white hover:from-amber-700 hover:to-yellow-600"
          >
            Accept Challenge
          </button>
          <div className="mt-2 text-xs text-gray-500">
            {Math.floor(Math.random() * 100) + 200} students accepted this challenge
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">Your Progress</div>
            <div className="text-sm font-medium text-gray-700">{progress}% Complete</div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="mt-3 flex justify-between text-sm">
            <div className="text-gray-700">
              Current Savings: <span className="font-bold text-green-600">${calculatedSavings}</span>
            </div>
            <div className="text-gray-700">
              Goal: <span className="font-bold text-amber-600">${challenge.potentialSavings}</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between gap-2">
            <button 
              onClick={() => updateProgress(Math.min(100, progress + 25))}
              className="flex-1 rounded-md bg-amber-500 py-2 text-xs font-medium text-white hover:bg-amber-600"
              disabled={progress >= 100}
            >
              Log Progress
            </button>
            <button 
              onClick={() => setChallengeAccepted(false)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Quit
            </button>
          </div>
        </div>
      )}
      
      {/* Challenge Tips */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">Tips for Success</h3>
        <ul className="space-y-2">
          {challenge.tips.map((tip, index) => (
            <li key={index} className="flex items-start text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Next Week Preview */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <h3 className="mb-1 text-xs font-medium uppercase text-gray-500">Next Week's Challenge</h3>
        <p className="text-sm text-gray-700">Meal Prep Challenge: Prepare your lunches for the week to save money and eat healthier.</p>
        <div className="mt-1 text-xs text-gray-500">Potential Savings: $40</div>
      </div>
    </div>
  );
};

export default WeeklyChallenge;
