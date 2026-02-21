import React, { useState,} from "react";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import { useLocation } from "react-router-dom";
import {
  FaCarSide,
  FaCalendarAlt,
  FaHandPaper,
  FaChevronDown,
  FaChevronUp,
  FaGasPump,
  FaCogs,
  
} from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { Collapse } from "react-bootstrap";


// בתחילת הקובץ - הוסף את carItems כך שהתמונה הראשית תהיה ראשונה

const CarItem = ({ car, handleDeleteCar, handleEditCar }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0); // ← אינדקס התמונה הנוכחית
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const currentDate = new Date();
  const carDate = car.timestamp.toDate();
  const isNew = (currentDate - carDate) / (1000 * 60 * 60 * 24) <= 7;

  const handleImageClick = (image) => {
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // ========== סדר התמונות - התמונה הראשית קדימה ==========
  const orderedImages = [];
  if (car.carImages && Array.isArray(car.carImages)) {
    // קבל אינדקס התמונה הראשית (או 0 אם לא קיים)
    const primaryIndex = car.primaryImageIndex || 0;
    
    // הוסף את התמונה הראשית ראשונה
    orderedImages.push(car.carImages[primaryIndex]);
    
    // הוסף את שאר התמונות
    car.carImages.forEach((image, index) => {
      if (index !== primaryIndex) {
        orderedImages.push(image);
      }
    });
  }

  const carouselItems = [];
  orderedImages.forEach((image, index) => {
    carouselItems.push(
      <Carousel.Item key={`${image}-${index}`}>
        <img
          src={image}
          alt={`Slide ${index}`}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={() => handleImageClick(image)}
        />
        {/* תווית "תמונה ראשית" להיוויסותן */}
        {index === 0 && (
          <div className="absolute top-2 right-2 bg-clear-500 text-white px-2 py-1 rounded text-xs font-bold">
            📸 
          </div>
        )}
      </Carousel.Item>
    );
  });

  const calculateMonthlyPayment = (price) => {
    const loanAmount = Number(price);
    const interestRate = 0.14 / 12;
    const totalMonths = 60;

    const monthlyPayment =
      (loanAmount * interestRate) /
      (1 - Math.pow(1 + interestRate, -totalMonths));

    return Math.round(monthlyPayment).toLocaleString();
  };

  return (
    <div
      key={car._id}
      className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-3xl transition-shadow duration-300"
    >
      {/* Carousel */}
      <div className="relative">
        <Carousel indicators={false} interval={null} activeIndex={activeImageIndex} onSelect={(selectedIndex) => setActiveImageIndex(selectedIndex)}>
          {carouselItems}
        </Carousel>

        {/* Overlay Icons */}
        <div className="absolute bottom-2 left-0 right-0 text-black flex justify-around text-lg py-1 z-10 bg-white bg-opacity-75 rounded-lg mx-4">
          <div className="flex items-center gap-1">
            <span>{car.EngineKind}</span>
            <FaGasPump className="text-blue-400" />
          </div>
          <div className="flex items-center gap-1">
            <span>{car.Gear}</span>
            <FaCogs className="text-blue-400" />
          </div>
          <div className="flex items-center gap-1">
            <span>{car.EngineCapacity} סמ״ק</span>
            <IoMdSpeedometer className="text-blue-400" />
          </div>
        </div>

        {/* Badges */}
        {car.isElectric && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            רכב חשמלי
          </div>
        )}
        {car.isHybrid && (
          <div className="absolute top-4 right-4 bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            רכב היברידי
          </div>
        )}
        {isNew && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            חדש באתר
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 text-right" dir="rtl">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
          {car.make} {car.model}
        </h3>

        {/* Key Details */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <FaCarSide className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-sm font-medium text-gray-700">{car.kilometer.toLocaleString()} ק״מ</span>
            </div>
            <div className="flex flex-col items-center">
              <FaHandPaper className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-sm font-medium text-gray-700">{car.hand} יד</span>
            </div>
            <div className="flex flex-col items-center">
              <FaCalendarAlt className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-sm font-medium text-gray-700">{car.year}</span>
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-controls="collapse-text"
          aria-expanded={open}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200 mb-4"
        >
          {open ? <FaChevronUp /> : <FaChevronDown />}
          פרטים נוספים
        </button>

        {/* Collapsible Details */}
        <Collapse in={open}>
          <div id="collapse-text" className="mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">בעלות נוכחית:</span>
                <span>{car.Ownershep}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">נפח מנוע:</span>
                <span>{car.EngineCapacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">סוג מנוע:</span>
                <span>{car.EngineKind}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">גיר:</span>
                <span>{car.Gear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">סוג:</span>
                <span>{car.kind}</span>
              </div>
              {car.isElectric && (
                <div className="text-center bg-green-100 text-green-800 py-2 rounded-lg font-bold">
                  רכב זה חשמלי
                </div>
              )}
              {car.isHybrid && (
                <div className="text-center bg-green-100 text-green-800 py-2 rounded-lg font-bold">
                  רכב זה היברידי
                </div>
              )}
            </div>
          </div>
        </Collapse>

        {/* Description */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-white">
          <p className="text-gray-700 text-base leading-relaxed">{car.description}</p>
        </div>

        {/* Price Section */}
        {location.pathname !== '/np' && (
          <div className="text-center mb-4">
            <div className="text-red-500 text-3xl font-bold underline">
              ₪{car.price.toLocaleString()}
            </div>
            <p className="text-gray-500 text-sm mt-1">ט.ל.ח</p>
          </div>
        )}
        {location.pathname === '/np' && (
          <div className="text-center mb-4">
            <div className="flex justify-center items-center gap-2 mb-2">
              <p className="text-red-500 text-2xl font-bold">₪{car.fullprice}</p>
              <p className="text-gray-700 text-lg">:מחיר מחירון</p>
            </div>
            <hr className="border-t border-gray-300 my-2" />
            <div className="text-lg text-gray-700 font-medium">
              החל מ-₪{calculateMonthlyPayment(car.fullprice)} לחודש
            </div>
            <p className="text-gray-500 text-sm mt-1">ט.ל.ח</p>
          </div>
        )}

        {/* Admin Buttons */}
        {location.pathname === "/AdminAddCars" && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => { if (window.confirm("האם אתה בטוח שברצונך למחוק את הרכב?") === true) { handleDeleteCar(car.id) } }}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              מחק רכב
            </button>
            <button
              onClick={() => { if (window.confirm("האם אתה בטוח שברצונך לערוך את הרכב?") === true) { handleEditCar(car) } }}
              className="px-6 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              ערוך רכב
            </button>
          </div>
        )}
      </div>

      {/* Modal for image popup */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-right">
            תמונת {car.make}-{car.model}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>{carouselItems}</Carousel>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CarItem;