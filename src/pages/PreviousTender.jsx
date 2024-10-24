import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FileText } from 'lucide-react'; // Import icons
import Loader from '../components/Loader'; // Import Loader component
import { TenderContext } from '../context/TenderProvider';

function PreviousTender() {
  const navigate = useNavigate();
  const { setSelectedFolder ,  translate } = useContext(TenderContext);
  const [groupedDocuments, setGroupedDocuments] = useState({}); // Grouped documents by folder
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedUploadText, setTranslatedUploadText] = useState('');
  const [translatedNoFoldersMessage, setTranslatedNoFoldersMessage] = useState('');
  const [translatedErrorMessage, setTranslatedErrorMessage] = useState('');
  const [documentText, setDocumentText] = useState('');


  useEffect(() => {
    const loadTranslations = async () => {
      const title = await translate('Upload Previous Tenders');
      const uploadText = await translate('+ Upload NEW Documents');
      const noFoldersMessage = await translate('No folders available.');
      const errorMessage = await translate('Failed to fetch documents.');
      const text=await translate('Document');


      setTranslatedTitle(title);
      setTranslatedUploadText(uploadText);
      setTranslatedNoFoldersMessage(noFoldersMessage);
      setTranslatedErrorMessage(errorMessage);
      setDocumentText(text);
    };

    loadTranslations();
  }, [translate]);



  useEffect(() => {
    const getTableData = async () => {
      try {
        const response = await fetch('http://68.221.120.250:8000/get_prev_tendor_files');
        const result = await response.json();
        console.log('API Response:', result);

        // Format documents and group by folder name
        const formattedDocuments = result.Files_info.map((file) => ({
          id: file.id,
          uploadDate: file.upload_date,
          type: file.document_type.toUpperCase(),
          name: file.document_name,
          size: `${parseFloat(file.size).toFixed(2)} MB`,
          folder: file.folder_name, // Folder name added
        }));

        // Group documents by folder
        const grouped = formattedDocuments.reduce((acc, doc) => {
          if (!acc[doc.folder]) acc[doc.folder] = [];
          acc[doc.folder].push(doc);
          return acc;
        }, {});

        setGroupedDocuments(grouped);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to fetch documents.');
      } finally {
        setLoading(false);
      }
    };

    getTableData();
  }, []);

  const handleFolderClick = (folder) => {
    setSelectedFolder({
      folderName: folder, // Include folder name
      documents: groupedDocuments[folder], // Set documents array
    });
    navigate(
      `/previous-tender/${folder
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w-]/g, '')}` // Remove special characters
    );
  };


  if (error) {
    return <div>Error: {translatedErrorMessage}</div>;
  }


  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col items-start gap-12">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-950">{translatedTitle}</h1>
        
        <label
          onClick={() => navigate('/previous-tender-form')}
          className="text-black font-medium text-sm border border-black border-opacity-10 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
        >
            {translatedUploadText}
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader />
        </div>
      ) : Object.keys(groupedDocuments).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {Object.keys(groupedDocuments).map((folder) => (
            <Button
              key={folder}
              onClick={() => handleFolderClick(folder)}
              variant="ghost"
              className="w-full h-[9rem] flex flex-col items-start justify-center gap-2 p-4 rounded
                hover:bg-gray-50 border border-black border-opacity-10
                transform transition-transform duration-500 hover:scale-[103%]"
            >
              <FileText className="h-6 w-6 mb-2" />
              <span className="font-semibold">{folder}</span>
              <p className="text-sm text-gray-600">
                {groupedDocuments[folder].length} {documentText}
              </p>
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 w-full">
          <p className="text-sm text-center  font-light text-gray-500">
          {translatedNoFoldersMessage}
          </p>
        </div>
      )}
    </div>
  );
}

export default PreviousTender;
