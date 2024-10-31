import React, { createContext, useState , useEffect ,useCallback } from 'react';
import Loader from '../components/Loader'; // Import the loader component




const translations = {
  EN: {
    'Close': 'Close',
    'Tender Dashboard': 'Tender Dashboard',
    'Previous tenders Upload': 'Previous tenders Upload',
    'Upload Previous Tenders': 'Upload Previous Tenders',
    '+ Upload NEW Documents': '+ Upload NEW Documents',
    'No folders available.': 'No folders available.',
    'Failed to fetch documents.': 'Failed to fetch documents.',
    'Document': 'Document',
    'Nr': 'Nr',
    'Upload Date': 'Upload Date',
    'Type': 'Type',
    'Document Name': 'Document Name',
    'Size': 'Size',
    'Actions': 'Actions',
    'Are you sure you want to delete the document "{name}"?': 
      'Are you sure you want to delete the document "{name}"?',
    'No documents added to this folder.': 'No documents added to this folder.',
    'Cancel': 'Cancel',
    'Delete': 'Delete',
    'Confirm Delete': 'Confirm Delete',
    'Start New Tender': 'Start New Tender',
    'Current Tenders': 'Current Tenders',
    'No tenders added.': 'No tenders added.',
    'Loading...': 'Loading...',
    'Enter tender name': 'Enter tender name',
    'Enter tender description': 'Enter tender description',
    'Upload Documents': 'Upload Documents',
    'Uploaded Files': 'Uploaded Files',
    'Add Tender': 'Add Tender',
    'New Tender added successfully!': 'New Tender added successfully!',
    'Edit Tender Name': 'Edit Tender Name',
    'Confirm Delete Tender': 'Confirm Delete Tender',
    'Confirm Delete Draft': 'Confirm Delete Draft',
    'New Draft': 'New Draft',
    'Total Documents:': 'Total Documents:',
    'Save': 'Save',
    'View Now': 'View Now',
    'Are you sure you want to delete this tender?': 'Are you sure you want to delete this tender?',
    'Are you sure you want to delete this draft?': 'Are you sure you want to delete this draft?',
    'Drafts': 'Drafts',
    'Edit Draft': 'Edit Draft',
    'Tender Subject': 'Tender Subject',
    'New Tender Name': 'New Tender Name',
    'New Draft Name': 'New Draft Name',
    'Edit Tender': 'Edit Tender',  // New key for Edit Tender
    'Confirm Edit': 'Confirm Edit',  // Newly added key
    'Close': 'Close',
    'Create New Draft': 'Create New Draft',
    'Query': 'Query',
    'Subject': 'Subject',
    'Writing Style': 'Writing Style',
    'Entity': 'Entity',
    'Length': 'Length',
    'Criteria': 'Criteria',
    'Content': 'Content',
    'Enter the query of your draft': 'Enter the query of your draft',
    'Enter the subject of your draft': 'Enter the subject of your draft',
    'Describe the writing style (e.g., formal, casual)': 
      'Describe the writing style (e.g., formal, casual)',
    'Enter the entity involved': 'Enter the entity involved',
    'Specify the desired length': 'Specify the desired length',
    'Enter specific criteria': 'Enter specific criteria',
    'Start writing your draft content...': 'Start writing your draft content...',
    'Cancel': 'Cancel',
    'Save Draft': 'Save Draft',
    'Draft added successfully!': 'Draft added successfully!',
    'Close': 'Close',
    'Start a conversation about the tender.': 'Start a conversation about the tender.',
    'Type your message...': 'Type your message...',
    'Fetching response...': 'Fetching response...',
    'Fetching ....': 'Fetching ....',
    'Failed to get response.': 'Failed to get response.',
    'Send': 'Send',
    'Upload Previous Tender': 'Upload Previous Tender',
    'Enter folder name': 'Enter folder name',
    'Upload Documents': 'Upload Documents',
    'Uploaded Files:': 'Uploaded Files:',
    'Add Now': 'Add Now',
    'Cancel': 'Cancel',
    'New Document added successfully!': 'New Document added successfully!',
    'Close': 'Close',
    'Back to Drafts': 'Back to Drafts',
    'Consult Previous Tenders': 'Consult Previous Tenders',
    'Last Saved:': 'Last Saved:',
    'Modify Text': 'Modify Text',
    'Search Previous Tenders': 'Search Previous Tenders',
    'Enter search terms...': 'Enter search terms...',
    'Search': 'Search',
    'Save Now': 'Save Now',
    'Close': 'Close',
    'Apply Now': 'Apply Now',
    'Search to show text here': 'Search to show text here',
    'Rewrite': 'Rewrite',
    'Alternative': 'Alternative',
    'Formal': 'Formal',
    'Shorter': 'Shorter',
    'Longer': 'Longer',
    'SMART': 'SMART',
    'Active': 'Active',
    'Modified Text': 'Modified Text',
    'Select a tender from the sidebar or create a new one to get started.':  'Select a tender from the sidebar or create a new one to get started.',
    '+ Upload Additional Document': '+ Upload Additional Document',
    'Upload Tender Document':'Upload Tender Document'

  },
  NL: {
    '+ Upload Additional Document': '+ Upload Extra Documenten',
    'View Now': 'Bekijk nu',
    'Close': 'Sluiten',
    'Tender Dashboard': 'Aanbestedingsdashboard',
    'Previous tenders Upload': 'Eerdere aanbestedingen Upload',
    'Upload Previous Tenders': 'Eerdere aanbestedingen uploaden',
    '+ Upload NEW Documents': '+ NIEUWE Documenten uploaden',
    'No folders available.': 'Geen mappen beschikbaar.',
    'Failed to fetch documents.': 'Documenten ophalen mislukt.',
    'Document': 'Document',
    'Nr': 'Nr',
    'Upload Date': 'Uploaddatum',
    'Type': 'Type',
    'Document Name': 'Documentnaam',
    'Size': 'Grootte',
    'Actions': 'Acties',
    'Are you sure you want to delete the document "{name}"?': 
      'Weet je zeker dat je het document "{name}" wilt verwijderen?',
    'No documents added to this folder.': 'Geen documenten toegevoegd aan deze map.',
    'Cancel': 'Annuleren',
    'Delete': 'Verwijderen',
    'Confirm Delete': 'Verwijderen Bevestigen',
    'Start New Tender': 'Nieuwe Aanbesteding Starten',
    'Current Tenders': 'Huidige Aanbestedingen',
    'No tenders added.': 'Geen aanbestedingen toegevoegd.',
    'Loading...': 'Bezig met laden...',
    'Enter tender name': 'Voer de naam van de aanbesteding in',
    'Enter tender description': 'Voer de beschrijving van de aanbesteding in',
    'Upload Documents': 'Documenten Uploaden',
    'Uploaded Files': 'Geüploade Bestanden',
    'Add Tender': 'Aanbesteding Toevoegen',
    'New Tender added successfully!': 'Nieuwe Aanbesteding succesvol toegevoegd!',
    'Edit Tender Name': 'Bewerk Aanbestedingsnaam',
    'Confirm Delete Tender': 'Bevestig Verwijderen Aanbesteding',
    'Confirm Delete Draft': 'Bevestig Verwijderen Concept',
    'New Draft': 'Nieuw Concept',
    'Total Documents:': 'Totaal Documenten:',
    'Save': 'Opslaan',
    'Are you sure you want to delete this tender?': 'Weet je zeker dat je deze aanbesteding wilt verwijderen?',
    'Are you sure you want to delete this draft?': 'Weet je zeker dat je dit concept wilt verwijderen?',
    'Drafts': 'Concepten',
    'Edit Draft': 'Bewerk Concept',
    'Tender Subject': 'Onderwerp Aanbesteding',
    'New Tender Name': 'Nieuwe Aanbestedingsnaam',
    'New Draft Name': 'Nieuwe Conceptnaam',
    'Edit Tender': 'Bewerk Aanbesteding',  // New key for Edit Tender
    'Confirm Edit': 'Bevestig Bewerken',  // Newly added key
    'Close': 'Sluiten',
    'Create New Draft': 'Nieuwe Concept Maken',
    'Query': 'Vraag',
    'Subject': 'Onderwerp',
    'Writing Style': 'Schrijfstijl',
    'Entity': 'Entiteit',
    'Length': 'Lengte',
    'Criteria': 'Criteria',
    'Content': 'Inhoud',
    'Enter the query of your draft': 'Voer de vraag van uw concept in',
    'Enter the subject of your draft': 'Voer het onderwerp van uw concept in',
    'Describe the writing style (e.g., formal, casual)': 
      'Beschrijf de schrijfstijl (bijv. formeel, informeel)',
    'Enter the entity involved': 'Voer de betrokken entiteit in',
    'Specify the desired length': 'Specificeer de gewenste lengte',
    'Enter specific criteria': 'Voer specifieke criteria in',
    'Start writing your draft content...': 'Begin met het schrijven van de inhoud van uw concept...',
    'Cancel': 'Annuleren',
    'Save Draft': 'Concept Opslaan',
    'Draft added successfully!': 'Concept succesvol toegevoegd!',
    'Close': 'Sluiten',
    'Start a conversation about the tender.': 'Begin een gesprek over de aanbesteding.',
    'Type your message...': 'Typ uw bericht...',
    'Fetching response...': 'Bezig met ophalen van reactie...',
    'Fetching ....': 'Ophalen ....',
    'Failed to get response.': 'Kon geen reactie ontvangen.',
    'Send': 'Versturen',
    'Upload Previous Tender': 'Eerdere Aanbesteding Uploaden',
    'Enter folder name': 'Voer mapnaam in',
    'Upload Documents': 'Documenten Uploaden',
    'Uploaded Files:': 'Geüploade Bestanden:',
    'Add Now': 'Nu Toevoegen',
    'Cancel': 'Annuleren',
    'New Document added successfully!': 'Nieuw Document Succesvol Toegevoegd!',
    'Close': 'Sluiten',
    'Back to Drafts': 'Terug naar Concepten',
    'Consult Previous Tenders': 'Raadpleeg Eerdere Aanbestedingen',
    'Last Saved:': 'Laatst Opgeslagen:',
    'Modify Text': 'Wijzig Tekst',
    'Search Previous Tenders': 'Zoek in Eerdere Aanbestedingen',
    'Enter search terms...': 'Voer zoektermen in...',
    'Search': 'Zoeken',
    'Save Now': 'Nu Opslaan',
    'Close': 'Sluiten',
    'Apply Now': 'Nu Toepassen',
    'Search to show text here': 'Zoek om hier tekst weer te geven',
    'Rewrite': 'Herschrijven',
    'Alternative': 'Alternatief',
    'Formal': 'Formeel',
    'Shorter': 'Korter',
    'Longer': 'Langer',
    'SMART': 'SMART',
    'Active': 'Actief',
    'Modified Text': 'Gewijzigde Tekst',
    'Select a tender from the sidebar or create a new one to get started.':  "Selecteer een tender uit de zijbalk of maak een nieuwe aan om te beginnen.",
    'Upload Tender Document':'Upload Aanbestedingsdocument'

  },
};



