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
  FaEdit,
  FaTrash,
  FaGasPump,
  FaCogs,
  
} from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { Collapse, Button } from "react-bootstrap";


// בתחילת הקובץ - הוסף את carItems כך שהתמונה הראשית תהיה ראשונה

const CarItem = ({ car, handleDeleteCar, handleEditCar }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0); // ← אינדקס התמונה הנוכחית
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const currentDate = new Date();
  const carDate = car.timestamp.toDate();
  const isNew = (currentDate - carDate) / (1000 * 60 * 60 * 24) <= 7;

  const handleImageClick = (image) => {
    setModalImage(`${image}`);
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
      className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white relative border border-gray-300 text-right"
    >
     <Carousel indicators={false} interval={null} activeIndex={activeImageIndex} onSelect={(selectedIndex) => setActiveImageIndex(selectedIndex)}>
  {carouselItems}
</Carousel>
      <div className="relative">


  {/* אייקונים שיופיעו על התמונה */}
  <div className="absolute bottom-2 left-0 right-0 rounded-full bg-slate-200 bg-opacity-40 text-black flex justify-around text-lg py-1 z-10">
    <div className="flex items-center gap-1">
      <span>{car.EngineKind}</span>
      <FaGasPump/>
    </div>
    <div className="flex items-center gap-1">
      <span>{car.Gear}</span>
      <FaCogs/>
    </div>
    <div className="flex items-center gap-1">
      <span>{car.EngineCapacity} סמ״ק</span>
      <IoMdSpeedometer />
    </div>
  </div>
</div>


      {car.isElectric && (
        <div className="absolute top-0 right-0 bg-green-500 opacity-70 text-white px-3 py-2 text-s font-bold ">
          רכב חשמלי
        </div>
      )}
      {car.isHybrid && (
        <div className="absolute top-0 right-0 bg-green-500 opacity-70 text-white px-3 py-2 text-s font-bold ">
          רכב היברידי
        </div>
      )}
       {isNew && (
        <div className="absolute top-0 left-0 bg-red-500 opacity-70 text-white px-3 py-2 text-s font-bold">
          חדש באתר
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-end   mb-2">
          <h3 className="text-xl font-bold text-gray-800 ">
            {car.make} {car.model}
          </h3>
         
        </div>
        <div className="text-lg  bg-gray-60 rounded-full border p-3   ">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <span> {car.kilometer.toLocaleString()}</span>
              <FaCarSide className="w-4 h-4 text-gray-500 ml-1" />
            </div>

            <div className="flex items-center">
              <span>{car.hand} יד</span>
              <FaHandPaper className="w-4 h-4 text-gray-500 ml-1" />
            </div>

            <div className="flex items-center">
              <span>{car.year}</span>
              <FaCalendarAlt className="w-4 h-4 text-gray-500 ml-1" />
            </div>
          </div>
        </div>
        <div className="flex justify-end w-full ">
        <div className="flex justify-end w-full  ">
  <button
    onClick={() => setOpen(!open)}
    aria-controls="collapse-text"
    aria-expanded={open}
    className="bg-gray-200 text-gray-700 py-2 px-4 rounded text-center font-semibold flex items-center gap-2 shadow-sm justify-center w-full mb-4 mt-4"
  >
    {open ? <FaChevronUp /> : <FaChevronDown />}
    פרטים נוספים
  </button>
</div>
<Collapse in={open}>
  <div  dir="rtl" id="collapse-text" className="mb-4 mt-4 border border-gray-500 rounded-lg p-4 bg-gray-50 text-right pt-4 w-full  ">
    <div   className=" items-center justify-start mb-1 ">
      <span className="flex font-semibold text-gray-800 ">בעלות נוכחית:</span>&nbsp;{car.Ownershep}
    </div>
    <div className="flex items-center justify-start mb-1">
      <span className="font-semibold text-gray-800 ">נפח מנוע:</span>&nbsp;{car.EngineCapacity}
    </div>
    <div className="flex items-center justify-start mb-1">
      <span className="font-semibold text-gray-800 ">סוג מנוע:</span>&nbsp;{car.EngineKind}
    </div>
    <div className="flex items-center justify-start mb-1 ">
      <span className="font-semibold text-gray-800">גיר:</span>&nbsp;{car.Gear}
    </div>
    <div className="flex items-center justify-start mb-1 ">
      <span className="font-semibold text-gray-800">סוג:</span>&nbsp;{car.kind}
    </div>
 


              {car.isElectric && (
                <div className="flex items-center justify-center mb-1 rounded font-bold text-white bg-green-400">
                  רכב זה חשמלי{" "}
                </div>
              )}
              {car.isHybrid && (
                <div className="flex items-center justify-center mb-1 rounded font-bold text-white bg-green-400">
                  רכב זה היברידי{" "}
                </div>
              )}

              {/* תוכל להוסיף כל פרטים נוספים שתרצה כאן */}
            </div>
          </Collapse>
        </div>
        <div className="border rounded-md p-2 mb-4">
          <p className="text-gray-700 text-base">{car.description}</p>
        </div>
        {location.pathname !== '/np' && (
      <div className="text-red-500 text-2xl font-semibold text-center underline blink">
      ₪{car.price.toLocaleString()}
    </div>
      )}
      {location.pathname === '/np' && (
         <div>
         <div className="flex text-left left-0 justify-end">
           <p className="text-red-500 text-2xl font-semibold text-center m-2">
             ₪{car.fullprice}
           </p>
           <p className="text-black text-xl m-2">:מחיר מחירון</p>
         </div>
       
         {/* הקו האפור הדק */}
         <hr className="border-t border-gray-700 my-2" />
       
         <div className="text-lg text-gray-700 mt-1 text-left blink">
           החל מ-₪{calculateMonthlyPayment(car.fullprice)} לחודש
         </div>
       </div>
       
        
      )}
        <p className=" text-right text-gray-400 mb-0  ">ט.ל.ח</p>
        {location.pathname === "/AdminAddCars" && (
          <div className="flex justify-around px-4">
            <button
              onClick={() =>{if(window.confirm("האם אתה בטוח שברצונך למחוק את הרכב?")===true){handleDeleteCar(car.id)} }}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              מחק רכב
            </button>
            <button
              onClick={() =>{if(window.confirm("האם אתה בטוח שברצונך לערוך את הרכב?")===true){handleEditCar(car)} }}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 "
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