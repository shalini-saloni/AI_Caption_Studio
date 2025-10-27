import React from 'react';
import { Menu } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  return (
    <div className="topbar">
      <button className="menu-toggle" onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      <div className="topbar-title">AI Image Caption Generator</div>
    </div>
  );
};

export default Topbar;