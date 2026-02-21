// src/services/updateAllCars.js
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase.config';

/**
 * עדכון כל הרכבים בFirebase להוסיף primaryImageIndex
 */
export const updateAllCarsWithPrimaryIndex = async () => {
  try {
    console.log('🔄 מתחיל עדכון כל הרשומות...');

    // שלב 1: קבל את כל הרשומות
    const carCollection = collection(db, 'cars');
    const querySnapshot = await getDocs(carCollection);

    // שלב 2: יצור batch
    const batch = writeBatch(db);
    let updateCount = 0;

    // שלב 3: לולאה על כל רשומה
    querySnapshot.forEach((docSnapshot) => {
      const carRef = doc(db, 'cars', docSnapshot.id);
      const carData = docSnapshot.data();

      // עדכן רק אם אין כבר primaryImageIndex
      if (carData.primaryImageIndex === undefined || carData.primaryImageIndex === null) {
        batch.update(carRef, {
          primaryImageIndex: 0, // ✅ הגדר לתמונה הראשונה
        });
        updateCount++;
        console.log(`עדכון רכב: ${carData.make} ${carData.model}`);
      }
    });

    // שלב 4: בצע את ה-batch
    if (updateCount > 0) {
      await batch.commit();
      console.log(`✅ עדכנו ${updateCount} רשומות בהצלחה!`);
    } else {
      console.log('✅ כל הרשומות כבר בעדכון!');
    }

    return {
      success: true,
      updatedCount: updateCount,
      message: updateCount > 0 
        ? `✅ עדכנו ${updateCount} רכבים עם primaryImageIndex`
        : '✅ כל הרשומות כבר בעדכון!',
    };
  } catch (error) {
    console.error('❌ שגיאה בעדכון הרשומות:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};