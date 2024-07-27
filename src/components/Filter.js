import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

const Filter = ({ onFilter }) => {
  const [kind, setKind] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxKilometer, setMaxKilometer] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isElectric, setIsElectric] = useState(false);
  const [isHybrid, setIsHybrid] = useState(false);

  const handleFilter = () => {
    onFilter({ kind, maxPrice, maxKilometer, maxYear, isElectric, isHybrid });
  };

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

    <div className="p-4">
      <div className='flex justify-end'>
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full shadow-lg z-0"
      >
        <FaFilter className="mr-2" />
        סינון
      </button>
      </div>
      {showFilter && (
        <div className="mt-4 text-right">
          <div>
            <p className="text-2xl underline mb-4 text-center">סינון רכבים</p>
          </div>
          <div className="flex flex-wrap gap-4 mb-4 justify-end s:w-full">
            <div className="flex flex-col items-end s:w-full">
              <label className="block">:סוג רכב</label>
              <select
                value={kind}
                onChange={handleKindChange}
                className="p-2 border rounded  text-right s:w-full"
              >
                <option className="text-right" value="">בחר סוג רכב</option>
                <option className="text-right" value="מיני">מיני</option>
                <option className="text-right" value="משפחתי">משפחתי</option>
                <option className="text-right" value="קרוסאובר">קרוסאובר</option>
                <option className="text-right" value="7 מקומות">7 מקומות</option>
                <option className="text-right" value="חשמלי">חשמלי</option>
                <option className="text-right" value="היברידי">היברידי</option>
              </select>
            </div>
            <div className="flex flex-col items-end s:w-full">
              <label className="block">:עד מחיר</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="flex flex-col items-end  s:w-full ">
              <label className="block">:עד קילומטר</label>
              <input
                type="number"
                value={maxKilometer}
                onChange={(e) => setMaxKilometer(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            {/* חיפןש לפי שנה מקסימלית */}
            {/* <div className="flex flex-col items-end">
              <label className="block">שנה מקסימלית:</label>
              <input
                type="number"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div> */}
          </div>
          <div className="flex justify-end">
            <button onClick={handleFilter} className="p-2 bg-blue-500 text-white rounded">
              סנן
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
