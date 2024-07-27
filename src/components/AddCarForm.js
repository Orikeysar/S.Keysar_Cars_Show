// src/components/AddCarForm.js
import React, { useState } from "react";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Spinner from "./Spinner";

const AddCarForm = ({ onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    EngineCapacity: "",
    Gear: "",
    Ownershep: "",
    EngineKind: "",
    year: "",
    price: "",
    kilometer: "",
    description: "",
    hand: "",
    kind: "",
    images: [],
    isElectric: false,
    isHybrid: false,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      make,
      model,
      year,
      price,
      kilometer,
      description,
      hand,
      kind,
      images,
      isElectric,
      isHybrid,
      EngineCapacity,
      Gear,
      Ownershep,
      EngineKind,
    } = formData;

    if (
      !make ||
      !model ||
      !year ||
      !price ||
      !kilometer ||
      !description ||
      !hand ||
      !kind ||
      !EngineCapacity ||
      !Gear ||
      !Ownershep ||
      !EngineKind
    ) {
      setError("נא מלא את כל הפרמטרים");
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
        EngineCapacity:Number(formData.EngineCapacity) ,
        Gear,
        Ownershep,
        EngineKind,
        price: Number(formData.price),
        kilometer: Number(formData.kilometer),
        year: Number(formData.year),
        description,
        hand,
        kind,
        isElectric,
        isHybrid,
        carImages: uploadedImages,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "cars"), carData);
      setFormData({
        make: "",
        model: "",
        EngineCapacity: "",
        Gear: "",
        Ownershep: "",
        EngineKind: "",
        year: "",
        price: "",
        kilometer: "",
        description: "",
        hand: "",
        kind: "",
        images: [],
        isElectric: false,
        isHybrid: false,
      });
      setError("");
      setLoading(false);
      window.location.reload();
    } catch (e) {
      console.error("Error adding document: ", e);
      setLoading(false);
    }
  };
  //העלאת תמונה  לסטורג
  const handleImageUpload = (imageFile) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        `carimages/${uuidv4()}-${imageFile.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
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
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      encType="multipart/form-data"
    >
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-center ">שם יצרן</label>
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
            <option value="מיני">מיני</option>
            <option value="משפחתי">משפחתי</option>
            <option value="קרוסאובר">קרוסאובר</option>
            <option value="7 מקומות">7 מקומות</option>
          </select>
        </div>
        <div>
          <label className="block text-center">בעלות נוכחית</label>
          <select
            id="Ownershep"
            value={formData.Ownershep}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          >
            <option value="">בחר בעלות</option>
            <option value="פרטית">פרטית</option>
            <option value="ליסינג">ליסינג</option>
            <option value="השכרה">השכרה</option>
            <option value="חברה">חברה</option>
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
          <label className="block text-center">נפח מנוע</label>
          <input
            type="number"
            id="EngineCapacity"
            value={formData.EngineCapacity}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          />
        </div>
        <div>
          <label className="block text-center">סוג מנוע</label>
          <select
            id="EngineKind"
            value={formData.EngineKind}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          >
            <option value="">בחר סוג מנוע</option>
            <option value="בנזין">בנזין</option>
            <option value="דיזל">דיזל</option>
         
          </select>
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
          <label className="block text-center"> סוג גיר</label>
          <select
            id="Gear"
            value={formData.Gear}
            onChange={handleChange}
            className="p-2 border rounded w-full text-center"
          >
            <option value="">בחר סוג גיר</option>
            <option value="ידני">ידני</option>
            <option value="אוטומט">אוטומט</option>
            <option value="טיפטרוניק">טיפטרוניק</option>
            <option value="רובוטית/רציפה">רובוטית/רציפה</option>
          </select>
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
        <div >
        <div className="flex items-center justify-center m-2">
          <input
            type="checkbox"
            id="isElectric"
            checked={formData.isElectric}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="block">רכב חשמלי</label>
        </div>

        <div className="flex items-center justify-center m-2">
          <input
            type="checkbox"
            id="isHybrid"
            checked={formData.isHybrid}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="block">רכב היברידי</label>
        </div>
        </div>
      </div>
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Add Car
      </button>
    </form>
  );
};

export default AddCarForm;
