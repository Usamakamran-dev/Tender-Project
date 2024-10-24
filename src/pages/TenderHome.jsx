import React from 'react';

function TenderHome() {
  const translate = (text) => {
    // This is a placeholder translation function
    const translations = {
      "Select a tender from the sidebar or create a new one to get started.": "Selecteer een aanbesteding in de zijbalk of maak een nieuwe aan om te beginnen.",
    };
    return translations[text] || text;
  };

  return (
    <div className="flex h-screen items-center justify-center text-gray-500">
      <h1 className="text-md">
        Select a tender from the sidebar or create a new one to get started
      </h1>
    </div>
  );
}

export default TenderHome;
