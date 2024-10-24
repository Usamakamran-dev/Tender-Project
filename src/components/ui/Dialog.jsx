import React, { useState } from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
  return open ? (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {children}
      </div>
      <button className="absolute top-4 right-4" onClick={() => onOpenChange(false)}>
        Close
      </button>
    </div>
  ) : null;
};

export const DialogTrigger = ({ asChild, onClick, children }) => {
  const child = React.Children.only(children);

  return React.cloneElement(child, {
    onClick: () => onClick(),
  });
};

export const DialogContent = ({ children }) => <>{children}</>;
export const DialogHeader = ({ children }) => <div className="text-xl mb-4">{children}</div>;
export const DialogTitle = ({ children }) => <h3 className='text-xl'>{children}</h3>;
