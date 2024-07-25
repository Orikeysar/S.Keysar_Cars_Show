import React, { useState } from 'react';

const Filter = ({ onFilter }) => {
  const [kind, setKind] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxKilometer, setMaxKilometer] = useState('');
  const [maxYear, setMaxYear] = useState('');

  const handleFilter = () => {
    onFilter({ kind, maxPrice, maxKilometer, maxYear });
  };

  return (
    <div className="p-4">
      <div>
        <p className="text-2xl underline mb-4 text-center">סינון הצגת רכבים לצורך מחיקה</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div className="col-span-1 md:col-span-1">
          <label className="block text-right">סוג רכב</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">בחר סוג רכב</option>
            <option value="קרוסוברים">קרוסוברים</option>
            <option value="משפחתיים">משפחתיים</option>
            <option value="ג'יפים">ג'יפים</option>
            <option value="קטנים">קטנים</option>
            <option value="מנהלים">מנהלים</option>
            <option value="+מקומות 7">+מקומות 7</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="block text-right">מחיר מקסימלי</label>
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
        <div className="col-span-1 md:col-span-1">
          <label className="block text-right">שנה מקסימלית</label>
          <input
            type="number"
            value={maxYear}
            onChange={(e) => setMaxYear(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
     
      </div>
      <div className="col-span-1 md:col-span-1 flex items-center ">
          <button onClick={handleFilter} className="p-2 bg-blue-500 text-white rounded w-full">
            סנן
          </button>
        </div>
    </div>
  );
};

export default Filter;
