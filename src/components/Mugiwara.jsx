import React, { useState, useEffect } from 'react';
import './styles.css';

// Mock data for the actress profile
const actressProfile = {
  name: 'Nayanthara',
  bio: 'Nayanthara is an Indian actress and model who predominantly works in Tamil and Telugu films. She is one of the highest-paid actresses in South India.',
};

// Main Mugw Component
const Mugiwara = () => {
  const [images, setImages] = useState([]);

  // Fetch images from the provided URL
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Simulate fetching image URLs (replace with actual fetch logic)
        const imageUrls = [
          'https://www.idlebrain.com/movie/photogallery/nayanatara45/images/nayanatara11.jpg',
          'https://www.idlebrain.com/movie/photogallery/nayanatara45/images/nayanatara2.jpg',
          'https://www.idlebrain.com/movie/photogallery/nayanatara45/images/nayanatara3.jpg',
          // Add more image URLs as needed
        ];

        const imageData = imageUrls.map((url, index) => ({
          url,
          alt: `Nayanthara Image ${index + 1}`,
        }));

        setImages(imageData);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold custom-header">
          Hello, TailwindCSS!
        </h1>
      </div>
      {/* Header */}
      <Header name={actressProfile.name} bio={actressProfile.bio} />

      {/* Gallery */}
      <Gallery images={images} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Header Component
const Header = ({ name, bio }) => {
  return (
    <header className="bg-white shadow-md p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
      <p className="mt-2 text-gray-600">{bio}</p>
    </header>
  );
};

// Gallery Component
const Gallery = ({ images }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            tabIndex={0}
            aria-label={`Image ${index + 1} of Nayanthara`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8">
      <p>&copy; 2023 Nayanthara Portfolio. All rights reserved.</p>
    </footer>
  );
};

export default Mugiwara;
