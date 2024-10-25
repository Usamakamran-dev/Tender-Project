import React, { useState, useContext, useEffect, useRef } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Send, Loader } from 'lucide-react';
import ScrollArea from '../components/ui/ScrollArea';
import { TenderContext } from '../context/TenderProvider';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // Import react-markdown


function ChatBox() {
  const navigate = useNavigate();
  const { selectedTender, setSelectedTender, translate, language , getHardcodedTranslation } = useContext(TenderContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const chatEndRef = useRef(null); // Ref to scroll to the bottom


  const [translatedTenderName, setTranslatedTenderName] = useState('');
  const [translatedHeaderText, setTranslatedHeaderText] = useState('');
  const [translatedCloseButtonText, setTranslatedCloseButtonText] = useState(
    language === 'NL' ? 'Sluiten' : 'Close' // Set initial value based on language
  );  const [translatedPrompt, setTranslatedPrompt] = useState('');
  const [fetchingResponseMessage, setFetchingResponseMessage] = useState('');



  useEffect(() => {
    const translateTexts = async () => {
      const headerText = await translate('Start a conversation about the tender.');
      // const closeButtonText = language === 'NL' ? 'Sluiten' : 'Close';
      const prompt = await translate('Type your message...');
      const responseMsg = await translate('Fetching response...');
      setTranslatedHeaderText(headerText);
      setTranslatedPrompt(prompt);
      setTranslatedTenderName(tenderName);
      setFetchingResponseMessage(responseMsg); 
      setTranslatedCloseButtonText(language === 'NL' ? 'Sluiten' : 'Close');

    };

    translateTexts();
  }, [language, translate]);




  useEffect(() => {
    const savedTender = localStorage.getItem('selectedTender');
    if (savedTender && !selectedTender) {
      setSelectedTender(savedTender);
    }
  }, [selectedTender, setSelectedTender]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedTender) {
      localStorage.setItem('selectedTender', selectedTender);
    }
  }, [selectedTender]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const translatedMessage = await translate(newMessage); // Translate message before sending


    const newMessageObject = {
      id: messages.length + 1,
      text: newMessage,
      sender: "sent",
    };

    setMessages([...messages, newMessageObject]);
    setNewMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('QUERY', newMessage);
      formData.append('path', selectedTender);

      const response = await fetch('http://68.221.120.250:8000/chat_query', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message to API');
      }

      const result = await response.json();
     const translatedResponse = await translate(result.Answer || "This is an automated response.");
      const apiReply = {
        id: messages.length + 2,
        text: translatedResponse,
        sender: "received",
      };

      setMessages((prevMessages) => [...prevMessages, apiReply]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: messages.length + 2, text: "Failed to get response.", sender: "received" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };





  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-full flex flex-col gap-8">
      <div className='flex flex-row items-center justify-between border-b pb-4'>
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-2xl font-semibold">
            <span>{selectedTender}</span>
          </h2>
          <p className="text-sm text-gray-600">{translatedHeaderText}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-sm text-red-500 hover:text-red-400 font-medium"
        >
            {getHardcodedTranslation('Close')}
        </button>
      </div>

      <div className="flex flex-col h-[400px]">
        <ScrollArea className="flex-1 rounded-md">
          <div className="space-y-2 pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "sent" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.sender === "sent"
                      ? "bg-gray-950 text-white"
                      : "bg-gray-200 text-black"
                  } rounded p-3 max-w-lg break-words text-sm`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown> {/* Render Markdown */}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} /> {/* Ref for auto-scrolling */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-black rounded p-3 max-w-lg text-sm flex items-center">
                  <Loader className="animate-spin mr-2 h-5 w-5" />
                  {fetchingResponseMessage}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      

      <form className="flex items-center gap-3" onSubmit={handleSendMessage}>
        <Input
          placeholder={translatedPrompt}
          className="text-sm rounded py-3 border w-full text-gray-600 border-gray-300"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-gray-950 p-3 rounded border-2 border-black"
          disabled={loading}
        >
          {loading ? (
            <Loader className="animate-spin h-4 w-4 text-white" />
          ) : (
            <Send className="h-4 w-4 text-white" />
          )}
        </Button>
      </form>
    </div>
  );
}

export default ChatBox;
