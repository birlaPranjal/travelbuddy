'use client';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: "🎯",
    title: "Smart Recommendations",
    description: "Get personalized travel suggestions based on your preferences and interests"
  },
  {
    icon: "📅",
    title: "Trip Planning",
    description: "Detailed itineraries and scheduling assistance for your perfect journey"
  },
  {
    icon: "🏨",
    title: "Accommodation Tips",
    description: "Find the best places to stay within your budget and preferred location"
  },
  {
    icon: "🍜",
    title: "Local Cuisine Guide",
    description: "Discover must-try dishes and top-rated restaurants in each destination"
  }
];

const testimonials = [
  {
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    name: "Sarah Thompson",
    location: "United States",
    text: "Gantavya AI made planning my India trip so much easier! It suggested amazing hidden gems I wouldn't have found otherwise."
  },
  {
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    name: "Mark Chen",
    location: "Singapore",
    text: "The cultural insights provided by Gantavya were invaluable. It helped me navigate local customs with confidence."
  },
  {
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    name: "Emma Wilson",
    location: "Australia",
    text: "Best travel companion ever! The restaurant recommendations were spot-on, and the local tips saved me time and money."
  }
];

const GantavyaChatbot = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: "Namaste! 🙏 I'm Gantavya AI, your dedicated travel companion for exploring India! 🌍✈️\n\nI'm here to help you discover amazing destinations and plan unforgettable journeys. I can assist you with:\n\n🏖️ Pristine beaches of Goa\n🏔️ Majestic Himalayas\n🏛️ Ancient temples and palaces\n🌆 Vibrant city experiences\n🍛 Culinary adventures\n\nWhat would you like to explore today?"
      }
    ]);
  }, []);

  interface Message {
    sender: string;
    text: string;
  }

  interface ApiResponse {
    text: string;
  }

  const sendMessage = async (message: string): Promise<void> => {
    setIsLoading(true);
    setMessages((prev: Message[]) => [...prev, { sender: 'user', text: message }]);

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

      const data: ApiResponse = await response.json();
      setMessages((prev: Message[]) => [...prev, { sender: 'bot', text: data.text }]);
    } catch (error) {
      console.error('Error in fetching response:', error);
      setMessages((prev: Message[]) => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error while processing your request. Please try again!' 
      }]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-8 -mt-5">
      <div className="container mx-auto px-4">
        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="p-6 bg-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Gantavya AI</h2>
                <p className="text-gray-300">Your Personal India Travel Guide</p>
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 bg-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-4 ${
                  message.sender === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-blue-600 ml-auto'
                      : 'bg-gray-700'
                  }`}
                >
                  {message.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 p-4 bg-gray-700 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-gray-700">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about destinations, attractions, or travel tips..."
                className="flex-grow p-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-6 py-4 rounded-lg text-white font-semibold transition-all ${
                  isLoading 
                    ? 'bg-blue-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Thinking...' : 'Ask Gantavya'}
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Gantavya AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Travelers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Indian Adventure?</h2>
            <p className="text-xl text-gray-300 mb-8">Let Gantavya AI help you create unforgettable memories!</p>
            <button className="bg-white text-blue-900 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all duration-300">
              Start Planning Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GantavyaChatbot;