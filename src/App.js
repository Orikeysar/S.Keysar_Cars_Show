import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getCars } from './services/carService';
import Filter from './components/Filter';
import Layout from './components/Layout';
import CarItem from './components/CarItem';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const fetchedCars = await getCars();
        setCars(fetchedCars);
        setFilteredCars(fetchedCars); // Initially show all cars
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  const handleFilter = (filterCriteria) => {
    let filtered = cars;

    if (filterCriteria.kind && filterCriteria.kind !== 'חשמלי' && filterCriteria.kind !== 'היברידי') {
      filtered = filtered.filter(car => car.kind === filterCriteria.kind);
    }
    if (filterCriteria.maxPrice) {
      filtered = filtered.filter(car => car.price <= filterCriteria.maxPrice);
    }
    if (filterCriteria.maxKilometer) {
      filtered = filtered.filter(car => car.kilometer <= filterCriteria.maxKilometer);
    }
    if (filterCriteria.maxYear) {
      filtered = filtered.filter(car => car.year <= filterCriteria.maxYear);
    }
    if (filterCriteria.isElectric) {
      filtered = filtered.filter(car => car.isElectric);
    }
    if (filterCriteria.isHybrid) {
      filtered = filtered.filter(car => car.isHybrid);
    }
    setFilteredCars(filtered);
  };

  return (
    <Layout>
      <Filter onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredCars.map((car) => (
            <CarItem key={car.id} car={car} />
          ))
        )}
      </div>
    </Layout>
  );
};

export default App;
