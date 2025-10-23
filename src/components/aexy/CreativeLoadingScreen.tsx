
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const loadingTips = [
  "The word 'set' has the most definitions in English.",
  "A 'pangram' is a sentence that contains every letter of the alphabet.",
  "'I am' is the shortest complete sentence in the English language.",
  "The most common adjective used in English is 'good'.",
  "Shakespeare added over a thousand new words to the English language.",
  "A new word is added to the dictionary every two hours.",
  "The oldest English word that is still in use is 'town'.",
  "English is the official language of the sky - all pilots have to speak it!",
];

const getRandomTip = () => loadingTips[Math.floor(Math.random() * loadingTips.length)];

export function CreativeLoadingScreen() {
  const [tip, setTip] = useState('');
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Generate the first tip on the client after mounting to avoid hydration errors
    setTip(getRandomTip());

    const getNewTip = () => {
      setKey(prevKey => prevKey + 1);
      setTip(getRandomTip());
    }
    const interval = setInterval(getNewTip, 8000); // Increased from 5000ms to 8000ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-8">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-8" />
      <div className="flex items-center gap-3 text-lg font-semibold text-center mb-2">
        <Lightbulb className={cn("h-5 w-5 flex-shrink-0", "dark:animate-bulb-glow")} />
        <h2 className="font-headline">Did you know?</h2>
      </div>
      <div className="relative w-full max-w-md min-h-16 flex items-center justify-center">
        {tip && (
            <p key={key} className="text-foreground text-center animate-in fade-in duration-[3000ms]">
                {tip}
            </p>
        )}
      </div>
    </div>
  );
}
