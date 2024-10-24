import React, { useContext, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './../components/Header'; // Your header component
import Sidebar from './../components/Sidebar'; // Your sidebar component
import ChatIcon from '../components/ChatIcon';
import { TenderContext } from '../context/TenderProvider';
import Loader from '../components/Loader.jsx'; // Import the loader

function ParentElement() {
  const contextValue = useContext(TenderContext);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />

       <div className="flex-1 p-6 overflow-auto bg-gray-50 relative">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>

      {contextValue.showChatIcon && <ChatIcon />}
    </div>
  );
}

export default ParentElement;
