import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import ScrollArea from './ui/ScrollArea';
import Button from './ui/Button';

function TextModificationDialog({ isOpen, onClose, modifiedText, applyTextModification, translate }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{translate("Modify Text")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <p>{modifiedText}</p>
          </ScrollArea>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>{translate("Reject")}</Button>
            <Button onClick={applyTextModification}>{translate("Apply")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TextModificationDialog;
