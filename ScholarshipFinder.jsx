import React, { useState } from 'react';

// Sample scholarship data - in a real app, this would come from an API
const sampleScholarships = [
  {
    id: 1,
    name: "Future Leaders Scholarship",
    amount: 5000,
    deadline: "2023-05-30",
    eligibility: "Full-time students with GPA 3.5+",
    category: "Merit",
    link: "#"
  },
  {
    id: 2,
    name: "Diversity in STEM Grant",
    amount: 3500,
    deadline: "2023-06-15",
    eligibility: "Underrepresented students in STEM fields",
    category: "Diversity",
    link: "#"
  },
  {
    id: 3,
    name: "First Generation Student Award",
    amount: 2500,
    deadline: "2023-07-01",
    eligibility: "First generation college students",
    category: "Need-based",
    link: "#"
  },
  {
    id: 4,
    name: "Community Service Scholarship",
    amount: 1500,
    deadline: "2023-06-20",
    eligibility: "Students with 100+ volunteer hours",
    category: "Service",
    link: "#"
  }
];

const ScholarshipFinder = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate days until deadline
  const daysUntil = (dateString) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter scholarships based on category and search query
  const filteredScholarships = sampleScholarships.filter(scholarship => {
    const matchesFilter = filter === 'all' || scholarship.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Scholarship Finder</h2>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <input
          type="text"
          placeholder="Search scholarships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('merit')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === 'merit'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Merit
          </button>
          <button
            onClick={() => setFilter('need-based')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === 'need-based'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Need-based
          </button>
          <button
            onClick={() => setFilter('diversity')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === 'diversity'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Diversity
          </button>
        </div>
      </div>

      {/* Scholarships List */}
      <div className="space-y-3">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => (
            <div key={scholarship.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{scholarship.name}</h3>
                <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                  ${scholarship.amount.toLocaleString()}
                </div>
              </div>
              
              <p className="mb-3 text-sm text-gray-600">{scholarship.eligibility}</p>
              
              <div className="flex justify-between text-xs">
                <div className="text-gray-500">
                  <span className="font-medium text-gray-700">Deadline:</span> {formatDate(scholarship.deadline)}
                </div>
                
                <div className={`font-medium ${
                  daysUntil(scholarship.deadline) <= 7 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {daysUntil(scholarship.deadline)} days left
                </div>
              </div>
              
              <div className="mt-3 flex justify-between">
                <button className="rounded-md border border-blue-300 bg-white px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">
                  Save
                </button>
                <a 
                  href={scholarship.link} 
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-500">
            No scholarships match your search criteria.
          </div>
        )}
      </div>
      
      {/* View More Button */}
      <div className="mt-4">
        <button className="w-full rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          View More Scholarships
        </button>
      </div>
      
      {/* AI Recommendation */}
      <div className="mt-4 rounded-lg bg-blue-50 p-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-5 w-5 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <h4 className="text-sm font-medium text-blue-800">AI Recommendation</h4>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Based on your major and GPA, you have a strong chance of qualifying for the "Future Leaders Scholarship". Don't miss the May 30th deadline!
        </p>
      </div>
    </div>
  );
};

export default ScholarshipFinder;
