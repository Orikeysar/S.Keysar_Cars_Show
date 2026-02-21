import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import AddCarForm from './AddCarForm';
import Filter from './Filter';
import { getCars, addCar, deleteCar } from '../services/carService';
import { updateAllCarsWithPrimaryIndex } from '../services/updateAllCars'; // ← הוסף זאת
import { useNavigate } from 'react-router-dom';
import CarItem from './CarItem';

function AdminAddCars() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [updating, setUpdating] = useState(false); // ← הוסף זאת
  const [updateResult, setUpdateResult] = useState(null); // ← הוסף זאת

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const cars = await getCars();
      setCars(cars);
      setFilteredCars(cars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
      setFilteredCars([]);
    }
  };

  const handleAddCar = async (formData) => {
    console.log('handleAddCar called');
    try {
      await addCar(formData);
      fetchCars();
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await deleteCar(id);
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleFilter = ({ kind, maxPrice, maxKilometer, maxYear, isElectric, isHybrid }) => {
    let filtered = cars;

    if (kind) {
      filtered = filtered.filter(car => car.kind === kind);
    }

    if (maxPrice) {
      filtered = filtered.filter(car => car.price <= maxPrice);
    }

    if (maxKilometer) {
      filtered = filtered.filter(car => car.kilometer <= maxKilometer);
    }

    if (maxYear) {
      filtered = filtered.filter(car => car.year <= maxYear);
    }

    setFilteredCars(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
  };

  // ========== כפתור עדכון כל הרשומות ==========
  // eslint-disable-next-line no-unused-vars
  const handleUpdateAllCars = async () => {
    setUpdating(true);
    try {
      const response = await updateAllCarsWithPrimaryIndex();
      setUpdateResult(response);
      
      // הצג הודעה למשך 5 שניות ואז הסתר
      setTimeout(() => {
        setUpdateResult(null);
      }, 5000);

      // רענן את הרשימה
      if (response.success) {
        fetchCars();
      }
    } catch (error) {
      setUpdateResult({
        success: false,
        error: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Layout>
      <div className="text-center">
        <h2 className="text-3xl mb-4">פורמט הוספת ומחיקת רכבים</h2>
        
        <div className="flex gap-2 mb-4 justify-center">
          <button 
            onClick={handleLogout} 
            className="p-2 bg-red-500 text-white rounded font-bold hover:bg-red-700"
          >
            Logout
          </button>

          {/* ========== כפתור עדכון ========== */}
          {/* <button 
            onClick={handleUpdateAllCars}
            disabled={updating}
            className={`p-2 rounded font-bold text-white transition ${
              updating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-700'
            }`}
          >
            {updating ? '⏳ מעדכן...' : '🔄 עדכן את כל הרכבים'}
          </button> */}
        </div>

        {/* הודעת עדכון */}
        {updateResult && (
          <div className={`mb-4 p-3 rounded border-2 ${
            updateResult.success 
              ? 'bg-green-100 border-green-400 text-green-700' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {updateResult.message || updateResult.error}
          </div>
        )}

        <AddCarForm onAdd={handleAddCar} selectedCar={selectedCar} />
        <Filter onFilter={handleFilter} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {Array.isArray(filteredCars) && filteredCars.map((car) => (
            <CarItem 
              key={car.id} 
              car={car} 
              handleDeleteCar={handleDeleteCar}  
              handleEditCar={handleEditCar}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default AdminAddCars;