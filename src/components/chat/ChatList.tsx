'use client';

import React, { useState } from 'react';
import { Search, MessageCircle, Users, Clock, ChevronRight, Plus } from 'lucide-react';

interface Chat {
  id: string;
  participant1: string;
  participant2: string;
  lastMessage: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
  avatar?: string;
}

interface ChatListProps {
  onChatClick: (chatId: string) => void;
  selectedChatId?: string | null;}

const ChatList: React.FC<ChatListProps> = ({ onChatClick, selectedChatId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced mock data for chats
  const chats: Chat[] = [
    { 
      id: '1', 
      participant1: 'Alice Johnson', 
      participant2: 'Bob Smith', 
      lastMessage: 'Hey Bob! Are we still on for the appointment tomorrow?', 
      timestamp: '2m ago',
      unreadCount: 3,
      isOnline: true,
     
    },
    { 
      id: '2', 
      participant1: 'Charlie Brown', 
      participant2: 'Dana White', 
      lastMessage: 'Let\'s meet tomorrow! I have some great ideas to share.', 
      timestamp: '1h ago',
      unreadCount: 0,
      isOnline: false,
    
    },
    { 
      id: '3', 
      participant1: 'Eva Martinez', 
      participant2: 'Frank Wilson', 
      lastMessage: 'What time works for you? I\'m flexible with my schedule.', 
      timestamp: '3h ago',
      unreadCount: 1,
      isOnline: true,
   
    },
  ];

  const filteredChats = chats.filter(chat =>
    chat.participant1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.participant2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            Messages
          </h2>
          <button className="p-2 bg-white hover:bg-gray-50 rounded-xl shadow-sm transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No conversations found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:shadow-md ${
                    selectedChatId === chat.id ? 'bg-blue-50 border-2 border-blue-200 shadow-md' : 'hover:scale-[1.02]'
                  }`}
                  onClick={() => onChatClick(chat.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                    
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {chat.participant1}
                        </h3>
                        <div className="flex items-center gap-2">
                          {chat.timestamp && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {chat.timestamp}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate pr-2 leading-relaxed">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount && chat.unreadCount > 0 && (
                          <span className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-sm">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {filteredChats.length} conversations
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            {chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0)} unread
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;