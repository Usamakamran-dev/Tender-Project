import React, { useState, useContext , useEffect } from 'react';
import { Trash2 , ArrowUpDown } from 'lucide-react';
import Button from '../components/ui/Button';
import Loader from '../components/Loader'; 
import { TenderContext } from '../context/TenderProvider'; 
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function ViewDetail() {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const [sortAsc, setSortAsc] = useState(true); 
  const [sortAscDate, setSortAscDate] = useState(true);

  const { selectedTenderDoc, setSelectedTenderDoc , translate , selectedTender , setSelectedTender , showChatModel,
    setShowChatModel } = useContext(TenderContext);
  const [uploadedFile, setUploadedFile] = useState(null);


// State to store translated texts
const [translations, setTranslations] = useState({
  headers: {},
  confirmDeleteMessage: '',
  noDocumentsMessage: '',
  cancelText: '',
  deleteText: '',
  confirmDeleteTitle: '',
  uploadDocument:''
});

useEffect(() => {
  setShowChatModel(true); // Always set the chat model to visible when navigating to this page
}, [showChatModel]);




useEffect(() => {
  if (selectedTenderDoc) {
    localStorage.setItem('selectedTenderDoc', JSON.stringify(selectedTenderDoc));
  }
}, [selectedTenderDoc]);


useEffect(() => {
  if (selectedTender) {
    localStorage.setItem('selectedTender', selectedTender);
  }
}, [selectedTender]);



useEffect(() => {
  const savedTender = localStorage.getItem('selectedTender');
  if (savedTender) {
    setSelectedTender(savedTender);
  }
}, [setSelectedTender]);


useEffect(() => {
  const loadTranslations = async () => {
    const headers = {
      nr: await translate('Nr'),
      uploadDate: await translate('Upload Date'),
      type: await translate('Type'),
      documentName: await translate('Document Name'),
      size: await translate('Size'),
      actions: await translate('Actions'),
    };

    setTranslations({
      headers,
      confirmDeleteMessage: await translate('Are you sure you want to delete the document "{name}"?'),
      noDocumentsMessage: await translate('No documents added to this folder.'),
      cancelText: await translate('Cancel'),
      deleteText: await translate('Delete'),
      confirmDeleteTitle: await translate('Confirm Delete'),
      uploadDocument: await translate('+ Upload Additional Document'),
    });
  };

  loadTranslations();
}, [translate]);

  

  const handleDeleteClick = (doc) => {
    setSelectedDoc(doc);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('source', selectedTender);
      formData.append('file_name', selectedDoc.file_name);


      const response = await fetch('http://68.221.120.250:8000/delete_current_file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to delete the file');
      }

      console.log(`File "${selectedDoc.name}" deleted successfully`);

      const updatedFolder = selectedTenderDoc.filter(doc => doc.id !== selectedDoc.id);
      setSelectedTenderDoc(updatedFolder);

      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setLoading(false);
    }
  };






  const handleSortByName = () => {
    const sortedDocuments = [...selectedFolder.documents].sort((a, b) => {
      if (sortAsc) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setSelectedTenderDoc({ ...selectedFolder, documents: sortedDocuments });
    setSortAsc(!sortAsc); // Toggle sort direction
  };



  const handleSortByDate = () => {
    const sortedDocuments = [...selectedFolder.documents].sort((a, b) => {
      const dateA = new Date(a.uploadDate);
      const dateB = new Date(b.uploadDate);
      return sortAscDate ? dateA - dateB : dateB - dateA;
    });
    setSelectedTenderDoc({ ...selectedFolder, documents: sortedDocuments });
    setSortAscDate(!sortAscDate); // Toggle sort direction for date
  };



  const uploadDocument = async () => {
    setLoading(true); // Show loader
    try {
      const formData = new FormData();
      formData.append('document', uploadedFile); // Append the file
      formData.append('tenderName', selectedTender); // Append tender name
  
      const response = await fetch('http://68.221.120.250:8000/upload_document', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload the document');
      }
  
      console.log('Document uploaded successfully');
      setUploadedFile(null); // Reset file state after successful upload
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };
  

  
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setUploadedFile(file); // Store the file in state
    }
  };



  return (
    <div className="p-6 bg-white text-white rounded-lg shadow-md flex flex-col gap-12 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-950">
          {selectedTender}
        </h1>
        <div onClick={() => navigate('/additional-tender-form')}
        className="flex justify-between items-center">
               
                <label
                  className="text-black font-medium text-sm border border-black border-opacity-10 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  {translations.uploadDocument}
                </label>
             </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader />
        </div>
      ) : selectedTenderDoc.length > 0 ? (
        <table className="min-w-full bg-white rounded-lg">
           <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="p-3 text-sm text-gray-950 font-semibold text-nowrap">{translations.headers.nr}</th>
              <th 
                className="p-3 text-sm text-gray-950 font-semibold cursor-pointer flex items-center gap-2 text-nowrap"
                onClick={handleSortByDate}
              >
                {translations.headers.uploadDate}
                <ArrowUpDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    sortAscDate ? 'rotate-0' : 'rotate-180'
                  }`}
                />
              </th>
              <th className="p-3 text-sm text-gray-950 font-semibold text-nowrap"> {translations.headers.type}</th>
              <th 
                className="p-3 text-sm text-gray-950 font-semibold cursor-pointer flex items-center gap-2" 
                onClick={handleSortByName}
              >
                {translations.headers.documentName}
                <ArrowUpDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    sortAsc ? 'rotate-0' : 'rotate-180'
                  }`}
                /> {/* Double arrow icon with rotation */}
              </th>
              <th className="p-3 text-sm text-gray-950 font-semibold text-nowrap">  {translations.headers.size}</th>
              <th className="p-3 text-sm text-gray-950 font-semibold text-nowrap"> {translations.headers.actions}</th>
            </tr>
          </thead>
          <tbody>
            {selectedTenderDoc.map((doc, index) => (
              <tr key={doc.id} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-500 text-nowrap">{index + 1}</td>
                <td className="p-3 text-sm text-gray-500 text-nowrap">{doc.upload_date}</td>
                <td className="p-3 text-sm text-gray-500 text-nowrap">{doc.document_type}</td>
                <td className="p-3 text-sm text-gray-500 ">{doc.file_name}</td>
                <td className="p-3 text-sm text-gray-500 text-nowrap">{doc.size}</td>
                <td className="p-3 text-sm text-gray-500 text-nowrap">
                  <button
                    className="text-red-600 hover:text-red-400"
                    onClick={() => handleDeleteClick(doc)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm font-light text-gray-500">
          {translations.noDocumentsMessage}
          </p>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-950"> {translations.confirmDeleteTitle}</h2>
            <p className="mb-8 text-gray-700 font-regular text-sm">
            {translations.confirmDeleteMessage.replace('{name}', selectedDoc?.file_name)}
            </p>
            <div className="flex justify-end space-x-4">
              <Button   className="text-black font-medium text-sm border border-black border-opacity-40 px-4 py-2 rounded-md hover:bg-gray-50"
              variant="outline" onClick={() => setShowDeleteModal(false)}>
                {translations.cancelText}
              </Button>
              <Button  className="text-white font-medium text-sm px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
              onClick={confirmDelete}> {translations.deleteText}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewDetail;
