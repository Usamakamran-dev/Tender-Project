import React, { useState } from 'react';

export const Popover = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const PopoverTrigger = ({ asChild, onClick, children }) => {
  const child = React.Children.only(children);

  return React.cloneElement(child, {
    onClick: () => onClick(),
  });
};

export const PopoverContent = ({ children }) => (
  <div className="absolute bg-white p-4 shadow-lg rounded-md">{children}</div>
);
