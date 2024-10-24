import React from 'react';



const Button = ({ variant = 'default', size = 'md', children, ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-lg';
  let variantStyle = '';

  if (variant === 'outline') {
    variantStyle = 'border border-gray-300 text-gray-700';
  } else if (variant === 'ghost') {
    variantStyle = 'text-gray-700';
  } else {
    variantStyle = 'bg-blue-500 text-white';
  }

  return (
    <button className={`${baseStyle} ${variantStyle}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
