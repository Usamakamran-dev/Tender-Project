import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FileText, PlusCircle } from 'lucide-react'; // Import icons
import { TenderContext } from '../context/TenderProvider';
import Loader from '../components/Loader'; // Import Loader component
import { Edit, Trash2 } from 'lucide-react';
import { Loader2 } from 'lucide-react'; // Import Loader icon



function TenderDrafts() {
  const navigate = useNavigate();
  const { selectedTender , setSelectedTender, setSelectedDraft , fetchTenders , translate , setSelectedTenderDoc , setShowChatIcon , refreshFlag} = useContext(TenderContext); // Get selected tender from context
  const [loading, setLoading] = useState(true); // Loading state
  const [draftDetails, setDraftDetails] = useState([]); // Store fetched drafts
  const [error, setError] = useState(null); // Error state
  const [totalDocs,setTotalDocs] = useState([]);
  // FOr Del
  const [showDeleteTenderModal,setShowDeleteTenderModal] = useState(false); 
  // For Edit
  const [showEditTenderModal, setShowEditTenderModal] = useState(false); // Control Edit Modal
  const [newTenderName, setNewTenderName] = useState(''); // State for new tender name
  const [tenderError, setTenderError] = useState(false); // Error state for tender name

  // For draft Del
  const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false); // Control Draft Delete Modal
  const [draftToDelete, setDraftToDelete] = useState(null); // Store Draft to Delete

  // For Darf Edit
  const [newDraftName, setNewDraftName] = useState(''); // Manage new draft name input
  const [showEditDraftModal, setShowEditDraftModal] = useState(false); // Control Draft Edit Modal
  const [draftToEdit, setDraftToEdit] = useState(null); // Store Draft to Edit
  const [draftError, setDraftError] = useState(false); // Error state for draft name

  // Upload Add document
  const [uploadedFile, setUploadedFile] = useState(null); // State to store uploaded file


// .........................................

const [translatedTexts, setTranslatedTexts] = useState({});

useEffect(() => {
  const loadTranslations = async () => {
    const translations = {
      editTender: await translate('Edit Tender Name'),
      confirmDeleteTender: await translate('Confirm Delete Tender'),
      confirmDeleteDraft: await translate('Confirm Delete Draft'),
      newDraft: await translate('New Draft'),
      totalDocuments: await translate('Total Documents:'),
      cancel: await translate('Cancel'),
      delete: await translate('Delete'),
      save: await translate('Save'),
      viewNow: await translate('View Now'),
      areYouSureTender: await translate('Are you sure you want to delete this tender?'),
      areYouSureDraft: await translate('Are you sure you want to delete this draft?'),
      drafts: await translate('Drafts'),
      editDraft: await translate('Edit Draft'),  // For edit draft modal
      tenderSubject: await translate('Tender Subject'),  // Draft subject title
      newTenderNamePlaceholder: await translate('New Tender Name'),  // Placeholder for tender input
      newDraftNamePlaceholder: await translate('New Draft Name'),  // Placeholder for draft input
      confirmEdit: await translate('Confirm Edit'),  // Added Confirm Edit translation
    };
    setTranslatedTexts(translations);
  };

  loadTranslations();
}, [translate]);





// Save selected tender and other details to localStorage on change
useEffect(() => {
  if (selectedTender) localStorage.setItem('selectedTender', selectedTender);
  localStorage.setItem('draftDetails', JSON.stringify(draftDetails));
  localStorage.setItem('totalDocs', totalDocs.toString());
}, [selectedTender, draftDetails, totalDocs]);

