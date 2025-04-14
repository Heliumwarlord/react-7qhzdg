import React from "react";

const Modal = ({ src, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-full max-h-full">
        <img
          src={src}
          alt="Zoomed"
          className="max-w-full max-h-full rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;