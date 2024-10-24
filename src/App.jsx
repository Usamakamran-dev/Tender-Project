import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import './index.css';
import TenderProvider from './context/TenderProvider';

function App() {
  return (
    <TenderProvider>
      <RouterProvider router={router} />
    </TenderProvider>
  );
}

export default App;
