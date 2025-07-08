import React from 'react';

const CategoryTabs = () => {
  const tabs = [
    { id: 'basic', label: 'Basic Pitch ($10)', active: true },
    { id: 'full', label: 'Full Pitch Site ($29)', active: false },
    { id: 'vc', label: 'VC-Ready Export ($79)', active: false },
  ];

  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
            tab.active
              ? 'bg-white text-gray-900 shadow-lg'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;