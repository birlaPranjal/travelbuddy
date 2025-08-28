import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TextRevealComponent = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const width1 = useTransform(scrollYProgress, [0.15, 0.35], ["0%", "100%"]);
  const width2 = useTransform(scrollYProgress, [0.35, 0.45], ["0%", "100%"]);
  const width3 = useTransform(scrollYProgress, [0.45, 0.60], ["0%", "100%"]);
  const width4 = useTransform(scrollYProgress, [0.60, 0.70], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="lg:h-screen flex flex-col items-center justify-center bg-black">
      {/* Line 1 */}
      <div className="relative text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-white animate-roll-in pb-2 md:mb-4">
      <span className="text-gray-500/50 whitespace-nowrap">Discover the world</span>
      <motion.span 
        className="absolute top-0 left-0 text-secondary whitespace-nowrap overflow-hidden pb-2 md:pb-5"
        style={{ width: width1 }}
      >
        Discover the world
      </motion.span>
      </div>

      {/* Line 2 */}
      <div className="relative text-3xl sm:text-7xl md:text-8xl font-extrabold text-white animate-roll-in pb-2 md:mb-4">
      <span className="text-gray-500/50 whitespace-nowrap">one adventure at a time,</span>
      <motion.span 
        className="absolute top-0 left-0 text-secondary whitespace-nowrap overflow-hidden pb-2 md:pb-5"
        style={{ width: width2 }}
      >
        one adventure at a time,
      </motion.span>
      </div>

      {/* Line 3 */}
      <div className="relative text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-white animate-roll-in pb-2 md:mb-4">
      <span className="text-gray-500/50 whitespace-nowrap">explore new cultures</span>
      <motion.span 
        className="absolute top-0 left-0 text-secondary whitespace-nowrap overflow-hidden pb-2 md:pb-5"
        style={{ width: width3 }}
      >
        explore new cultures
      </motion.span>
      </div>

      {/* Line 4 */}
      <div className="relative text-3xl sm:text-7xl md:text-8xl font-extrabold text-white animate-roll-in">
      <span className="text-gray-500/50 whitespace-nowrap">& create memories</span>
      <motion.span 
        className="absolute top-0 left-0 text-secondary whitespace-nowrap overflow-hidden pb-2 md:pb-5"
        style={{ width: width4 }}
      >
        & create memories
      </motion.span>
      </div>
    </div>
  );
};

export default TextRevealComponent;
