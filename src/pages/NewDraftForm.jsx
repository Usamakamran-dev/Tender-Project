import React, { useState, useContext , useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { Dialog, DialogContent } from '../components/ui/Dialog';
import { TenderContext } from '../context/TenderProvider';
import Loader from '../components/Loader'; // Importing the Loader


function NewDraftForm() {
  const { selectedTender , translate } = useContext(TenderContext);
  const navigate = useNavigate();
  const [draftData, setDraftData] = useState({
    subject: "",
    writingStyle: "",
    entity: "",
    length: "",
    criteria: "",
    content: "",
    query: ""
  });
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state


  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {
        createNewDraft: await translate('Create New Draft'),
        query: await translate('Query'),
        subject: await translate('Subject'),
        writingStyle: await translate('Writing Style'),
        entity: await translate('Entity'),
        length: await translate('Length'),
        criteria: await translate('Criteria'),
        content: await translate('Content'),
        enterQuery: await translate('Enter the query of your draft'),
        enterSubject: await translate('Enter the subject of your draft'),
        enterWritingStyle: await translate('Describe the writing style (e.g., formal, casual)'),
        enterEntity: await translate('Enter the entity involved'),
        specifyLength: await translate('Specify the desired length'),
        enterCriteria: await translate('Enter specific criteria'),
        startWriting: await translate('Start writing your draft content...'),
        cancel: await translate('Cancel'),
        saveDraft: await translate('Save Draft'),
        draftAdded: await translate('Draft added successfully!'),
        close: await translate('Close'),
      };
      setTranslatedTexts(translations);
    };

    loadTranslations();
  }, [translate]);



  const validateForm = () => {
    const newErrors = {};
    if (!draftData.subject) newErrors.subject = true;
    if (!draftData.writingStyle) newErrors.writingStyle = true;
    if (!draftData.entity) newErrors.entity = true;
    if (!draftData.length) newErrors.length = true;
    if (!draftData.criteria) newErrors.criteria = true;
    if (!draftData.content) newErrors.content = true;
    if (!draftData.query) newErrors.query = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true); // Start loading

      try {
        const formData = new FormData();
        formData.append('path', selectedTender);
        formData.append('qry', 'Dummy_Qry');
        formData.append('subject', draftData.subject);
        formData.append('style', draftData.writingStyle);
        formData.append('entity', draftData.entity);
        formData.append('length', draftData.length);
        formData.append('criteria', draftData.criteria);
        formData.append('own_context', draftData.content);
        formData.append('qry', draftData.query);


        const response = await fetch('http://68.221.120.250:8000/current_tender_query', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to process the request');
        }

        const result = await response.json();
        console.log('Backend Response:', result);
        setDraftData({
          subject: "",
          writingStyle: "",
          entity: "",
          length: "",
          criteria: "",
          content: "",
          query: ""
        });

        setIsDialogOpen(true);

        setTimeout(() => {
          setIsDialogOpen(false);
          navigate(-1);
        }, 2000);
      } catch (error) {
        console.error('Error processing the request:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  const handleChange = (field, value) => {
    setDraftData({
      ...draftData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <Loader className="h-12 w-12 animate-spin text-gray-700" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-8">{translatedTexts.createNewDraft}</h2>
        <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col items-start gap-2 w-full">
              <label className="block text-sm font-medium">{translatedTexts.query}</label>
              <Input
                value={draftData.query}
                onChange={(e) => handleChange('query', e.target.value)}
                className={`text-sm rounded py-2 border w-full text-gray-600 ${errors.query ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={translatedTexts.enterQuery}
              />
            </div>
          <div className="flex flex-row items-start w-full gap-8">
            <div className="flex flex-col items-start gap-2 w-full">
              <label className="block text-sm font-medium">{translatedTexts.subject}</label>
              <Input
                value={draftData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className={`text-sm rounded py-2 border w-full text-gray-600 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={translatedTexts.enterSubject}
              />
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="block text-sm font-medium">{translatedTexts.writingStyle}</label>
              <Input
                value={draftData.writingStyle}
                onChange={(e) => handleChange('writingStyle', e.target.value)}
                className={`text-sm rounded py-2 border w-full text-gray-600 ${errors.writingStyle ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={translatedTexts.enterWritingStyle}
              />
            </div>
          </div>

          <div className="flex flex-row items-start w-full gap-8">
            <div className="flex flex-col items-start gap-2 w-full">
              <label className="block text-sm font-medium">{translatedTexts.entity}</label>
              <Input
                value={draftData.entity}
                onChange={(e) => handleChange('entity', e.target.value)}
                className={`text-sm rounded py-2 border w-full text-gray-600 ${errors.entity ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={translatedTexts.enterEntity}
              />
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="block text-sm font-medium">{translatedTexts.length}</label>
              <Input
                value={draftData.length}
                onChange={(e) => handleChange('length', e.target.value)}
                className={`text-sm rounded py-2 border w-full text-gray-600 ${errors.length ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={translatedTexts.specifyLength}
              />
            </div>
          </div>

          <div className="flex flex-row items-start w-full gap-8">
            <div className="flex flex-col items-start gap-2 w-full">
              <label className="block text-sm font-medium">{translatedTexts.criteria}</label>
              <Input
                value={draftData.criteria}
                onChange={(e) => handleChange('criteria', e.target.value)}
                className={`text-sm rounded py-2 border w-full text-gray-600 ${errors.criteria ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={translatedTexts.enterCriteria}
              />
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="block text-sm font-medium">{translatedTexts.content}</label>
              <Textarea
                value={draftData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className={`text-sm rounded py-2 border w-full text-gray-600 ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={translatedTexts.startWriting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              className="text-black font-medium text-sm border px-4 py-2 rounded-md hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
             {translatedTexts.cancel}
            </Button>
            <Button
              type="submit"
              className="text-white font-medium text-sm px-4 py-2 rounded-md bg-gray-950 hover:bg-gray-900"
            >
             {translatedTexts.saveDraft}
            </Button>
          </div>
        </div>

        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="p-12 bg-white rounded-lg shadow-lg">
              <div className="text-green-600 text-2xl">{translatedTexts.draftAdded}</div>
              <Button className="mt-8 bg-black text-white px-4 py-2 rounded-md"
              onClick={() => setIsDialogOpen(false)}>
                {translatedTexts.close}
                </Button>
            </DialogContent>
          </Dialog>
        )}
      </form>
    </div>
  );
}

export default NewDraftForm;
