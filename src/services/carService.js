import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc,getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getStorage, ref, deleteObject } from "firebase/storage";
const carCollection = collection(db, 'cars');
const storage = getStorage();


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

const deleteImagesFromStorage = async (imageUrls) => {
  try {
    const deletePromises = imageUrls.map((url) => {
      const imageRef = ref(storage, url);
      return deleteObject(imageRef);
    });
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting images from storage:', error);
  }
};

export const deleteCar = async (id) => {
  try {
    const carDoc = doc(db, 'cars', id);
    const carSnapshot = await getDoc(carDoc);
    if (carSnapshot.exists()) {
      const carData = carSnapshot.data();
      await deleteImagesFromStorage(carData.carImages);
      await deleteDoc(carDoc);
      console.log('Car deleted successfully');
    } else {
      console.error('No such document!');
    }
  } catch (error) {
    console.error('Error deleting car:', error);
    throw new Error('Failed to delete car');
  }
};

export const updateCar = async (id, updatedData) => {
  const carDoc = doc(db, 'cars', id);
  await updateDoc(carDoc, updatedData);
};
