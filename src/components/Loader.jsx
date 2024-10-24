import React from 'react';
import { ClipLoader } from 'react-spinners';

function Loader() {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
      <ClipLoader size={100} color={"#000000"} />
    </div>
  );
}

export default Loader;
