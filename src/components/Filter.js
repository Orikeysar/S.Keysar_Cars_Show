import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Collapse } from 'react-bootstrap';

const Filter = ({ onFilter }) => {
  const [kind, setKind] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxKilometer, setMaxKilometer] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isElectric, setIsElectric] = useState(false);
  const [isHybrid, setIsHybrid] = useState(false);

  useEffect(() => {
    onFilter({ kind, maxPrice, maxKilometer, isElectric, isHybrid });
  }, [kind, maxPrice, maxKilometer, isElectric, isHybrid, onFilter]);

  const handleKindChange = (e) => {
    const value = e.target.value;
    setKind(value);

    // Reset the electric and hybrid states
    setIsElectric(false);
    setIsHybrid(false);

    // Set the electric or hybrid state if applicable
    if (value === 'חשמלי') {
      setIsElectric(true);
    } else if (value === 'היברידי') {
      setIsHybrid(true);
    }
  };

  return (
    <div className="flex row bg-white shadow-lg rounded-lg p-4 border border-gray-200" dir="rtl">
      <div className=" mt-2 mb-2 w-full">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center justify-center w-full p-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg shadow-md transition-colors duration-200"
        >
          <FaFilter className="ml-2" />
          סינון
        </button>
      </div>
      <Collapse in={showFilter}>
        <div className="mt-4 bg-white shadow-lg rounded-lg p-6 border border-gray-200" dir="rtl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <FaFilter className="text-blue-400" />
              סינון רכבים
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2">:סוג רכב</label>
              <select
                value={kind}
                onChange={handleKindChange}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="">בחר סוג רכב</option>
                <option value="מיני">מיני</option>
                <option value="משפחתי">משפחתי</option>
                <option value="קרוסאובר">קרוסאובר</option>
                <option value="7 מקומות">7 מקומות</option>
                <option value="חשמלי">חשמלי</option>
                <option value="היברידי">היברידי</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2">:עד מחיר</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="הכנס מחיר מקסימלי"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2">:עד קילומטר</label>
              <input
                type="number"
                value={maxKilometer}
                onChange={(e) => setMaxKilometer(e.target.value)}
                placeholder="הכנס ק״מ מקסימלי"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Filter;
