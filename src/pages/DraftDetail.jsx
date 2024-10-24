import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext , useRef } from 'react';
import { TenderContext } from '../context/TenderProvider';
import Button from '../components/ui/Button';
import Loader from '../components/Loader'; // Import Loader
import { X, Wand2 } from 'lucide-react';
import { Loader2 } from 'lucide-react'; // Import Loader2 from lucide-react


const DraftDetail = () => {
  const { selectedDraft, selectedTender , translate } = useContext(TenderContext);
  const { id } = useParams();
  const [draftText, setDraftText] = useState('');
  const [isPreviousTendersOpen, setIsPreviousTendersOpen] = useState(false);
  const [previousTendersSearch, setPreviousTendersSearch] = useState('');
  const [previousTendersResult, setPreviousTendersResult] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isWandMenuVisible, setIsWandMenuVisible] = useState(false);
  const [isTextModificationOpen, setIsTextModificationOpen] = useState(false);
  const [modifiedText, setModifiedText] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [newText, setNewText] = useState('');
  const [startingIndex, setStartingIndex] = useState(null);
  const [endingIndex, setEndingIndex] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [showSaveButton, setShowSaveButton] = useState(false); // Control Save button visibility
  const [lastSaved, setLastSaved] = useState(''); // Track the last saved time
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const [previousTenderLoading,setPreviousTenderLoading]= useState(false);
// .............
const preRef = useRef(null);
const [translatedTexts, setTranslatedTexts] = useState({});



