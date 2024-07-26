// src/components/AddCarForm.js
import React, { useState } from 'react';
import { db, storage } from '../firebase.config';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Spinner from './Spinner';

const AddCarForm = ({ onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    kilometer: '',
    description: '',
    hand: '',
    kind: '',
    images: [],
    isElectric: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { make, model, year, price, kilometer, description, hand, kind, images, isElectric } = formData;

    if (!make || !model || !year || !price || !kilometer || !description || !hand || !kind) {
      setError('נא מלא את כל הפרמטרים');
      setLoading(false);
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        images.map((image) => handleImageUpload(image))
      );

      const carData = {
        make,
        model,
        year,
        price,
        kilometer,
        description,
        hand,
        kind,
        isElectric,
        carImages: uploadedImages,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'cars'), carData);
      onAdd(carData);
      setFormData({
        make: '',
        model: '',
        year: '',
        price: '',
        kilometer: '',
        description: '',
        hand: '',
        kind: '',
        images: [],
        isElectric: false,
      });
      setError('');
      setLoading(false);
    } catch (e) {
      console.error('Error adding document: ', e);
      setLoading(false);
    }
  };

  const handleImageUpload = (imageFile) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `carimages/${uuidv4()}-${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({ ...prevState, images: files }));
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-center">שם יצרן רכב</label>
          <input
            type="text"
            id="make"
            value={formData.make}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div>
          <label className="block text-center">דגם</label>
          <input
            type="text"
            id="model"
            value={formData.model}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div>
          <label className="block text-center">סוג רכב</label>
          <select
            id="kind"
            value={formData.kind}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
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
        <div>
          <label className="block text-center">שנה</label>
          <input
            type="number"
            id="year"
            value={formData.year}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div>
          <label className="block text-center">מחיר</label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div>
          <label className="block text-center">קילומטר</label>
          <input
            type="number"
            id="kilometer"
            value={formData.kilometer}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div>
          <label className="block text-center">יד</label>
          <input
            type="number"
            id="hand"
            value={formData.hand}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div>
          <label className="block text-center">תיאור קצר על הרכב</label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div>
          <label className="block text-center">העלה תמונות (עד 5)</label>
          <input
            type="file"
            multiple
            id="images"
            onChange={handleImageChange}
            className="p-2 border rounded w-full text-center"
            accept="image/*"
          />
        </div>
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            id="isElectric"
            checked={formData.isElectric}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="block">רכב חשמלי</label>
        </div>
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded w-full">
        Add Car
      </button>
    </form>
  );
};

export default AddCarForm;
