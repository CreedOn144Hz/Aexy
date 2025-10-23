
"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startAIConversation } from '@/ai/flows/start-ai-conversation';
import { generateAIResponse } from '@/ai/flows/generate-ai-responses';
import type { Message, Scenario, User } from '@/lib/types';
import { getScenario, getUserProfile } from '@/lib/data';
import { ConversationHeader } from '@/components/aexy/ConversationHeader';
import { MessageBubble } from '@/components/aexy/MessageBubble';
import { ChatInput } from '@/components/aexy/ChatInput';
import { Loader2 } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { EndSummary } from '@/components/aexy/EndSummary';
import { CreativeLoadingScreen } from '@/components/aexy/CreativeLoadingScreen';
import { useUser } from '@/firebase';

export default function ConversationPage() {
  const params = useParams();
  const id = params.id as string;
  const { user: firebaseUser, isUserLoading } = useUser();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [character, setCharacter] = useState<ImagePlaceholder | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const conversationHistory = useRef<string>("");
  const scrollAreaViewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, isUserLoading, router]);
  
  useEffect(() => {
    const initializeConversation = async () => {
      if (!id || !firebaseUser) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const storedEmail = localStorage.getItem('aexy_user_email');
        const [[userProfile, fetchedScenario]] = await Promise.all([
            Promise.all([
                getUserProfile(storedEmail),
                getScenario(id)
            ]),
            new Promise(res => setTimeout(res, 2000)) // Artificial delay for loading screen
        ]);
        
        if (!userProfile) {
          setError("User profile not found. Please log in again.");
          setIsLoading(false);
          return;
        }

        if (!fetchedScenario) {
          setError("Scenario not found.");
          setIsLoading(false);
          return;
        }
        
        const scenarioCharacter = PlaceHolderImages.find(p => p.id === fetchedScenario.characterId) || null;
        setCharacter(scenarioCharacter);

        setUser(userProfile);
        setScenario(fetchedScenario);

        const { initialPrompt, conversationId: newConversationId } = await startAIConversation({ scenarioId: id, userId: userProfile.id });
        setConversationId(newConversationId);

        const initialAiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: initialPrompt,
          timestamp: new Date().toISOString(),
          avatarUrl: scenarioCharacter?.imageUrl || ''
        };

        setMessages([initialAiMessage]);
        conversationHistory.current = `AI: ${initialPrompt}\n`;

      } catch (e) {
        console.error(e);
        setError("Failed to start conversation. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!isUserLoading) {
        initializeConversation();
    }
  }, [id, firebaseUser, isUserLoading]);

  useEffect(() => {
    if (scrollAreaViewport.current) {
      scrollAreaViewport.current.scrollTo({
        top: scrollAreaViewport.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);


  const handleSendMessage = async (content: string) => {
    if (!user || !conversationId || !character || !scenario) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      avatarUrl: user.avatarUrl
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const fullHistory = conversationHistory.current + `User: ${content}\n`;
    
    try {
      const response = await generateAIResponse({
        scenarioTitle: scenario.title,
        scenarioDescription: scenario.initialPrompt,
        conversationHistory: conversationHistory.current,
        userMessage: content,
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: response.aiResponse,
        timestamp: new Date().toISOString(),
        avatarUrl: character.imageUrl,
      };

      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, feedback: response.feedback } : msg
      ));
      
      setMessages(prev => [...prev, aiMessage]);
      
      conversationHistory.current = fullHistory + `AI: ${response.aiResponse}\n`;

    } catch (e) {
      console.error(e);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'ai',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
        avatarUrl: character.imageUrl,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isLoading || isUserLoading) {
    return <CreativeLoadingScreen />;
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-screen bg-background p-4">
            <Alert variant="destructive" className="max-w-lg">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }
  
  if (!scenario || !character) {
     return (
        <div className="flex items-center justify-center h-screen bg-background p-4">
            <Alert variant="destructive" className="max-w-lg">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Scenario not found.</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-secondary/30">
      <ConversationHeader scenario={scenario} onEndConversation={() => setIsSummaryOpen(true)} />
      
      <ScrollArea className="flex-1" viewportRef={scrollAreaViewport}>
        <div className="p-4 md:p-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && (
            <MessageBubble message={{
              id: 'typing',
              role: 'ai',
              content: '',
              timestamp: '',
              avatarUrl: character.imageUrl
            }} isTyping />
          )}
        </div>
        <ScrollBar />
      </ScrollArea>
      
      <div className="p-4 bg-background border-t">
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
      
      <EndSummary 
        isOpen={isSummaryOpen} 
        onOpenChange={setIsSummaryOpen}
        messages={messages}
        scenario={scenario}
      />
    </div>
  );
}