useEffect(() => {
  const loadTranslations = async () => {
    const translations = {
      backToDrafts: await translate('Back to Drafts'),
      consultPreviousTenders: await translate('Consult Previous Tenders'),
      lastSaved: await translate('Last Saved:'),
      modifyText: await translate('Modify Text'),
      searchPreviousTenders: await translate('Search Previous Tenders'),
      searchPlaceholder: await translate('Enter search terms...'),
      searchButton: await translate('Search'),
      saveNow: await translate('Save Now'),
      close: await translate('Close'),
      applyNow: await translate('Apply Now'),
      searchResultPlaceholder: await translate('Search to show text here'),
      rewrite: await translate('Rewrite'),
      alternative: await translate('Alternative'),
      formal: await translate('Formal'),
      shorter: await translate('Shorter'),
      longer: await translate('Longer'),
      smart: await translate('SMART'),
      active: await translate('Active'),
      modifiedTextHeading: await translate('Modified Text'),
    };
    setTranslatedTexts(translations);
  };

  loadTranslations();
}, [translate]);




  // Load data from localStorage on component mount
  useEffect(() => {
    const storedTitle = localStorage.getItem('title') || selectedDraft?.subject || '';
    const storedLastSaved = localStorage.getItem('lastSaved') || '';
 
    setTitle(storedTitle);
    setLastSaved(storedLastSaved);

    
  }, [selectedDraft]);




  useEffect(() => {
    const sendDraftSubject = async () => {
      try {
        const formData = new FormData();
        formData.append('source', selectedDraft.subject);

        const response = await fetch('http://68.221.120.250:8000/get_tender_source', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to send draft subject');
        const result = await response.json();
        // console.log(result.subject[0].time);
        setDraftText(result.subject);
        setLastSaved(result.subject[0].time);


          // Save to localStorage
          localStorage.setItem('lastSaved', result.subject[0]?.time || '');
          localStorage.setItem('title', title);

      } catch (error) {
        console.error('Error sending draft subject:', error);
      }
    };
    sendDraftSubject();
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection().toString().trim();
    if (selection) setSelectedText(selection);
  };

  const handleTextModification = async (option) => {
    setIsWandMenuVisible(false);
    setSelectedOption(option);
    setLoading(true); // Show loader

    try {
      const formData = new FormData();
      formData.append('text', selectedText);
      formData.append('action', option);
      formData.append('tender', draftText);

      const response = await fetch('http://68.221.120.250:8000/regenerate_text', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setModifiedText(result.text);
      setIsTextModificationOpen(true);
    } catch (error) {
      console.error('Error fetching modified text:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleApplyNow = async () => {
    setLoading(true); // Show loader

    try {
      const formData = new FormData();
      formData.append('text', modifiedText);
      formData.append('tender_name', selectedTender);
      formData.append('draft_name', selectedDraft.subject);

      const response = await fetch('http://68.221.120.250:8000/apply_regen_changes', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setNewText(result.result[0]);
      setStartingIndex(result.result[1]);
      setEndingIndex(result.result[2]);
      setShowSaveButton(true); // Show Save button after regeneration



      if (!response.ok) throw new Error('Failed to apply changes');

      setIsTextModificationOpen(false); // Close the modal
    } catch (error) {
      console.error('Error applying changes:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };





  const handlePreviousTendersSearch = async (e) => {
   e.preventDefault();
    setPreviousTenderLoading(true); // Show loader
    setPreviousTendersResult(''); // Clear previous results
  
    try {
      const formData = new FormData();
      formData.append('Query', previousTendersSearch);
  
      const response = await fetch('http://68.221.120.250:8000/prev_tender_qry', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      setPreviousTendersResult(result.answer);
      console.log(result);
    } catch (error) {
      console.error('Error fetching previous tenders:', error);
    } finally {
      setPreviousTenderLoading(false); // Hide loader
      setPreviousTendersSearch(''); // Clear the input field
    }
  };
  
  



  const renderTextWithHighlight = () => {
    if (startingIndex !== null && endingIndex !== null && newText) {
      const beforeHighlight = newText.slice(0, startingIndex);
      const highlightedText = newText.slice(startingIndex, endingIndex);
      const afterHighlight = newText.slice(endingIndex);

      return (
        <>
          {beforeHighlight}
          <span style={{ color: '#22c55e' }}>{highlightedText}</span>
          {afterHighlight}
        </>
      );
    }
    return newText || draftText[0]?.drafted_tender;
  };



  const handleSaveNow = async () => {
    setLoading(true); // Show loader
  
    try {
      const currentText = preRef.current.innerText; // Get the current content of pre
      const formData = new FormData();
      formData.append('tender_text', currentText);
      formData.append('tender_name', selectedTender);
      formData.append('draft_name', selectedDraft.subject);
  
      const response = await fetch('http://68.221.120.250:8000/save_drafted_tender', {
        method: 'POST',
        body: formData,
      });
    


      if (!response.ok) throw new Error('Failed to save the text');
  
      const result = await response.json(); // Get the updated text from API
      setNewText(result.response[0]); // Update the text in state
      setLastSaved(result.response[1]); // Update last saved time
      setShowSaveButton(false); // Hide Save button

        // Save to localStorage
      localStorage.setItem('lastSaved', result.response[1]);
    } catch (error) {
      console.error('Error saving the text:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };
  


  return (
    <div className="bg-white p-6 rounded-lg shadow relative">
      {loading && <Loader />} {/* Loader shown when loading */}
      {/* <h2 className="text-2xl font-bold mb-4">{selectedDraft?.subject}</h2> */}
      <h2 className="text-2xl font-bold mb-4">
  {localStorage.getItem('selectedDraftName') || localStorage.getItem('title') || 'Draft'}
</h2>


      <div className="flex justify-between mb-4">
        <Button
          className="text-white font-medium text-sm px-5 py-3 rounded-md bg-gray-950 hover:bg-gray-900"
          onClick={() => navigate(-1)}
        >
          {translatedTexts.backToDrafts}
        </Button>

        <Button
          className="text-white font-medium text-sm px-5 py-3 rounded-md bg-gray-950 hover:bg-gray-900"
          onClick={() => setIsPreviousTendersOpen(true)}
        >
         {translatedTexts.consultPreviousTenders}
        </Button>
      </div>

      <p className="text-gray-600 text-xs pb-2 font-medium">{translatedTexts.lastSaved} {lastSaved}</p>

      <div
        className="h-[25rem] w-full rounded-md border p-4 overflow-auto"
        onMouseUp={handleTextSelection}
      >
        <pre
            ref={preRef}
            contentEditable
            suppressContentEditableWarning={true}
            className="whitespace-pre-wrap text-gray-800 font-medium text-sm text-start outline-none"
            onInput={() => setShowSaveButton(true)} // Show Save button on input
          >
            {renderTextWithHighlight()}
          </pre>
      </div>

      {showSaveButton && (
        <Button className="mt-2 py-2 px-4 text-xs bg-gray-950 rounded text-white" onClick={handleSaveNow}>
            {translatedTexts.saveNow}
        </Button>
      )}

      <div className="fixed bottom-40 right-20">
        <Button
          className="bg-white shadow-md rounded-full p-3 border hover:bg-gray-50 transform hover:scale-[105%]"
          size="icon"
          onClick={() => setIsWandMenuVisible(!isWandMenuVisible)}
        >
          <Wand2 className="h-5 w-5 text-gray-800" />
        </Button>

        {isWandMenuVisible && (
          <div className="absolute bottom-full right-full mb-2 w-48 bg-gray-950 p-2 rounded shadow-lg">
            <h4 className="font-medium text-white text-lg mb-2">{translatedTexts.modifyText}</h4>
            {['Rewrite', 'Alternative', 'Formal', 'Shorter', 'Longer', 'SMART', 'Active'].map((option) => (
              <Button
                key={option}
                onClick={() => handleTextModification(option)}
                className="p-2 w-full text-sm text-left text-white hover:bg-gray-800 rounded"
              >
                {translatedTexts[option] || option}
              </Button>
            ))}
          </div>
        )}
      </div>

      {isTextModificationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-lg relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">{translatedTexts.modifiedTextHeading}</h2>
              <button
                className="text-gray-700 hover:text-gray-800"
                onClick={() => setIsTextModificationOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-72 overflow-auto bg-gray-50 border text-sm rounded-md p-4">
              <p>
                <span className="font-bold">{selectedOption}</span>: {modifiedText}
              </p>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                className="text-black font-medium text-sm border border-black border-opacity-40 px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsTextModificationOpen(false)}
              >
               {translatedTexts.close}
              </Button>
              <Button
                className="text-white font-medium text-xs border border-black border-opacity-40 px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
                onClick={handleApplyNow}
              >
                {translatedTexts.applyNow}
              </Button>
            </div>
          </div>
        </div>
      )}
     {isPreviousTendersOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-lg relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-semibold">{translatedTexts.searchPreviousTenders}</h2>
        <button
          className="text-gray-700 hover:text-gray-800"
          onClick={() => {
            setIsPreviousTendersOpen(false); // Close the modal
            setPreviousTendersResult(''); // Clear the result text
          }}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form className="mb-4 flex flex-row items-center gap-2">
        <input
          className="text-sm rounded py-2 border w-full text-gray-600 text-regular focus:outline-none focus:ring-1 focus:ring-black border-gray-300"
          placeholder={translatedTexts.searchPlaceholder}
          value={previousTendersSearch}
          onChange={(e) => setPreviousTendersSearch(e.target.value)}
        />
        <Button
          className="bg-gray-950 text-white text-sm hover:bg-gray-900 px-3 py-2 rounded"
          onClick={handlePreviousTendersSearch}
        >
           {translatedTexts.searchButton}
        </Button>
      </form>

      <div className="bg-gray-50 border rounded-md p-2 h-[24rem] overflow-auto flex justify-center items-center">
        {previousTenderLoading ? (
          <Loader2 className="animate-spin h-10 w-10 text-gray-700" /> // Loader inside result area
        ) : previousTendersResult ? (
         <pre className="whitespace-pre-wrap text-gray-800 font-medium text-sm text-start overflow-auto max-h-full">
  {previousTendersResult}
</pre>
        ) : (
          <p className="text-gray-500 text-sm">{translatedTexts.searchResultPlaceholder}</p>
        )}
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default DraftDetail;