export const TenderContext = createContext();

const TenderProvider = (props) => {    
  const [tenders, setTenders] = useState([]); // Manage tenders in the context
  const [selectedTender , setSelectedTender] = useState('');
  const [selectedDraft, setSelectedDraft]=useState('');
  const [loadingTranslations, setLoadingTranslations] = useState(false); // Track translation loading
  const [showChatModel, setShowChatModel] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  
  const [selectedTenderDoc, setSelectedTenderDoc] = useState(() => {
    const savedTenderDoc = localStorage.getItem('selectedTenderDoc');
    return savedTenderDoc ? JSON.parse(savedTenderDoc) : [];
  });


// ..................................



const [selectedFolder, setSelectedFolder] = useState(() => {
  const savedFolder = localStorage.getItem('selectedFolder');
  return savedFolder ? JSON.parse(savedFolder) : null;
});


const [language, setLanguage] = useState('EN');  // Added state to manage language

const toggleLanguage = () => {
  const newLang = language === 'EN' ? 'NL' : 'EN';
  setLanguage(newLang);
};

const getHardcodedTranslation = (text) => {
  return translations[language][text] || text;
};

const translate = async (text) => {
  setLoadingTranslations(true);
  const translatedText = getHardcodedTranslation(text);
  setLoadingTranslations(false);
  return translatedText;
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
    translate,
    getHardcodedTranslation,
    showChatModel,
    setShowChatModel,
    selectedTenderDoc,
    setSelectedTenderDoc,
    refreshFlag,
    setRefreshFlag
  };

  return (
    <TenderContext.Provider value={contextValue}>
      {props.children}
    </TenderContext.Provider>
  );
};

export default TenderProvider;
