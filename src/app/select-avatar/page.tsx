
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Loader2, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const avatarOptions = PlaceHolderImages.filter(p => p.id.startsWith('avatar-'));

const learningTips = [
  "Speak confidently!",
  "Practice makes perfect.",
  "Unlock your potential.",
  "Learn and grow.",
  "Your journey starts now.",
  "Embrace the challenge.",
];

export default function SelectAvatarPage() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<ImagePlaceholder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAvatar = (avatar: ImagePlaceholder) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      setIsLoading(true);
      localStorage.setItem('aexy_user_avatar', selectedAvatar.imageUrl);
      // Add a small delay for a smoother transition feel
      setTimeout(() => router.push('/'), 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary/30 p-4 antialiased">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-foreground tracking-tight">Choose Your Avatar</h1>
        <p className="text-muted-foreground mt-2">Select a character to represent you in your conversations.</p>
      </div>

      <div className="w-full max-w-4xl">
        <TooltipProvider>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {avatarOptions.map((avatar, index) => (
              <Tooltip key={avatar.id} delayDuration={100}>
                <TooltipTrigger asChild>
                  <div
                    className="group relative aspect-square cursor-pointer transition-all duration-300"
                    onClick={() => handleSelectAvatar(avatar)}
                  >
                    <Image
                      src={avatar.imageUrl}
                      alt={avatar.description}
                      fill
                      className={cn(
                        'object-cover rounded-full border-4 transition-all duration-300',
                        selectedAvatar?.id === avatar.id 
                          ? 'border-primary shadow-2xl shadow-primary/40' 
                          : 'border-transparent group-hover:scale-105 group-hover:border-primary/50',
                        selectedAvatar && selectedAvatar.id !== avatar.id && 'opacity-50 saturate-[0.8]'
                      )}
                      data-ai-hint={avatar.imageHint}
                    />
                    {selectedAvatar?.id === avatar.id && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-in zoom-in-50">
                          <Check className="h-6 w-6 text-primary-foreground" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{learningTips[index % learningTips.length]}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
      
      <div className="mt-12 text-center min-h-[140px] w-full max-w-2xl flex flex-col justify-center items-center">
        {selectedAvatar && (
            <div className="animate-in fade-in-0 duration-500">
                <h2 className="text-3xl font-bold font-headline text-foreground">{selectedAvatar.description}</h2>
                <p className="text-muted-foreground italic mt-2 text-lg">"{selectedAvatar.personality}"</p>
            </div>
        )}
      </div>

      <div className="w-full max-w-sm mt-4">
        <Button
          onClick={handleConfirm}
          disabled={!selectedAvatar || isLoading}
          className="w-full text-lg font-semibold py-7 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 disabled:shadow-none"
          size="lg"
        >
          {isLoading 
            ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> 
            : null
          }
          {isLoading ? 'Entering...' : 'Confirm and Start'}
        </Button>
      </div>

    </div>
  );
}
