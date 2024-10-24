import React, { useState, useContext ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import { Upload } from 'lucide-react'; // Icons from Lucide-react
import { Dialog, DialogContent } from './../components/ui/Dialog';
import { TenderContext } from '../context/TenderProvider';
import Loader from '../components/Loader';


function TenderForm() {
  const navigate = useNavigate();
  const { setApiCall , translate } = useContext(TenderContext); 
  const [newTenderName, setNewTenderName] = useState('');
  const [newTenderDescription, setNewTenderDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
 

  const [translatedTexts, setTranslatedTexts] = useState({});

  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {
        title: await translate('Start New Tender'),
        enterName: await translate('Enter tender name'),
        enterDescription: await translate('Enter tender description'),
        uploadDocuments: await translate('Upload Documents'),
        uploadedFiles: await translate('Uploaded Files'),
        addTender: await translate('Add Tender'),
        cancel: await translate('Cancel'),
        successMessage: await translate('New Tender added successfully!'),
        close: await translate('Close'),
      };
      setTranslatedTexts(translations);
    };

    loadTranslations();
  }, [translate]);

  

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
    if (errors.documents) {
      setErrors((prev) => ({ ...prev, documents: false }));
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!newTenderName) errors.name = true;
    if (!newTenderDescription) errors.description = true;
    if (uploadedFiles.length === 0) errors.documents = true;
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append('path_db', newTenderName);
        uploadedFiles.forEach((file) => formData.append('files', file));

        const response = await fetch('http://68.221.120.250:8000/current_tender_upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to submit tender');
        }

        const result = await response.json();
        console.log(result);

        setNewTenderName('');
        setNewTenderDescription('');
        setUploadedFiles([]);
        setIsModalOpen(true); // Show success modal
        setApiCall((prev) => !prev);
               
            } catch (error) {
        console.error('Error submitting tender:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="relative flex flex-col">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <Loader className="animate-spin h-12 w-12 text-gray-700" />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">{translatedTexts.title}</h2>
        <div className="space-y-4 pt-6">
          <Input
            placeholder='Enter tender name'
            value={translatedTexts.enterName}
            onChange={(e) => {
              setNewTenderName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
            }}
            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black`}
          />

          <Textarea
            placeholder={translatedTexts.enterDescription}
            value={newTenderDescription}
            onChange={(e) => {
              setNewTenderDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: false }));
            }}
            className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black`}
          />

          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className={`flex items-center justify-center w-full h-32 border ${errors.documents ? 'border-red-500' : 'border-dashed border-gray-300'} rounded-lg`}>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">{translatedTexts.uploadDocuments}</span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">{translatedTexts.uploadedFiles}</h4>
              <ul className="text-sm text-gray-500">
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button  onClick={() => navigate(-1)}
            variant="outline" className="text-black font-medium text-sm border px-4 py-2 rounded-md hover:bg-gray-50">
           {translatedTexts.cancel}
            </Button>
            <Button
              className="text-white font-medium text-sm px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
              onClick={handleSubmit}
              disabled={loading}
            >
               {translatedTexts.addTender}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-12 bg-white rounded-lg shadow-lg flex flex-col items-center">
          <div className="text-green-600 text-3xl">{translatedTexts.successMessage}</div>
          <Button
      className="mt-8 bg-black text-white px-4 py-2 rounded-md"
      onClick={() => {
        setIsModalOpen(false);
        setTimeout(() => {
          window.location.reload(); // Reload the page after closing the modal
        }, 500); // Optional small delay before reload
      }}
    >
       {translatedTexts.close}
    </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TenderForm;
