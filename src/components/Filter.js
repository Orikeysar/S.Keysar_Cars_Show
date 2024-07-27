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
    onFilter({ kind, maxPrice, maxKilometer, maxYear,isElectric,isHybrid });
  }
  //בודק אם סונן לפי חשמלי או היברידי
  const handleKindChange = (e) => {
    const value = e.target.value;
    setKind(value);
    setIsElectric(value === 'חשמלי');
    setIsHybrid(value === 'היברידי');
  };
  return (
    <div className="p-4">
      <button
        onClick={() => setShowFilter(!showFilter)}
        className=" flex items-center justify-center p-2 bg-blue-500 text-white rounded-full shadow-lg z-0"
      >
        <FaFilter className="mr-2" />
        סינון
      </button>
      {showFilter && (
        <div className="mt-4">
          <div>
            <p className="text-2xl underline mb-4 text-center">סינון רכבים </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="col-span-1 md:col-span-1">
              <label className="block text-right">:סוג רכב</label>
              <select
                value={kind}
                onChange={handleKindChange}
                className="p-2 border rounded w-full text-right"
              >
                <option className=" text-right" value="">בחר סוג רכב</option>
                <option className=" text-right" value="מיני">מיני</option>
                <option className=" text-right"  value="משפחתי">משפחתי</option>
                <option className=" text-right" value="קרוסאובר">קרוסאובר</option>
                <option className=" text-right" value="7 מקומות">7 מקומות</option>

                <option className=" text-right" value="חשמלי">חשמלי</option>
                <option className=" text-right" value="היברידי">היברידי</option>

              </select>
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-right">עד מחיר: </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-right">קילומטר מקסימלי</label>
              <input
                type="number"
                value={maxKilometer}
                onChange={(e) => setMaxKilometer(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            {/* חיפןש לפי שנה מקסימלית */}
            {/* <div className="col-span-1 md:col-span-1">
              <label className="block text-right">שנה מקסימלית</label>
              <input
                type="number"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div> */}
          </div>
          <div className="col-span-1 md:col-span-1 flex items-center">
            <button onClick={handleFilter} className="p-2 bg-blue-500 text-white rounded w-full">
              סנן
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
