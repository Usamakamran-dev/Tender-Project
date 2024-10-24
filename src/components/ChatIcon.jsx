import React from 'react';
import { MessageCircle, NavigationIcon } from 'lucide-react';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';


const ChatIcon = () => {
  const navigate = useNavigate();

  return (
    <Button
      className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-gray-950 hover:bg-gray-900 text-white flex items-center 
      justify-center transform transition-transform duration-500 hover:scale-[105%]"
      size="icon"
      variant="default"
      onClick={() => navigate('chat-box') }
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};


export default ChatIcon;
