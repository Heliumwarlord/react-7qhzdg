import React, { useEffect, useState } from "react";
import { fetchImages } from "../utils/fetchImages";
import DarkModeToggle from "./DarkModeToggle";
import Modal from "./Modal";

const Mugiwara = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getImages = async () => {
      const imageUrls = await fetchImages();
      setImages(imageUrls);
    };

    getImages();
  }, []);

  const handleImageClick = (src) => {
    setSelectedImage(src);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          Nayanthara Gallery
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          A collection of stunning images
        </p>
        <div className="mt-4">
          <DarkModeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handleImageClick(src)}
          >
            <img
              src={src}
              alt={`Nayanthara ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {selectedImage && <Modal src={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

export default Mugiwara;