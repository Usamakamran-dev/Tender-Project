import React from 'react';


const Input = ({ value, onChange, placeholder, ...props }) => {
  return (
    <input
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
