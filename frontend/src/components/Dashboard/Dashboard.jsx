import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import UploadArea from '../Caption/UploadArea';
import ImagePreview from '../Caption/ImagePreview';
import CaptionResult from '../Caption/CaptionResult';
import LoadingSpinner from '../Caption/LoadingSpinner';
import { useCaption } from '../../contexts/CaptionContext';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { currentCaption, loading, generateCaption, fetchCaptions, clearCurrentCaption } = useCaption();

  useEffect(() => {
    fetchCaptions();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    await generateCaption(selectedFile);
  };

  const handleNewCaption = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    clearCurrentCaption();
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <Topbar onMenuClick={toggleSidebar} />
        
        <div className="content-area">
          <div className="upload-section">
            <div className="welcome-text">
              <h2>Generate Creative Captions</h2>
              <p>Upload your image and let AI create stunning captions instantly</p>
            </div>

            {!previewUrl && (
              <UploadArea onFileSelect={handleFileSelect} />
            )}

            {previewUrl && (
              <ImagePreview 
                imageUrl={previewUrl} 
                onGenerate={handleGenerate}
                disabled={loading || !!currentCaption}
              />
            )}

            {loading && <LoadingSpinner />}

            {currentCaption && (
              <CaptionResult 
                caption={currentCaption}
                onNewCaption={handleNewCaption}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;