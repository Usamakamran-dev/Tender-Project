import React from 'react';

const Textarea = ({ value, onChange, placeholder, ...props }) => {
  return (
    <textarea
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      rows='5'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Textarea;
