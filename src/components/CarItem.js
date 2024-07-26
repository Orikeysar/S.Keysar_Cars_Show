import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import bootstrap CSS
import { useLocation } from 'react-router-dom';

const CarItem = ({ car, handleDeleteCar }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const location = useLocation();
 

  const handleImageClick = (image) => {
    setModalImage(`${image}`);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const carouselItems = [];
  if (car.carImages && Array.isArray(car.carImages)) {
    car.carImages?.forEach((image, index) => {
      carouselItems.push(
        <Carousel.Item key={index}>
          <img
            src={image}
            alt={`Slide ${index}`}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => handleImageClick(image)}
          />
        </Carousel.Item>
      );
    });
  }

  return (
    <div key={car._id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white relative border border-gray-300 text-right">
      <Carousel>
        {carouselItems}
      </Carousel>
      {car.isElectric && (
        <div className="absolute top-0 right-0 bg-green-500 opacity-65 text-white px-3 py-2 text-s font-bold ">
          רכב חשמלי
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">{car.make} {car.model}</h3>
          <span className="text-red-500 text-lg font-semibold">₪{car.price}</span>
        </div>
        <div className="text-gray-600 mb-2">
          <div className="flex items-center justify-end mb-1">
            <span>שנה: {car.year}</span>
            <svg className="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path></svg>
          </div>
          <div className="flex items-center justify-end mb-1">
            <span>קילומטר: {car.kilometer}</span>
            <svg className="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19h16M4 10l6-6m0 0l6 6m-6-6v6"></path></svg>
          </div>
          <div className="flex items-center justify-end mb-1">
            <span>יד: {car.hand}</span>
            <svg className="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17l-1-1-4 4m1-4H3v4m13-4h6m-1-4H3m9-8h-2l2-2m-2 2v6m9-6l-2-2m2 2h-6m-1 12v-4m4 4v-4"></path></svg>
          </div>
          <div className="flex items-center justify-end mb-1">
            <span>סוג: {car.kind}</span>
          </div>
        </div>
        <div className="bg-gray-100 rounded-full p-2 mb-4">
          <p className="text-gray-700 text-base">{car.description}</p>
        </div>
        {location.pathname === '/AdminAddCars' && (
          <div className="text-center">
            <button
              onClick={() => handleDeleteCar(car.id)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              מחק רכב
            </button>
          </div>
        )}
      </div>

      {/* Modal for image popup */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className='text-right'>תמונת {car.make}-{car.model}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        if (car.carImages && Array.isArray(car.carImages)) {
    car.carImages?.forEach((image, index) => {
      carouselItems.push(
        <Carousel.Item key={index}>
          <img
            src={image}
            alt={`Slide ${index}`}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => handleImageClick(image)}
          />
        </Carousel.Item>
      )
    })
  }
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CarItem;
