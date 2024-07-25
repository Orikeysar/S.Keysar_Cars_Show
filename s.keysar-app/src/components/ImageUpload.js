// ImageUpload.js
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const ImageUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `carimages/${Date.now()}-${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on('state_changed',
      (snapshot) => {
        // אפשר להוסיף פה טעינת בר התקדמות
      },
      (error) => {
        console.error('Error uploading image:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          onUpload(downloadURL);
        });
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && (
        <div>
          <p>Image uploaded successfully:</p>
          <img src={imageUrl} alt="Uploaded" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
