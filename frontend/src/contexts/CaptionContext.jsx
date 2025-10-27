import React, { createContext, useState, useContext } from 'react';
import { captionService } from '../services/captionService';
import { toast } from 'react-toastify';

const CaptionContext = createContext();

export const useCaption = () => {
  const context = useContext(CaptionContext);
  if (!context) {
    throw new Error('useCaption must be used within CaptionProvider');
  }
  return context;
};

export const CaptionProvider = ({ children }) => {
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCaptions = async () => {
    try {
      const data = await captionService.getCaptions();
      setCaptions(data.captions);
    } catch (error) {
      toast.error('Failed to load captions');
    }
  };

  const generateCaption = async (imageFile) => {
    setLoading(true);
    try {
      const data = await captionService.generateCaption(imageFile);
      setCaptions([data.caption, ...captions]);
      setCurrentCaption(data.caption);
      toast.success('Caption generated successfully!');
      return { success: true, caption: data.caption };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to generate caption';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCaption = async (id) => {
    try {
      await captionService.deleteCaption(id);
      setCaptions(captions.filter(c => c.id !== id));
      if (currentCaption?.id === id) {
        setCurrentCaption(null);
      }
      toast.success('Caption deleted');
    } catch (error) {
      toast.error('Failed to delete caption');
    }
  };

  const selectCaption = (caption) => {
    setCurrentCaption(caption);
  };

  const clearCurrentCaption = () => {
    setCurrentCaption(null);
  };

  const value = {
    captions,
    currentCaption,
    loading,
    fetchCaptions,
    generateCaption,
    deleteCaption,
    selectCaption,
    clearCurrentCaption
  };

  return (
    <CaptionContext.Provider value={value}>
      {children}
    </CaptionContext.Provider>
  );
};