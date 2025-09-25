'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, ArrowLeft, Clock, Check, CheckCheck, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file';
}

interface ChatViewProps {
  chatId: string;
  onBack?: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ chatId, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced mock message data
  const messages: { [key: string]: Message[] } = {
    '1': [
      { 
        id: 'm1', 
        sender: 'Alice Johnson', 
        content: 'Hey Bob! Are we still on for the appointment tomorrow?', 
        timestamp: '2025-09-17 10:00',
        isCurrentUser: false
      },
      { 
        id: 'm2', 
        sender: 'You', 
        content: 'Hi Alice! Yes, absolutely. Looking forward to it!', 
        timestamp: '2025-09-17 10:05',
        isCurrentUser: true,
        status: 'read'
      },
      { 
        id: 'm3', 
        sender: 'Alice Johnson', 
        content: 'Perfect! Should I bring anything specific?', 
        timestamp: '2025-09-17 10:07',
        isCurrentUser: false
      },
      { 
        id: 'm4', 
        sender: 'You', 
        content: 'Just bring yourself and any questions you might have. I\'ll handle the rest!', 
        timestamp: '2025-09-17 10:10',
        isCurrentUser: true,
        status: 'delivered'
      },
    ],
    '2': [
      { 
        id: 'm1', 
        sender: 'Charlie Brown', 
        content: 'Let\'s meet tomorrow! I have some great ideas to share.', 
        timestamp: '2025-09-17 11:00',
        isCurrentUser: false
      },
      { 
        id: 'm2', 
        sender: 'You', 
        content: 'Sure, what time works best for you?', 
        timestamp: '2025-09-17 11:05',
        isCurrentUser: true,
        status: 'read'
      },
    ],
    '3': [
      { 
        id: 'm1', 
        sender: 'Eva Martinez', 
        content: 'What time works for you? I\'m flexible with my schedule.', 
        timestamp: '2025-09-17 12:00',
        isCurrentUser: false
      },
      { 
        id: 'm2', 
        sender: 'You', 
        content: 'How about 3 PM? That should work perfectly.', 
        timestamp: '2025-09-17 12:05',
        isCurrentUser: true,
        status: 'sent'
      },
    ],
  };

  const selectedMessages = messages[chatId] || [];
  const otherParticipant = selectedMessages.find(m => !m.isCurrentUser)?.sender || 'Unknown User';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const MessageStatus = ({ status }: { status?: 'sent' | 'delivered' | 'read' }) => {
    if (!status) return null;
    
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Messages</h3>
          <p className="text-gray-600 max-w-md">
            Select a conversation from the sidebar to start chatting with your clients and colleagues.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${otherParticipant}&background=6366f1&color=fff`}
                  alt={otherParticipant}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{otherParticipant}</h3>
                
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors group">
              <MoreVertical className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white p-4 space-y-4">
        {selectedMessages.map((message, index) => {
          const showTimestamp = index === 0 || 
            new Date(message.timestamp).getTime() - new Date(selectedMessages[index - 1].timestamp).getTime() > 300000; // 5 minutes

          return (
            <div key={message.id}>
              {showTimestamp && (
                <div className="flex justify-center mb-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  message.isCurrentUser
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.isCurrentUser && (
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <span className="text-xs text-blue-100 opacity-75">
                        {formatTime(message.timestamp)}
                      </span>
                      <MessageStatus status={message.status} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">{otherParticipant} is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors group">
            <Paperclip className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 bg-gray-50 hover:bg-white"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors group">
              <Smile className="w-5 h-5 text-gray-600 group-hover:text-yellow-500" />
            </button>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-xl transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;