import React, { useEffect, useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

export default function FaqSection() {
  const [isClient, setIsClient] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);  // Start with no question open

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const faqs = [
    {
      question: "What is TravelBuddy?",
      answer: "TravelBuddy is a comprehensive travel planning platform that helps you organize your trips, find the best deals on flights and accommodations, and discover exciting activities and destinations."
    },
    {
      question: "How does TravelBuddy work?",
      answer: "TravelBuddy allows you to create personalized travel itineraries, book flights and hotels, and explore local attractions. You can also connect with other travelers and share your experiences."
    },
    {
      question: "Is TravelBuddy free to use?",
      answer: "Yes, TravelBuddy offers a free version with essential features. We also offer premium plans with additional benefits and exclusive deals."
    },
    {
      question: "Can I book flights and hotels through TravelBuddy?",
      answer: "Absolutely! TravelBuddy partners with various airlines and hotels to provide you with the best options and prices for your travel needs."
    },
    {
      question: "How can I find travel inspiration on TravelBuddy?",
      answer: "TravelBuddy features a blog, user reviews, and curated travel guides to help you find inspiration for your next adventure. You can also follow other travelers and see their recommendations."
    },
    {
      question: "Does TravelBuddy offer customer support?",
      answer: "Yes, TravelBuddy has a dedicated customer support team available 24/7 to assist you with any questions or issues you may have."
    },
    {
      question: "Can I share my travel plans with friends and family?",
      answer: "Yes, TravelBuddy allows you to share your itineraries and travel plans with friends and family, so they can stay updated on your journey."
    },
    {
      question: "What are the benefits of using TravelBuddy?",
      answer: "By using TravelBuddy, you can save time and money on travel planning, discover new destinations, and connect with a community of like-minded travelers."
    },
    {
      question: "Is TravelBuddy available on mobile devices?",
      answer: "Yes, TravelBuddy has a mobile app available for both iOS and Android devices, so you can plan and manage your trips on the go."
    },
    {
      question: "How do I get started with TravelBuddy?",
      answer: "Getting started with TravelBuddy is easy! Simply sign up for a free account on our website or download our mobile app, and start planning your next adventure."
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <section className="w-full bg-primary text-white py-10 px-4" id="faq-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold  text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-primary border-secondary border rounded-lg shadow-lg overflow-hidden">
              <h3 
                className="flex justify-between items-center text-xl font-bold  cursor-pointer p-4 transition-colors duration-200 hover:bg-secondary"
                onClick={() => toggleQuestion(index)}
              >
                {faq.question}
                <span className="">
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </h3>
              <div 
                className={`p-4  ${openIndex === index ? 'block' : 'hidden'}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
