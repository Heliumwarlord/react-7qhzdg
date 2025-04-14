import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiZoomIn, FiZoomOut, FiRotateCw } from "react-icons/fi";
import { FaInstagram, FaTwitter, FaImdb } from "react-icons/fa";

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            Nayanthara
          </span>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#gallery" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Gallery</a>
            <a href="#filmography" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Filmography</a>
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</a>
            <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 dark:text-gray-300"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="px-4 py-2 space-y-4">
            <a href="#gallery" className="block text-gray-600 dark:text-gray-300">Gallery</a>
            <a href="#filmography" className="block text-gray-600 dark:text-gray-300">Filmography</a>
            <a href="#about" className="block text-gray-600 dark:text-gray-300">About</a>
            <a href="#contact" className="block text-gray-600 dark:text-gray-300">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

// ZoomableModal Component
const ZoomableModal = ({ src, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  // Disable background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle zoom at cursor position
  const handleWheel = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;

    // Calculate new scale
    const newScale = e.deltaY < 0 ? scale * 1.1 : scale * 0.9;
    const clampedScale = Math.min(Math.max(1, newScale), 5);

    // Get the offset before and after zoom
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (clientX - rect.left - position.x) / scale;
    const offsetY = (clientY - rect.top - position.y) / scale;

    // Adjust position to keep zoom focus at cursor
    setPosition({
      x: clientX - rect.left - offsetX * clampedScale,
      y: clientY - rect.top - offsetY * clampedScale,
    });

    setScale(clampedScale);
  };

  // Handle drag start
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setLastPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Handle drag movement
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - lastPosition.x,
      y: e.clientY - lastPosition.y,
    });
  };

  // Stop dragging
  const handleMouseUp = () => setIsDragging(false);

  // Reset zoom and position
  const resetTransform = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-grab"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
        <div
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          <img
            src={src}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-gray-800 bg-opacity-50 p-2 rounded-lg">
          <button
            onClick={() => setScale(Math.max(1, scale - 0.2))}
            className="text-white p-2 hover:bg-gray-700 rounded"
          >
            <FiZoomOut size={20} />
          </button>
          <button
            onClick={resetTransform}
            className="text-white p-2 hover:bg-gray-700 rounded"
          >
            <FiRotateCw size={20} />
          </button>
          <button
            onClick={() => setScale(Math.min(5, scale + 0.2))}
            className="text-white p-2 hover:bg-gray-700 rounded"
          >
            <FiZoomIn size={20} />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-gray-700"
        >
          <FiX size={24} />
        </button>
      </div>
    </div>
  );
};

// Main Component
const Mugiwara = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch images from the Nayan folder
  useEffect(() => {
    const fetchImages = () => {
      // Define the specific pages to fetch images from
      const pages = ["page_45", "page_16", "page_18"]; // Add more pages as needed
      const imagesPerPage = 10; // Adjust based on the number of images per page

      const imageUrls = [];

      pages.forEach((page) => {
        for (let i = 1; i <= imagesPerPage; i++) {
          imageUrls.push(`/Nayan/${page}/nayanatara${i}.jpg`);
        }
      });

      setImages(imageUrls);
    };

    fetchImages();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <main className="pt-20 pb-12 px-4 md:px-8">
        {/* Header with Dark Mode Toggle */}
        <header className="flex justify-between items-center mb-12">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Nayanthara Portfolio
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Image Grid */}
        <section id="gallery" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {images.map((src, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={() => setSelectedImage(src)}
            >
              <img
                src={src}
                alt={`Nayanthara ${index + 1}`}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </section>

        {/* Social Links */}
        <footer className={`text-center py-8 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-500`}>
              <FaInstagram size={24} />
            </a>
            <a href="#" className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400`}>
              <FaTwitter size={24} />
            </a>
            <a href="#" className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-yellow-600`}>
              <FaImdb size={24} />
            </a>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            © 2024 Nayanthara Portfolio. All rights reserved.
          </p>
        </footer>
      </main>

      {selectedImage && <ZoomableModal src={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default Mugiwara;