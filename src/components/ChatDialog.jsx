import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import ScrollArea from '../components/ui/ScrollArea';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Send } from 'lucide-react';

function ChatDialog({ isOpen, onOpenChange, translate }) {
  const [chatMessage, setChatMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the chat message submission logic here
    console.log(chatMessage);
    setChatMessage(''); // Clear input after submission
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translate("Chat")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-1 pr-4">
            {/* Chat messages would go here */}
            <div className="text-sm text-gray-500">
              {translate("Chat messages will appear here.")}
            </div>
          </ScrollArea>
          <form className="flex items-center mt-4" onSubmit={handleSubmit}>
            <Input
              className="flex-1"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={translate("Type your message...")}
            />
            <Button type="submit" size="icon" className="ml-2">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatDialog;
