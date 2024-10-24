import React, { useState , useContext , useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Upload } from 'lucide-react'; // Icons from Lucide-react
import { Dialog, DialogContent } from './../components/ui/Dialog';
import Loader from '../components/Loader';
import { TenderContext } from '../context/TenderProvider';


function PreviousTenderForm() {
  const navigate = useNavigate();
  const { translate } = useContext(TenderContext);


  const [folderName, setFolderName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
   // State for translated texts
   const [translatedTexts, setTranslatedTexts] = useState({});

   useEffect(() => {
     const loadTranslations = async () => {
       const translations = {
         title: await translate('Upload Previous Tender'),
         enterFolder: await translate('Enter folder name'),
         uploadDocuments: await translate('Upload Documents'),
         uploadedFiles: await translate('Uploaded Files:'),
         addNow: await translate('Add Now'),
         cancel: await translate('Cancel'),
         successMessage: await translate('New Document added successfully!'),
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
    if (!folderName) errors.name = true;
    if (uploadedFiles.length === 0) errors.documents = true;
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append('folder_name', folderName);
        uploadedFiles.forEach((file) => formData.append('files', file));

        const response = await fetch('http://68.221.120.250:8000/prev_tender_uploads', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to submit tender');
        }

        const result = await response.json();
        console.log(result);

        setFolderName('');
        setUploadedFiles([]);
        setIsModalOpen(true); // Show success modal
        
               
            } 
        catch (error) {
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
            placeholder='Enter folder name'
            value={translatedTexts.enterFolder}
            onChange={(e) => {
              setFolderName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
            }}
            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black`}
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
               {translatedTexts.addNow}
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
        navigate(-1); 
      }}
    >
      {translatedTexts.close}
    </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PreviousTenderForm;