// Load selected tender, draft details, and document count from localStorage on component mount
useEffect(() => {
  const savedTender = localStorage.getItem('selectedTender');
  const savedDraftDetails = JSON.parse(localStorage.getItem('draftDetails') || '[]');
  const savedTotalDocs = parseInt(localStorage.getItem('totalDocs') || '0', 10);

  if (savedTender) setSelectedTender(savedTender);
  setDraftDetails(savedDraftDetails);
  setTotalDocs(savedTotalDocs);
}, []);





  // Fetch draft details from the backend API
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const formData = new FormData();
        formData.append('path', selectedTender); // Send selected tender as 'path'

        const response = await fetch('http://68.221.120.250:8000/get_tender_subject', {
          method: 'POST',
          body: formData,
        });


        if (!response.ok) {
          throw new Error('Failed to fetch draft details');
        }


        const result = await response.json();

       // Filter out 'empty-file.txt' from the file_list
      const filteredFileList = result.file_list.filter(
        (file) => file.file_name !== 'empty-file.txt'
      );

        setSelectedTenderDoc(filteredFileList); // Update tender documents with filtered list
        setTotalDocs(filteredFileList.length);
        setDraftDetails(result.source || []);
        console.log(result);
        setShowChatIcon(true);
        console.log('Draft Details:', result.source);
      } catch (err) {
        setError(err.message); // Handle error
      } finally {
        setLoading(false); // Stop loading after API call completes
      }
    };

    if (selectedTender) {
      fetchDrafts(); // Fetch drafts only if a tender is selected
    } else {
      setLoading(false); // Stop loading if no tender is selected
    }
  }, [selectedTender]); // Re-run when selectedTender changes



  // ............................................

  const handleTenderInputChange = (e) => {
    setNewTenderName(e.target.value);
    if (e.target.value.trim()) setTenderError(false); // Reset error if valid input
  };

  const handleDraftInputChange = (e) => {
    setNewDraftName(e.target.value);
    if (e.target.value.trim()) setDraftError(false); // Reset error if valid input
  };

  // ..........................................


 

  // .............................................
  const handleNewDraft = () => {
    navigate('/new-draft');
  };

  const handleDraftClick = (draft) => {
    setSelectedDraft(draft); // Set selected draft in state
    localStorage.setItem('selectedDraftName', draft.subject);

    navigate(
      `/draft/${draft.subject
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w-]/g, '')}` // Remove special characters
    ); // Navigate to the formatted tender page
  };


  // ............................................

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }


  // For tender edit and del
  const confirmTenderDelete = async () => {
    setLoading(true); // Show loader
    try {
      const formData = new FormData();
      formData.append('tender_name', selectedTender); // Send the selected tender name
  
      const response = await fetch('http://68.221.120.250:8000/delete_tender', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        setShowDeleteTenderModal(false); // Close the modal
        await fetchTenders();
      }
      else {
        throw new Error('Failed to delete the tender');
      }
    } catch (error) {
      console.error('Error deleting tender:', error);
    } finally {
      setLoading(false); // Hide loader
      navigate('/');


    }
  };
  

  const handleSaveTenderName = async () => {
    if (!newTenderName.trim()) {
    setTenderError(true); // Set error if input is empty
    return;
  }
    setLoading(true); // Show loader
    try {
      const formData = new FormData();
      formData.append('tender_name', selectedTender); // Send current tender name
      formData.append('new_name', newTenderName); // Send new tender name
  
      const response = await fetch('http://68.221.120.250:8000/rename_tender', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Tender edited successfully');
        setSelectedTender(newTenderName);
        setNewTenderName(''); // Reset input field
        await fetchTenders();

      setShowEditTenderModal(false); // Close the modal
      }
      else{
        throw new Error('Failed to edit the tender');
      }
  
    } catch (error) {
      console.error('Error editing tender:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };
  



// ..........
const handleEditDraft = (draft) => {
  setDraftToEdit(draft); // Set the draft to be edited
  setShowEditDraftModal(true); // Open the edit modal
};

const handleDeleteDraft = (draft) => {
  setDraftToDelete(draft); // Set the draft to be deleted
  setShowDeleteDraftModal(true); // Open the delete modal
};

// ....FOr Api

// Apply changes when saving the edited draft
const applyDraftEdit = async () => {
  if (!newDraftName.trim()) {
    setDraftError(true); // Set error if input is empty
    return;
  }
  setLoading(true); // Show loader
  try {
    const formData = new FormData();
    formData.append('tender_name', selectedTender); // Current draft name
    formData.append('current_draft_name',draftToEdit.subject); // New draft name from input
    formData.append('updated_draft_name', newDraftName); // New draft name from input


    const response = await fetch('http://68.221.120.250:8000/rename_draft', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to edit the draft');
    }

    setDraftDetails((prev) =>
      prev.map((draft) =>
        draft.id === draftToEdit.id ? { ...draft, subject: newDraftName } : draft
      )
    ); 


    console.log('Draft edited successfully');
    setNewDraftName(''); // Reset input field
    setShowEditDraftModal(false); // Close the modal
  } catch (error) {
    console.error('Error editing draft:', error);
  } finally {
    setLoading(false); // Hide loader
  }
};



// Apply changes when confirming draft deletion
const applyDraftDelete = async () => {
  setLoading(true); // Show loader
  try {
    const formData = new FormData();
    formData.append('current_draft_name', draftToDelete.subject); // Send the draft name to delete
    formData.append('tender_name', selectedTender); // Send the draft name to delete

    const response = await fetch('http://68.221.120.250:8000/delete_draft', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to delete the draft');
    }

    setDraftDetails((prev) =>
      prev.filter((draft) => draft.id !== draftToDelete.id)
    ); // Remove the deleted draft from state


    console.log(`Draft "${draftToDelete.subject}" deleted successfully`);
    setShowDeleteDraftModal(false); // Close the modal
  } catch (error) {
    console.error('Error deleting draft:', error);
  } finally {
    setLoading(false); // Hide loader
  }
};


  


  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col items-start gap-4">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-row items-center gap-8">
            <h2 className="text-2xl font-bold">{selectedTender}</h2>
            <div className='flex flex-row items-start gap-2'>
            <Edit  onClick={() => setShowEditTenderModal(true)}
            size={19}  className='text-gray-500 transform transition-transform duration-500 hover:scale-105'/>
            <Trash2 onClick={()=> setShowDeleteTenderModal(true)}
            size={18}  
            className='text-red-600 transform transition-transform duration-500 hover:scale-105'/> 
            </div>
        </div>
        <div className='flex flex-row items-center gap-8'>
             
            <p className="text-gray-600 text-sm">{translatedTexts.totalDocuments} {totalDocs}</p>
              <Button
               onClick={() => navigate(`/document-detail/${selectedTender}`, { state: { refresh: true } })}
               className="text-white font-medium text-xs px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
                disabled={loading} // Disable button during loading
              >
               {translatedTexts.viewNow}
              </Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold pt-6">{translatedTexts.newDraft}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {draftDetails?.map((draft , index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full h-[9rem] flex flex-row items-center justify-between p-4 rounded
              hover:bg-gray-50 border border-black border-opacity-10
              transform transition-transform duration-500 hover:scale-[103%]"
            onClick={() => handleDraftClick(draft)}
          >
            <div className='flex flex-col items-start gap-2'>
            <FileText className="h-6 w-6 mb-2" />
            <span className="font-medium">{draft.subject}</span>
            </div>
            <div className='flex flex-row items-start gap-2'>
                <Edit 
                size={17}  className='text-gray-500 transform transition-transform duration-500 hover:scale-105'
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  handleEditDraft(draft);
                }}
                />
                <Trash2 
                size={16}  
                className='text-red-600 transform transition-transform duration-500 hover:scale-105'
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  handleDeleteDraft(draft);
                }}/> 
            </div>
          
          </Button>
        ))}

        {/* New Draft Card */}
        <div className="col-span-1 w-full">
          <Button
            variant="ghost"
            className="w-full h-[9rem] flex flex-col items-center justify-center p-4 rounded
              hover:bg-gray-50 border border-black border-opacity-10
              transform transition-transform duration-500 hover:scale-[103%]"
            onClick={handleNewDraft}
          >
            <PlusCircle className="h-6 w-6 mb-2" />
            <span className="font-medium">{translatedTexts.newDraft}</span>
          </Button>
        </div>
      </div>
      {/* Delete Tender */}
      {showDeleteTenderModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-950">
        {translatedTexts.confirmDeleteTender}
      </h2>
      <p className="mb-8 text-gray-700 font-regular text-sm">
        {translatedTexts.areYouSureTender}
      </p>
      <div className="flex justify-end space-x-4">
        <Button
          className="text-black font-medium text-sm border border-black border-opacity-40 px-4 py-2 rounded-md hover:bg-gray-50"
          variant="outline"
          onClick={() => setShowDeleteTenderModal(false)}
        >
          {translatedTexts.cancel}
        </Button>
        <Button
          className="text-white font-medium text-sm px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
          onClick={confirmTenderDelete}
        >
          {translatedTexts.delete}
        </Button>
      </div>
    </div>
  </div>
)}

      {/* Edit Tender Name */}
      {showEditTenderModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-950">
                {translatedTexts.confirmEdit}
              </h2>
              <input
                type="text"
                value={newTenderName}
                onChange={handleTenderInputChange}
                className={`text-sm rounded py-2 border w-full ${
                  tenderError ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-black mb-4`}
                placeholder={translatedTexts.newTenderNamePlaceholder} 
              />

              <div className="flex justify-end space-x-4">
                <Button
                  className="text-black font-medium text-sm border border-black border-opacity-40 px-4 py-2 rounded-md hover:bg-gray-50"
                  variant="outline"
                  onClick={() => setShowEditTenderModal(false)}
                >
                  {translatedTexts.cancel}
                </Button>
                <Button
                  className="text-white font-medium text-sm px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
                  onClick={handleSaveTenderName}
                >
                  {translatedTexts.save}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* edit draft */}
        {showEditDraftModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-lg font-semibold mb-4 text-gray-950">
                  {translatedTexts.editDraft}: {draftToEdit?.subject}
                </h2>
                <input
                  type="text"
                  value={newDraftName}
                  onChange={handleDraftInputChange}
                  className={`text-sm rounded py-2 border w-full ${
                    draftError ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-black mb-4`}
                  placeholder={translatedTexts.newDraftNamePlaceholder}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    className="text-black font-medium text-sm border border-black border-opacity-40 px-4 py-2 rounded-md hover:bg-gray-50"
                    variant="outline"
                    onClick={() => setShowEditDraftModal(false)}
                  >
                    {translatedTexts.cancel}
                  </Button>
                  <Button
                    className="text-white font-medium text-sm px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
                    onClick={applyDraftEdit}
                  >
                    {translatedTexts.save}
                  </Button>
                </div>
              </div>
            </div>
          )}


          {/* Delete Draft Model */}
          {showDeleteDraftModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                  <h2 className="text-lg font-semibold mb-4 text-gray-950">
                    {translatedTexts.confirmDeleteDraft}: {draftToDelete?.subject}
                  </h2>
                  <p className="mb-8 text-gray-700 font-regular text-sm">
                    {translatedTexts.areYouSureDraft} "{draftToDelete?.subject}"?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <Button
                      className="text-black font-medium text-sm border border-black border-opacity-40 px-4 py-2 rounded-md hover:bg-gray-50"
                      variant="outline"
                      onClick={() => setShowDeleteDraftModal(false)}
                    >
                      {translatedTexts.cancel}
                    </Button>
                    <Button
                      className="text-white font-medium text-sm px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
                      onClick={applyDraftDelete}
                    >
                      {translatedTexts.delete}
                    </Button>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
}

export default TenderDrafts;
