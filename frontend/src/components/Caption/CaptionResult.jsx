import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const CaptionResult = ({ caption, onNewCaption }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption.caption);
      setCopied(true);
      toast.success('Caption copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy caption');
    }
  };

  return (
    <div className="result">
      <div className="caption-box">
        <div className="caption-label">Your AI Generated Caption</div>
        <div className="caption-text">{caption.caption}</div>
      </div>
      <div className="action-buttons">
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy Caption'}
        </button>
        <button className="new-caption-btn" onClick={onNewCaption}>
          <RefreshCw size={18} />
          New Caption
        </button>
      </div>
    </div>
  );
};

export default CaptionResult;