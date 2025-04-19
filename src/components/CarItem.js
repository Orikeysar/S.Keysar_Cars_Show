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
} from "react-icons/fa";
import { Collapse, Button } from "react-bootstrap";

const CarItem = ({ car, handleDeleteCar,handleEditCar  }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const location = useLocation();
  //פתיחת פרטים נוספים.
  const [open, setOpen] = useState(false);
 
 // Calculate if the car was added within the last week
 const currentDate = new Date();
 const  carDate = car.timestamp.toDate();
  const isNew = (currentDate - carDate) / (1000 * 60 * 60 * 24) <= 7;


  const handleImageClick = (image) => {
    setModalImage(`${image}`);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const carouselItems = [];
  if (car.carImages && Array.isArray(car.carImages)) {
    car.carImages?.forEach((image, index) => {
      carouselItems.push(
        <Carousel.Item key={`${image}-${index}`}>
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
    <div
      key={car._id}
      className="max-w-sm rounded overflow-hidden shadow-lg bg-white relative border border-gray-300 text-right"
    >
      <Carousel>{carouselItems}</Carousel>
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
        <div className="text-gray-600 mb-4 mt-4 bg-gray-50 rounded-full border p-2  ">
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
        <div className="flex justify-end">
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="collapse-text"
            aria-expanded={open}
            variant="link"
            className="text-gray-600 flex items-end justify-end text-end"
          >
            <span>
              {open ? (
                <FaChevronUp className="ml-1 " />
              ) : (
                <FaChevronDown className="ml-1" />
              )}
            </span>
            פרטים נוספים
          </Button>
          <Collapse in={open}>
            <div id="collapse-text" className="mb-4">
              {/* כאן תוסיף את פרטי המכונית הנוספים */}
              <div className="flex items-center justify-end mb-1">
                בעלות נוכחית:  {car.Ownershep}
              </div>
              <div className="flex items-center justify-end mb-1">
               נפח מנוע:  {car.EngineCapacity}
              </div>
              <div className="flex items-center justify-end mb-1">
                סוג מנוע:  {car.EngineKind}
              </div>
              <div className="flex items-center justify-end mb-1 ">
                גיר:  {car.Gear}
              </div>
              <div className="flex items-center justify-end mb-1">
                {" "}
                סוג:  {car.kind}
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
        <p className="flex left-0 text-gray-400 mb-0  ">ט.ל.ח</p>
        {location.pathname === "/AdminAddCars" && (
          <div className="text-center">
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
