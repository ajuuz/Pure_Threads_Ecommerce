import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

const CropperComponent = ({ image, onCropDone, onCancel,index ,isProductImage}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleCrop = () => {
    if (croppedArea) {
      onCropDone(croppedArea, zoom,image,index); // Pass the cropped area and zoom back to the parent component
    }
  };

  return (
    <div className="fixed  top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-md w-full max-w-lg">
        <h2 className="font-bold text-lg mb-4">Crop Image</h2>
        <div className="relative w-full h-64 bg-gray-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={isProductImage?3/4 : 8/3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex justify-between gap-4 mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full accent-black"
          />
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Crop
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropperComponent;
