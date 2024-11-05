import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FileText, ArrowUpDown } from 'lucide-react';
import Loader from '../components/Loader';
import { TenderContext } from '../context/TenderProvider';

function PreviousTender() {
  const navigate = useNavigate();
  const { setSelectedFolder, translate } = useContext(TenderContext);
  const [groupedDocuments, setGroupedDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortAsc, setSortAsc] = useState(true); // State to track sorting order

  const [translations, setTranslations] = useState({
    title: '',
    uploadText: '',
    noFoldersMessage: '',
    errorMessage: '',
    documentText: '',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations = {
        title: await translate('Upload Previous Tenders'),
        uploadText: await translate('+ Upload NEW Documents'),
        noFoldersMessage: await translate('No folders available.'),
        errorMessage: await translate('Failed to fetch documents.'),
        documentText: await translate('Document'),
      };
      setTranslations(newTranslations);
    };

    loadTranslations();
  }, [translate]);

  useEffect(() => {
    const getTableData = async () => {
      try {
        const response = await fetch('http://68.221.120.250:8000/get_prev_tendor_files');
        const result = await response.json();
        console.log('API Response:', result);

        const formattedDocuments = result.Files_info.map((file) => ({
          id: file.id,
          uploadDate: file.upload_date,
          type: file.document_type.toUpperCase(),
          name: file.document_name,
          size: `${parseFloat(file.size).toFixed(2)} MB`,
          folder: file.folder_name,
        }));

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

  const handleSortByName = () => {
    setSortAsc(!sortAsc); // Toggle sort direction
  };

  const sortedFolderNames = Object.keys(groupedDocuments).sort((a, b) => 
    sortAsc ? a.localeCompare(b) : b.localeCompare(a)
  );

  const handleFolderClick = (folder) => {
    setSelectedFolder({
      folderName: folder,
      documents: groupedDocuments[folder],
    });
    navigate(
      `/previous-tender/${folder
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')}`
    );
  };

  if (error) {
    return <div>Error: {translations.errorMessage}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col items-start gap-12">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-6 cursor-pointer">
          <h1 className="text-2xl font-semibold text-gray-950">{translations.title}</h1>
          <ArrowUpDown onClick={handleSortByName}
            className={`h-5 w-5 transition-transform duration-300 ${sortAsc ? 'rotate-0' : 'rotate-180'}`}
          />
        </div>
        
        <label
          onClick={() => navigate('/previous-tender-form')}
          className="text-black font-medium text-sm border border-black border-opacity-10 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
        >
          {translations.uploadText}
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader />
        </div>
      ) : sortedFolderNames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {sortedFolderNames.map((folder) => (
            <Button
              key={folder}
              onClick={() => handleFolderClick(folder)}
              variant="ghost"
              className="w-full h-[9rem] flex flex-col items-start justify-start gap-2 p-4 rounded
                hover:bg-gray-50 border border-black border-opacity-10
                transform transition-transform duration-500 hover:scale-[103%]"
            >
              <FileText className="h-6 w-6 mb-2" />
              <span className="font-semibold text-start">{folder}</span>
              <p className="text-sm text-gray-600">
                {groupedDocuments[folder].length} {translations.documentText}
              </p>
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 w-full">
          <p className="text-sm text-center font-light text-gray-500">
            {translations.noFoldersMessage}
          </p>
        </div>
      )}
    </div>
  );
}

export default PreviousTender;
