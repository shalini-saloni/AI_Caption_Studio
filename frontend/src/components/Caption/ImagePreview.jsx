import React from 'react';
import { Sparkles } from 'lucide-react';

const ImagePreview = ({ imageUrl, onGenerate, disabled }) => {
  return (
    <div className="image-preview-container">
      <div className="image-preview">
        <img src={imageUrl} alt="Preview" />
      </div>
      <button 
        className="generate-btn" 
        onClick={onGenerate}
        disabled={disabled}
      >
        <Sparkles size={20} />
        Generate Caption
      </button>
    </div>
  );
};

export default ImagePreview;