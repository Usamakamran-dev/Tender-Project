import React , { useContext ,  useState , useEffect } from 'react';
import Button from './ui/Button';
import { Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TenderContext } from '../context/TenderProvider';

function Header() {
  const {
    setShowChatIcon,
    translate, // Use translate function from context
    language,
    toggleLanguage // Function to toggle language from context
  } = useContext(TenderContext);
  const navigate = useNavigate(); 


   // States to hold translated texts
   const [translatedDashboard, setTranslatedDashboard] = useState('');
   const [translatedUploads, setTranslatedUploads] = useState('');
 
   // Function to load translations
   const loadTranslations = async () => {
     setTranslatedDashboard(await translate('Tender Dashboard'));
     setTranslatedUploads(await translate('Previous tenders Upload'));
   };

   useEffect(() => {
    loadTranslations();
  }, [language]);  // Depend on language to re-trigger t
 

  const tenderIconClick= () => {
    navigate('/');
    setShowChatIcon(false);
  }

  const previousTenders= () => {
    navigate('previous-tenders')
    setShowChatIcon(false);
  }


  const togglePositionClass = language === 'EN' ? 'translate-x-0' : 'translate-x-full';



  
  return (
    <header className="bg-white shadow-sm py-5 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 onClick={tenderIconClick}
        className="text-2xl font-semibold cursor-pointer"> {translatedDashboard}</h1>
      </div>
      <div className="flex items-center gap-8">
        <Button
          onClick={previousTenders}
          variant="outline"
          className="text-black font-medium text-sm border border-black border-opacity-10 px-3 py-2 rounded-md hover:bg-gray-50"
        >
          {translatedUploads}
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">EN</span>
          <label className="relative inline-block w-10 h-6">
            <input
              type="checkbox"
              checked={language === 'NL'}
              onChange={toggleLanguage}
              className="sr-only"
            />
            <div className="bg-gray-200 absolute left-0 top-0 w-full h-full rounded-full transition-colors duration-200"></div>
            <div className={`${togglePositionClass} bg-black inline-block w-6 h-6 rounded-full border-2 border-gray-400 transform transition-transform duration-200`}></div>
          </label>
          <span className="text-sm font-medium">NL</span>
        </div>

        <Button variant="ghost" size="icon" className="text-black font-bold hover:bg-gray-50 p-2 rounded-md">
          <Settings className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-black font-bold hover:bg-gray-50 p-2 rounded-md">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

export default Header;
