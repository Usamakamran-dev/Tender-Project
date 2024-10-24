import React from 'react';

const Switch = ({ checked, onCheckedChange }) => {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onCheckedChange(!checked)}
        className="sr-only"
      />
      <div className="w-10 h-6 bg-gray-200 rounded-full">
        <div
          className={`h-6 w-6 bg-blue-500 rounded-full transform transition-transform duration-300 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
};

export default Switch;
