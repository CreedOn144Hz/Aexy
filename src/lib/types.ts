import type { GenerateAIResponseOutput } from "@/ai/flows/generate-ai-responses";

export type User = {
  id: string;
  email: string;
  tier: 'FREE' | 'STANDARD' | 'PREMIUM';
  conversationsToday: number;
  conversationsLimit: number;
  streak: number;
  avatarUrl: string;
  level: string;
};

export type Scenario = {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isPremium: boolean;
  initialPrompt: string;
  characterId: string;
};

export type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  feedback?: GenerateAIResponseOutput['feedback'];
  avatarUrl: string;
};
