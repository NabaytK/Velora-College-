import React, { useState } from 'react';
import { useApi } from '../../services/api';

const AiTips = () => {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [aiResponse, setAiResponse] = useState({
    budget_tip: "Try cooking at home 2–3 times this week instead of eating out. You could save around $30.",
    savings_tip: "Set aside $10 today—small but consistent deposits build good financial habits!",
    explanation: "Credit scores range from 300-850 and represent your creditworthiness. Paying bills on time and keeping balances low are the two most important factors.",
    scholarship_suggestion: "Check out the 'Student Financial Relief Scholarship' which offers up to $2,000 for students with demonstrated financial need.",
    earn_extra_suggestion: "Consider online tutoring platforms like Chegg or Wyzant where you can earn $15-25/hr helping other students in subjects you excel at.",
    timestamp: new Date().toISOString()
  });
  
  const api = useApi();
  
  // Format the timestamp to a readable date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Handle topic input change
  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  // Handle form submission to get new AI tips
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    
    try {
      // Call our backend API to get insights from OpenAI
      const userData = {
        budget: 800, // In real app, this would come from user's data
        spent: 345,
        goal: 200,
        debt: 12500,
        topic: topic
      };
      
      const response = await api.getFinancialInsights(userData);
      
      if (response && response.insights) {
        setAiResponse({
          ...response.insights,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching AI tips:', error);
      // Keep the old response in case of error
    } finally {
      setLoading(false);
      setTopic('');
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-purple-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Velora AI Tips</h2>
      </div>

      <div className="mb-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
        <div className="mb-1 text-xs text-gray-500">
          Last updated: {formatDate(aiResponse.timestamp)}
        </div>
        
        <div className="mb-3">
          <h3 className="text-xs font-semibold uppercase text-purple-700">Budget Tip</h3>
          <p className="text-sm text-gray-800">{aiResponse.budget_tip}</p>
        </div>
        
        <div className="mb-3">
          <h3 className="text-xs font-semibold uppercase text-purple-700">Savings Suggestion</h3>
          <p className="text-sm text-gray-800">{aiResponse.savings_tip}</p>
        </div>
        
        <div className="mb-3">
          <h3 className="text-xs font-semibold uppercase text-purple-700">Financial Concept Explained</h3>
          <p className="text-sm text-gray-800">{aiResponse.explanation}</p>
        </div>
        
        <div className="mb-3">
          <h3 className="text-xs font-semibold uppercase text-purple-700">Scholarship Suggestion</h3>
          <p className="text-sm text-gray-800">{aiResponse.scholarship_suggestion}</p>
        </div>
        
        <div>
          <h3 className="text-xs font-semibold uppercase text-purple-700">Earn Extra Money</h3>
          <p className="text-sm text-gray-800">{aiResponse.earn_extra_suggestion}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Want to learn about something specific?
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={topic}
            onChange={handleTopicChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="e.g., student loans, budgeting, interest rates"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 py-2 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Thinking...
            </span>
          ) : (
            'Get AI Advice'
          )}
        </button>
      </form>
    </div>
  );
};

export default AiTips;
