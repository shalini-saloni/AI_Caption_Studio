import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCaption } from '../../contexts/CaptionContext';
import { Plus, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { captions, selectCaption, clearCurrentCaption } = useCaption();

  const handleNewChat = () => {
    clearCurrentCaption();
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleCaptionClick = (caption) => {
    selectCaption(caption);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">🎨 Caption Studio</div>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <Plus size={20} />
            New Caption
          </button>
        </div>

        <div className="chat-history">
          <div className="history-title">Recent Captions</div>
          <div className="chat-history-list">
            {captions.length === 0 ? (
              <div className="empty-state">
                <p>No captions yet</p>
                <p className="empty-hint">Upload an image to get started</p>
              </div>
            ) : (
              captions.map((caption) => (
                <div
                  key={caption.id}
                  className="chat-item"
                  onClick={() => handleCaptionClick(caption)}
                >
                  <div className="chat-item-title">
                    {caption.caption.substring(0, 50)}
                    {caption.caption.length > 50 ? '...' : ''}
                  </div>
                  <div className="chat-item-time">
                    {formatTime(caption.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <button className="logout-btn" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;