import React, { useState } from "react";
import axios from "axios";
import "./index.css";

import SendIcon from "./assets/Vector.png";

const ChatApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [supportedLanguages] = useState([
    "English",
    "Hindi",
    "Marathi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Gujarati",
    "Kannada",
    "Punjabi",
    "Malayalam",
    "Odia",
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);

  const suggestions = ["What is tele law?", "What is Department of Justice?"];

  const toggleChatbox = () => {
    setIsVisible(!isVisible);
  };

  const handleLanguageSelection = (language) => {
    if (supportedLanguages.includes(language)) {
      setSelectedLanguage(language);
      setIsLanguageSelected(true);
    } else {
      alert("Please select a valid language from the list.");
    }
  };

  const sendMessage = (text) => {
    const msg = text || message;
    if (!msg) return;

    const newMessage = { text: msg, isUser: true };
    setMessages([newMessage, ...messages]);
    setMessage("");
    setShowSuggestions(false);

    // Append language preference to the message
    const messageWithLanguage = `${msg} |>${selectedLanguage}`;

    axios
      .post("http://127.0.0.1:5000/predict", { message: messageWithLanguage })
      .then((response) => {
        const answer = response.data.answer;
        const links = response.data.links;

        const botMessage = { text: answer, isUser: false };
        const linkMessages = (links || []).map((link) => ({
          text: link,
          isLink: true,
          isUser: false,
        }));

        setMessages([botMessage, ...linkMessages, newMessage, ...messages]);
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        const errorMessage = {
          text: "An error occurred while processing your request.",
          isUser: false,
        };
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
       <div className="chatbox bg-gray-100 h-[450px] w-[350px] shadow-lg rounded-t-2xl backdrop-blur-xl transition-opacity duration-500 ease-in-out flex flex-col fixed bottom-20 right-8 z-40">
    <div className="bg-yellow-500 flex items-center justify-center p-4 rounded-t-2xl shadow-md">
            <h2 className="text-3xl font-bold">Chat Support</h2>
          </div>
          <div
  id="messagesContainer"
  className="flex-1 p-5 flex flex-col-reverse overflow-auto backdrop-blur-xl bg-white/60"
>

            {!isLanguageSelected ? (
              <div className="flex flex-col items-center justify-center p-4 flex-grow">
                <div className="flex flex-col items-center justify-center h-full">
                <h3 className="text-2xl font-semibold mb-4 text-center">Select Language:</h3>

                  <select
                  onChange={(e) => handleLanguageSelection(e.target.value)}
                  className="p-1 font-bold bg-yellow-500 border border-gray-300 rounded-md text-black text-center" // Added bg-yellow-500 for yellow background
                  defaultValue="English" // Default to English
                  >
            {supportedLanguages.map((lang, index) => (
            <option key={index} value={lang}>
            {lang}
          </option>
           ))}
          </select>

                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2.5 max-w-[70%] mt-2 rounded-lg ${
                      msg.isUser
                        ? "bg-gray-200 self-end text-right"
                        : "bg-purple-800 text-white"
                    } ${msg.isLink ? "underline cursor-pointer" : ""}`}
                  >
                    {msg.isLink ? (
                      <a
                        href={msg.text}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          color: "inherit",
                        }}
                      >
                        {msg.text}
                      </a>
                    ) : (
                      msg.text
                    )}
                  </div>
                ))}
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
              </>
            )}
          </div>
          <div className="p-5 flex items-center justify-between rounded-b-lg bg-gray-100 shadow-md">
  <input
    type="text"
    className="w-4/5 border border-gray-300 p-3 rounded-full placeholder-gray-400 bg-gray-200 text-gray-700 shadow-xl"
    placeholder="Ask your queries"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    disabled={!isLanguageSelected} // Disable input until language is selected
  />

  <button
    className="p-2 border border-none rounded-full cursor-pointer "
    onClick={() => sendMessage()}
    disabled={!isLanguageSelected} // Disable button until language is selected
  >
    <img
      src={SendIcon}
      alt="Send"
      className="w-8 h-7 shadow-xl" // Adjust size as needed
    />
  </button>
</div>

        </div>
      )}
      {/* Toggle Chatbox Button */}
      <button
  className="p-6  bg-yellow-500 mt-4 bg-gradient-to-r from-red-400 via-white-900 to-green-500 border-none rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer"
  onClick={toggleChatbox}
  style={{
    backgroundImage: `url('/src/assets/chatbot.png')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}
>
  <span className="text-lg font-semibold text-gray-800 relative z-10">
    
  </span>
</button>

</div>
  );
};

export default ChatApp;
