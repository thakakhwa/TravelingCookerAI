import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatApi } from '../services/chatApi';
import './ChatInterface.css';

const ChatInterface = ({ sessionId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      loadChatHistory();
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const session = await chatApi.getSession(sessionId);
      setMessages(session.messages || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const messageContent = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      // Add user message to UI immediately
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        sender: 'user',
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempUserMessage]);

      // Send message to backend and get AI response
      const response = await chatApi.addMessage(sessionId, messageContent, 'user');
      
      // Remove temp message and add actual messages
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== tempUserMessage.id);
        const newMessages = [];
        
        if (response.data.userMessage) {
          newMessages.push(response.data.userMessage);
        }
        
        if (response.data.aiMessage) {
          newMessages.push(response.data.aiMessage);
        }
        
        return [...filteredMessages, ...newMessages];
      });

      // If there's travel data, you can handle it here for future enhancements
      if (response.data.travelData) {
        console.log('Travel data received:', response.data.travelData);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove temp message and show error
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
      
      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: 'ai',
        createdAt: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const isError = message.isError;

    return (
      <div
        key={message.id}
        className={`message ${isUser ? 'user-message' : 'ai-message'} ${isError ? 'error-message' : ''}`}
      >
        <div className="message-content">
          <div className="message-avatar">
            {isUser ? (
              <div className="user-avatar">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            ) : (
              <div className="ai-avatar">
                🧳
              </div>
            )}
          </div>
          <div className="message-bubble">
            <div className="message-text">
              {message.content}
            </div>
            <div className="message-time">
              {formatMessageTime(message.createdAt)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const welcomeMessage = {
    id: 'welcome',
    content: `Hello ${user?.username || 'there'}! 👋 I'm your AI travel assistant. I can help you with:

🛫 Finding flights and comparing prices
🏨 Searching for hotels and accommodations  
🗺️ Discovering destinations and attractions
📋 Planning complete travel itineraries
💡 Getting travel tips and advice

What would you like to explore today?`,
    sender: 'ai',
    createdAt: new Date().toISOString()
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">🧳</span>
          <h3>Travel Assistant</h3>
        </div>
        {onClose && (
          <button className="close-chat-btn" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <div className="chat-messages">
        {isLoadingHistory ? (
          <div className="loading-messages">
            <div className="loading-spinner"></div>
            <span>Loading conversation...</span>
          </div>
        ) : (
          <>
            {/* Welcome message if no messages */}
            {messages.length === 0 && renderMessage(welcomeMessage)}
            
            {/* Chat messages */}
            {messages.map(renderMessage)}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="message ai-message loading-message">
                <div className="message-content">
                  <div className="message-avatar">
                    <div className="ai-avatar">🧳</div>
                  </div>
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about flights, hotels, destinations, or travel planning..."
            className="chat-input"
            rows="1"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!inputValue.trim() || isLoading}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 