import React from 'react';
import Logo from '../Data/logo/logo_S.keysar.jpg';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-1 m-0 flex items-center opacity-90">
       
        <div className="w-2/3 flex flex-col justify-start items-start">
          <h1 className="text-2xl w-full text-center">S.Keysar</h1>
          <h1 className="text-2xl w-full text-center">הקניה בטוחה לרכב שלך</h1>
        </div>
        <div className="w-1/3 flex justify-end">
          <img src={Logo} alt="S.Keysar Logo" className=" h-14"/>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-left">
            &copy; 2024 S.Keysar
          </div>
          <div className="text-right">
            טלפון - 0527416677
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
