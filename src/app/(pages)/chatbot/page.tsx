'use client';
import { useState, useEffect } from 'react';

const GantavyaChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial welcome message
    setMessages([
      {
        sender: 'bot',
        text: "Hello! I'm Gantavya AI, your dedicated travel companion! 🌍✈️\n\nI'm here to help you discover amazing destinations and plan unforgettable journeys. Whether you're dreaming of:\n\n🏖️ Relaxing beaches\n🏔️ Mountain adventures\n🏛️ Cultural experiences\n🌆 Urban explorations\n\nI've got the insights you need! What type of destination would you like to explore?"
      }
    ]);
  }, []);

  const sendMessage = async (message) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text: message }]);

    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.text }]);
    } catch (error) {
      console.error('Error in fetching response:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error while processing your request. Please try again!' 
      }]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
    }
  };

  return (
    <div className="flex flex-col md:max-w-[75vw] md:h-[85vh] mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Gantavya AI Travel Assistant</h2>

      <div className="flex-grow overflow-y-auto p-4 bg-gray-100 rounded-lg h-96 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded-lg  ${
              message.sender === 'user'
                ? 'bg-gray-300 text-black ml-auto  max-w-xs'
                : 'bg-gray-200 text-gray-900 mr-auto max-w-4xl '
            }`}
          >
            {message.text.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {line}
              </p>
            ))}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about destinations, attractions, or travel tips..."
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r-lg text-white transition-all ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default GantavyaChatbot;