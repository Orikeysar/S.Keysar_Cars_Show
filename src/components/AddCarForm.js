// src/components/AddCarForm.js
import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import Spinner from "./Spinner";

const AddCarForm = ({ onAdd, selectedCar }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);
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
    carImages: [],
    fullprice: "",
    isElectric: false,
    isHybrid: false,
    primaryImageIndex: 0,
  });
  const [imagePreview, setImagePreview] = useState([]); // תצוגה מקדימה של התמונות
  const [pendingImagePreview, setPendingImagePreview] = useState(null); // תמונה יחידה המחכה לאישור
  const [pendingImageFile, setPendingImageFile] = useState(null); // הקובץ שמחכה לאישור
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedCar) {
      setFormData({
        ...selectedCar,
        images: [],
        carImages: selectedCar.carImages || [],
        primaryImageIndex: selectedCar.primaryImageIndex || 0,
      });
      setImagePreview([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedCar]);

  // פונקציה לעדכון אינדקס התמונה הראשית
  const handleSetPrimaryImage = (index) => {
    setFormData({
      ...formData,
      primaryImageIndex: index,
    });
  };

  // פונקציה לטיפול בבחירת תמונות
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // הצג את התמונה הראשונה לאישור
    const file = files[0];
    setPendingImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    // אם יש עוד תמונות, הוסף אותן לרשימה
    if (files.length > 1) {
      const additionalFiles = files.slice(1);
      setFormData({
        ...formData,
        images: [...formData.images, ...additionalFiles],
      });

      additionalFiles.forEach((file) => {
        const additionalReader = new FileReader();
        additionalReader.onload = (event) => {
          setImagePreview((prev) => [...prev, event.target.result]);
        };
        additionalReader.readAsDataURL(file);
      });
    }
  };

  // אישור התמונה
  const handleConfirmImage = () => {
    if (pendingImageFile) {
      setFormData({
        ...formData,
        images: [...formData.images, pendingImageFile],
      });

      setImagePreview((prev) => [...prev, pendingImagePreview]);
    }
    
    setPendingImagePreview(null);
    setPendingImageFile(null);
    
    // אפס את ה-input כדי שיוכל לבחור שוב
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // דחיית התמונה
  const handleRejectImage = () => {
    setPendingImagePreview(null);
    setPendingImageFile(null);
    
    // אפס את ה-input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const adjustPrimaryIndexAfterRemoval = (removedIndex) => {
    if (formData.primaryImageIndex === removedIndex) {
      return Math.max(0, removedIndex - 1);
    }

    if (formData.primaryImageIndex > removedIndex) {
      return formData.primaryImageIndex - 1;
    }

    return formData.primaryImageIndex;
  };

  // הסרת תמונה
  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      const newCarImages = formData.carImages.filter((_, i) => i !== index);
      const updatedPrimaryIndex = adjustPrimaryIndexAfterRemoval(index);

      setFormData({
        ...formData,
        carImages: newCarImages,
        primaryImageIndex: updatedPrimaryIndex,
      });
      return;
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreview = imagePreview.filter((_, i) => i !== index);
    const existingCount = formData.carImages.length;
    const removedCombinedIndex = existingCount + index;
    const updatedPrimaryIndex = adjustPrimaryIndexAfterRemoval(removedCombinedIndex);

    setFormData({
      ...formData,
      images: newImages,
      primaryImageIndex: updatedPrimaryIndex,
    });
    setImagePreview(newPreview);
  };

  // טעינת תמונה ל-Firebase
  const handleImageUpload = (image) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        `carimages/${Date.now()}-${image.name || "image"}`
      );
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

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
      primaryImageIndex,
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

    // אם זה עריכה של רכב קיים
    if (selectedCar) {
      let updatedCarImages = formData.carImages || [];

      if (images.length > 0) {
        const uploadedNewImages = await Promise.all(
          images.map((image) => handleImageUpload(image))
        );
        updatedCarImages = [...updatedCarImages, ...uploadedNewImages];
      }

      const carData = {
        make,
        model,
        EngineCapacity: Number(formData.EngineCapacity),
        Gear,
        Ownershep,
        EngineKind,
        price: Number(formData.price),
        kilometer: Number(formData.kilometer),
        fullprice: Number(formData.fullprice),
        year: Number(formData.year),
        description,
        hand,
        kind,
        isElectric,
        isHybrid,
        carImages: updatedCarImages,
        primaryImageIndex: primaryImageIndex,
        timestamp: serverTimestamp(),
      };

      await updateDoc(doc(db, "cars", selectedCar.id), carData);

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
        carImages: [],
        isElectric: false,
        isHybrid: false,
        fullprice: "",
        primaryImageIndex: 0,
      });
      setImagePreview([]);
      setError("");
      setLoading(false);
      window.location.reload();
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        images.map((image) => handleImageUpload(image))
      );

      const carData = {
        make,
        model,
        EngineCapacity: Number(formData.EngineCapacity),
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
        primaryImageIndex: primaryImageIndex, // ← שמירת אינדקס התמונה הראשית
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
        fullprice: "",
        primaryImageIndex: 0,
      });
      setImagePreview([]);
      setError("");
      setLoading(false);
      if (onAdd) onAdd();
    } catch (error) {
      console.error("Error adding car:", error);
      setError("שגיאה בהוסיף הרכב: " + error.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const existingImageCount = formData.carImages.length;

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">הוסף רכב חדש</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* שדות טקסט בסיסיים */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="make"
            placeholder="מותג"
            value={formData.make}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="text"
            name="model"
            placeholder="דגם"
            value={formData.model}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="number"
            name="year"
            placeholder="שנה"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="מחיר"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="number"
            name="kilometer"
            placeholder="קילומטרים"
            value={formData.kilometer}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="text"
            name="EngineCapacity"
            placeholder="נפח מנוע"
            value={formData.EngineCapacity}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="text"
            name="Gear"
            placeholder="תיבת הילוכים"
            value={formData.Gear}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="text"
            name="EngineKind"
            placeholder="סוג מנוע"
            value={formData.EngineKind}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="text"
            name="hand"
            placeholder="יד"
            value={formData.hand}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="text"
            name="Ownershep"
            placeholder="בעלות"
            value={formData.Ownershep}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="text"
            name="kind"
            placeholder="סוג רכב"
            value={formData.kind}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
            required
          />
          <input
            type="number"
            name="fullprice"
            placeholder="מחיר מלא"
            value={formData.fullprice}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-right"
          />
        </div>

        <textarea
          name="description"
          placeholder="תיאור הרכב"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-right"
          rows="4"
          required
        ></textarea>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isElectric"
              checked={formData.isElectric}
              onChange={handleInputChange}
            />
            <span>רכב חשמלי</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isHybrid"
              checked={formData.isHybrid}
              onChange={handleInputChange}
            />
            <span>רכב היברידי</span>
          </label>
        </div>

        {/* ========== קטע העלאת תמונות וסימון התמונה הראשית ========== */}
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <h2 className="text-xl font-bold mb-4 text-right">📷 העלאת תמונות</h2>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full p-2 border rounded mb-4"
          />

          {/* דיאלוג תצוגה מקדימה של תמונה */}
          {pendingImagePreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-right">🖼️ אישור תמונה</h2>
                
                <img
                  src={pendingImagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />

                <p className="text-gray-700 mb-6 text-right font-medium">
                  האם אתה רוצה להוסיף תמונה זו?
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleRejectImage}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    ❌ שנה
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmImage}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    ✅ אשר
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* תצוגה של התמונות שנבחרו */}
          {imagePreview.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold mb-2 text-right">
                תמונות חדשות שנבחרו ({imagePreview.length}):
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {imagePreview.map((preview, index) => {
                  const combinedIndex = existingImageCount + index;
                  return (
                    <div
                      key={index}
                      className={`relative border-2 p-2 rounded cursor-pointer transition ${
                        formData.primaryImageIndex === combinedIndex
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleSetPrimaryImage(combinedIndex)}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      {formData.primaryImageIndex === combinedIndex && (
                        <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute bottom-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-2 text-right">
                💡 לחץ על תמונה כדי לבחור אותה כתמונה ראשית (עם סימן ✓)
              </p>
            </div>
          )}

          {/* תצוגה של תמונות קיימות (בעריכה) */}
          {formData.carImages && formData.carImages.length > 0 && (
            <div>
              <h3 className="font-bold mb-2 text-right">
                תמונות קיימות ({formData.carImages.length}):
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {formData.carImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative border-2 p-2 rounded cursor-pointer transition ${
                      formData.primaryImageIndex === index
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSetPrimaryImage(index)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Existing ${index}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    {formData.primaryImageIndex === index && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index, true);
                      }}
                      className="absolute bottom-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-700"
        >
          {selectedCar ? "עדכן רכב" : "הוסף רכב"}
        </button>
      </form>
    </div>
  );
};

export default AddCarForm;