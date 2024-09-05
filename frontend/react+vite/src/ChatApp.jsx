import React, { useState } from 'react';
import axios from 'axios';

import './index.css';

const ChatApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = [
    'What is tele law?',
    'What is Department of Justice?'
  ];

  const toggleChatbox = () => {
    setIsVisible(!isVisible);
  };

  const sendMessage = (text) => {
    const msg = text || message;
    if (!msg) return;

    const newMessage = { text: msg, isUser: true };
    setMessages([newMessage, ...messages]);
    setMessage('');
    setShowSuggestions(false); // Hide suggestions after a message is sent

    axios.post('http://127.0.0.1:5000/predict', { message: msg })
      .then(response => {
        const answer = response.data.answer;
        const links = response.data.links;

        const botMessage = { text: answer, isUser: false };
        const linkMessages = (links || []).map(link => ({ text: link, isLink: true, isUser: false }));

        setMessages([botMessage, ...linkMessages, newMessage, ...messages]);
      })
      .catch(error => {
        console.error('Error occurred:', error);
        const errorMessage = { text: 'An error occurred while processing your request.', isUser: false };
        setMessages([errorMessage, ...messages]);
      });
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="max-w-lg fixed bottom-8 right-8 z-50">
      {/* Chatbox */}
      {isVisible && (
        <div className="chatbox bg-gray-100 h-[450px] w-[350px] shadow-lg rounded-t-2xl transition-opacity duration-500 ease-in-out flex flex-col">
          <div className="bg-gradient-to-r from-yellow-800 to-yellow-500 flex items-center justify-center p-4 rounded-t-2xl shadow-md">
            <h2 className="text-white">Chat Support</h2>
          </div>
          <div id="messagesContainer" className="flex-1 p-5 flex flex-col-reverse overflow-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2.5 max-w-[70%] mt-2 rounded-lg ${
                  msg.isUser ? 'bg-gray-200' : 'bg-purple-800 text-white'
                } ${msg.isLink ? 'underline cursor-pointer' : ''}`}
              >
                {msg.isLink ? <a href={msg.text} target="_blank" rel="noopener noreferrer" 
                style={{
                  display: 'block',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  color: 'inherit'

                }}
                >{msg.text}</a> : msg.text
                }
              </div>
            ))}
            {/* Suggestions as part of message area */}
            {showSuggestions && (
              <div className="flex flex-col items-center justify-center gap-2 mt-4">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 w-3/4 text-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="bg-gradient-to-r from-yellow-800 to-yellow-500 p-5 flex items-center justify-between rounded-b-lg shadow-md">
            <input
              type="text"
              className="w-4/5 border-none p-2.5 rounded-full"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="p-1.5 bg-transparent border-none cursor-pointer" onClick={() => sendMessage()}>
              Send
            </button>
          </div>
        </div>
      )}
      {/* Toggle Chatbox Button */}
      <button
        className="p-6 bg-gradient-to-r from-red-400 via-white-900 to-green-500 border-none rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer"
        onClick={toggleChatbox}
      >
        <span className="text-lg font-semibold text-gray-800">Chat with us</span>
      </button>
    </div>
  );
};

export default ChatApp;
