import React, { useContext, useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import ScrollArea from './ui/ScrollArea';
import { PlusCircle } from 'lucide-react';
import { TenderContext } from '../context/TenderProvider';
import Loader from './Loader'; // Importing the Loader component

function Sidebar() {
  const {
    tenders,
    fetchTenders,
    setSelectedTender,
    setShowChatIcon,
    translate
  } = useContext(TenderContext); 

  const navigate = useNavigate();
  const [translatedTexts, setTranslatedTexts] = useState({});

   // Load translations for static texts
   useEffect(() => {
    const loadTranslations = async () => {
      const translations = {
        startNewTender: await translate('Start New Tender'),
        currentTenders: await translate('Current Tenders'),
        noTenders: await translate('No tenders added.'),
      };
      setTranslatedTexts(translations);
    };

    loadTranslations();
  }, [translate]);

  useEffect(() => {
    fetchTenders(); // Fetch tenders when the component mounts
  }, [fetchTenders]);





  const navigateDraft = (selectedTender) => {
    setSelectedTender(selectedTender);
    setShowChatIcon(true);
    navigate(
      `/tender/${selectedTender
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') 
        .replace(/[^\w-]/g, '')}` 
    );
  };

  if (!tenders) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-[18vw] bg-white shadow-md py-8 flex flex-col gap-4">
      <div className="p-4">
        <Button
          className="bg-black text-white flex items-center justify-center gap-2 py-3 w-full rounded-md hover:bg-gray-800 text-semibold text-sm"
          onClick={() => navigate('/new-tender')}
        >
          <PlusCircle className="h-4 w-auto" />
          {translatedTexts.startNewTender}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-144px)]">
        <div className="p-4 flex flex-col items-start gap-3">
          <h2 className="text-lg font-semibold pb-2"> {translatedTexts.currentTenders}</h2>

          {tenders.length > 0 ? (
            tenders.map((tender) => (
              <Button
                key={tender}
                variant="ghost"
                className="w-full flex flex-col items-start px-2 py-3 hover:bg-gray-50 border border-black border-opacity-10
                  transform transition-transform duration-500 hover:scale-[103%] rounded"
                onClick={() => navigateDraft(tender)}
              >
                <span className="font-semibold text-sm text-nowrap">{tender}</span>
              </Button>
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-4 text-center w-full">{translatedTexts.noTenders}</p> // Display when no tenders
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
