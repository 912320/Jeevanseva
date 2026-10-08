import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatBot from '../components/common/ChatBot';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>
      <Footer />
      {/* AI Healthcare Assistant — floats on all pages (bottom-right) */}
      <ChatBot />
    </div>
  );
};

export default MainLayout;
