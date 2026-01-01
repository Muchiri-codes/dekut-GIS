"use client"
import { motion } from 'framer-motion'
import Image from 'next/image';
import { useState, useEffect } from 'react'

export default function Header() {
  const phrases = ["OF TECHNOLOGY...", "TEMBEA DEKUT...", "BE SURE OF YOUR ROUTE"];
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing logic
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        setTypingSpeed(80); 

        if (displayText === currentPhrase) {
          setTypingSpeed(2000); 
          setIsDeleting(true);
        }
      } else {
        // Deleting logic
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        setTypingSpeed(50); // Deleting faster

        if (displayText === "") {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setTypingSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, phrases]);

  return (
    <div className="bg-green-700 h-24 flex items-center p-4 gap-4 relative z-50 shadow-lg border-b-2 justify-between">
      
 
      <div className="w-16 h-16 shrink-0">
        <motion.svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M100 10 C60 10 30 42 30 82 C30 130 100 190 100 190 C100 190 170 130 170 82 C170 42 140 10 100 10 Z"
            fill="#0f172a"
            stroke="white"
            strokeWidth="3"
          />
          <motion.path
            d="M70 110 L95 85 L115 95 L130 70"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <circle cx="70" cy="110" r="6" fill="#22c55e" />
          <circle cx="130" cy="70" r="9" fill="#ef4444" />
        </motion.svg>
      </div>

      
      <div className="flex flex-col">
        <h2 className="text-yellow-500 font-bold text-lg md:text-4xl leading-tight tracking-tight">
          DEDAN KIMATHI UNIVERSITY
        </h2>

        <div className="h-8 flex items-center">
          <p className="text-sm md:text-lg  text-yellow-400 font-mono font-bold">
            {displayText}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-0.75 h-5 bg-yellow-400 ml-1 align-middle"
            />
          </p>
        </div>
      </div>

      <div>
        <Image 
         src='/dekut_logo.png'
         width={100}
         height={40}
         alt='logo'
        />
      </div>
    </div>
  );
}