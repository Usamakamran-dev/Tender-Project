import React, { createContext, useState , useEffect ,useCallback } from 'react';
import Loader from '../components/Loader'; // Import the loader component



export const TenderContext = createContext();

const TenderProvider = (props) => {    
  const [tenders, setTenders] = useState([]); // Manage tenders in the context
  const [selectedTender , setSelectedTender] = useState('');
  const [selectedDraft, setSelectedDraft]=useState('');
  const [loadingTranslations, setLoadingTranslations] = useState(false); // Track translation loading

// ..................................



const [selectedFolder, setSelectedFolder] = useState(() => {
  const savedFolder = localStorage.getItem('selectedFolder');
  return savedFolder ? JSON.parse(savedFolder) : null;
});


const [language, setLanguage] = useState('EN');  // Added state to manage language

// Function to toggle language
const toggleLanguage = () => {
  const newLang = language === 'EN' ? 'NL' : 'EN';
  setLanguage(newLang);
  // Add any other logic to react to language change here
};


const translate = async (text, sourceLang = 'en', targetLang = 'nl') => {
  if (language === 'EN') {
    return text;  // Return the text unchanged if the language is English
  } else {
    const apiKey = 'AIzaSyABD5cZ4zAPW0rod5-BwqV_rb9jNZ1accw'; // Securely manage this key, ideally not here
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
        }),
      });
      const data = await response.json();

      // Check if the HTTP request was successful
      if (!response.ok) {
        console.error('Translation API error:', data);
        throw new Error(`Failed to translate text: ${data.error.message}`);
      }

      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Error during translation:', error);
      return text;  // Return original text as a fallback to ensure user experience continuity
    }finally {
      setLoadingTranslations(false); // End loading
    }
  }
};





useEffect(() => {
  if (selectedFolder) {
    localStorage.setItem('selectedFolder', JSON.stringify(selectedFolder));
  }
}, [selectedFolder]);


// ........................
  const [showChatIcon, setShowChatIcon] = useState(false);
  const {apiCall,setApiCall} = useState(false);
  const [tenderDraft,setTenderDraft] = useState(false);


    // Function to fetch tenders from the backend
    const fetchTenders = useCallback(async () => {
      try {
        const response = await fetch('http://68.221.120.250:8000/list_vector_db');
        if (!response.ok) {
          throw new Error('Failed to fetch tenders');
        }
        const data = await response.json();
        setTenders(data);
        console.log('Running', data); // This will only log once
      } catch (error) {
        console.error('Error fetching tenders:', error);
      }
    }, []);
  
    useEffect(() => {
      fetchTenders(); // Fetch tenders when the component mounts
    }, [fetchTenders, apiCall]);

    



  const contextValue = {
    tenders,
    setTenders,
    selectedTender,
    setSelectedTender,
    showChatIcon,
    setShowChatIcon,
    apiCall,
    setApiCall,
    tenderDraft,
    setTenderDraft,
    selectedDraft,
    setSelectedDraft,
    fetchTenders,
    selectedFolder,
    setSelectedFolder,
    language,
    setLanguage,
    toggleLanguage,
    translate
  };

  return (
    <TenderContext.Provider value={contextValue}>
      {props.children}
    </TenderContext.Provider>
  );
};

export default TenderProvider;
