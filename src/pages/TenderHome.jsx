import React, { useContext, useEffect, useState } from 'react';
import { TenderContext } from './../context/TenderProvider'; 

function TenderHome() {
  const { translate, language } = useContext(TenderContext); // Use context values
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    const fetchTranslation = async () => {
      const text = await translate(
        'Select a tender from the sidebar or create a new one to get started.'
      );
      setTranslatedText(text);
    };

    fetchTranslation(); // Fetch translation on component mount or language change
  }, [translate, language]); // Re-run on language change

  return (
    <div className="flex h-screen items-center justify-center text-gray-500">
      <h1 className="text-md">{translatedText}</h1>
    </div>
  );
}

export default TenderHome;
