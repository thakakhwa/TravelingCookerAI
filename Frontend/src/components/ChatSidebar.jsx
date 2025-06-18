import React, { useState, useEffect } from 'react';
import { chatApi } from '../services/chatApi';
import './ChatSidebar.css';

const ChatSidebar = ({ isCollapsed, onToggle, onNewChat }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatApi.getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const newSession = await onNewChat();
      // Refresh the sessions list
      fetchSessions();
    } catch (err) {
      console.error('Error creating new chat:', err);
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      await chatApi.deleteSession(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getSessionTitle = (session) => {
    if (session.title && session.title !== 'New Chat') {
      return session.title;
    }
    
    // If there are messages, use the first user message
    if (session.messages && session.messages.length > 0) {
      const firstUserMessage = session.messages.find(msg => msg.sender === 'user');
      if (firstUserMessage) {
        return firstUserMessage.content.length > 50 
          ? firstUserMessage.content.substring(0, 50) + '...'
          : firstUserMessage.content;
      }
    }
    
    return 'New Chat';
  };

  return (
    <div className={`chat-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">Chat History</h3>
      </div>

      <button className="new-chat-btn" onClick={handleNewChat}>
        <span>+</span>
        <span className="btn-text">New Chat</span>
      </button>

      <div className="chat-sessions">
        {loading ? (
          <div className="sidebar-loading">
            <div className="loading-spinner"></div>
            <span>Loading chats...</span>
          </div>
        ) : error ? (
          <div className="sidebar-error">
            {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="sidebar-empty">
            No chat history yet.<br />
            Start a new conversation!
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="session-item"
              onClick={() => {/* Handle session selection */}}
            >
              <div className="session-title">
                {getSessionTitle(session)}
              </div>
              <div className="session-meta">
                <span className="session-date">
                  {formatDate(session.createdAt)}
                </span>
                <span className="session-count">
                  {session.messages?.length || 0}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => handleDeleteSession(session.id, e)}
                title="Delete chat"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar; 