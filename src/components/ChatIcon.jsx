import React , { useState } from 'react';
import { MessageCircle, NavigationIcon } from 'lucide-react';
import Button from './ui/Button';
import ChatBox from '../pages/ChatBox';


const ChatIcon = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat box

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };
  

  return (
    <div className="fixed bottom-4 right-4">
    {/* Conditionally Render ChatBox */}
    {isChatOpen && <ChatBox onClose={toggleChat} />}

    {/* Chat Icon Button */}
    <Button
      onClick={toggleChat}
      className="rounded-full w-12 h-12 bg-gray-950 hover:bg-gray-900 text-white flex items-center 
      justify-center transform transition-transform duration-500 hover:scale-[105%]"
      size="icon"
      variant="default"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  </div>
  );
};


export default ChatIcon;
