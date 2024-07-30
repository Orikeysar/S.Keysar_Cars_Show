import React from 'react';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import Logo from '../Data/logo/logo_S.keysar.jpg';

const Layout = ({ children }) => {
  const phoneNumber = '0522682424';
  const whatsappNumber = `https://wa.me/${phoneNumber}`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-0 m-0 flex justify-center items-center md:items-end">
        <div className="w-3/4 flex flex-col justify-center items-center">
          <h1 className="text-xl w-full text-end">ש.קיסר</h1>
          <h1 className="text-xl w-full text-end">קניה בטוחה לרכב שלך</h1>
        </div>
        <div className="w-1/4 flex justify-end">
          <img src={Logo} alt="S.Keysar Logo" className="h-14" />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 mb-14">{children}</main>
      <footer className="bg-gray-800 text-white p-2 fixed bottom-0 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-left">
            &copy; 2024 S.Keysar
          </div>
          <div className="text-right flex flex-col items-end ">
            <a href={`tel:${phoneNumber}`} className="underline flex items-center mb-2">
               {phoneNumber} <FaPhone className="ml-2" />
            </a>
            <a href={whatsappNumber} target="_blank" rel="noopener noreferrer" className="underline flex items-center">
              שלח הודעה  <FaWhatsapp className="ml-2" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
