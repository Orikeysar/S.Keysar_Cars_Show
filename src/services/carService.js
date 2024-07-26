import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

const carCollection = collection(db, 'cars');



export const getCars = async () => {
    const querySnapshot = await getDocs(carCollection);
    const cars = [];
    querySnapshot.forEach((doc) => {
      cars.push({ id: doc.id, ...doc.data() });
    });
    return cars;
  };

export const addCar = async (carData) => {
  const docRef = await addDoc(carCollection, carData);
  return { id: docRef.id, ...carData };
};

export const deleteCar = async (id) => {
  await deleteDoc(doc(db, 'cars', id));
};

export const updateCar = async (id, updatedData) => {
  const carDoc = doc(db, 'cars', id);
  await updateDoc(carDoc, updatedData);
};
