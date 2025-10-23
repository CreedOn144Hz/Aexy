import type { Scenario, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'freetier@gmail.com',
    tier: 'FREE',
    conversationsToday: 2,
    conversationsLimit: 3,
    streak: 5,
    avatarUrl: PlaceHolderImages.find(p => p.id === 'aexy-user-avatar-placeholder')?.imageUrl || '',
    level: 'Intermediate',
  },
  {
    id: '2',
    email: 'tier1@gmail.com',
    tier: 'STANDARD',
    conversationsToday: 8,
    conversationsLimit: 10,
    streak: 12,
    avatarUrl: PlaceHolderImages.find(p => p.id === 'aexy-user-avatar-placeholder')?.imageUrl || '',
    level: 'Advanced',
  },
  {
    id: '3',
    email: 'premium@gmail.com',
    tier: 'PREMIUM',
    conversationsToday: 15,
    conversationsLimit: 99, // Unlimited effectively
    streak: 28,
    avatarUrl: PlaceHolderImages.find(p => p.id === 'aexy-user-avatar-placeholder')?.imageUrl || '',
    level: 'Expert',
  }
];


export const mockScenarios: Scenario[] = [
  {
    id: '1',
    title: 'Job Interview Practice',
    difficulty: 'Intermediate',
    duration: '10 min',
    isPremium: false,
    initialPrompt: "Hi! I'm Dr. Sharma, your interviewer today. Please introduce yourself.",
    characterId: 'aexy-anya-avatar',
  },
  {
    id: '2',
    title: 'Restaurant Ordering',
    difficulty: 'Beginner',
    duration: '5 min',
    isPremium: false,
    initialPrompt: "Welcome to The Grand Bistro! My name is Alex. What can I get for you today?",
    characterId: 'aexy-alex-avatar',
  },
  {
    id: '3',
    title: 'Business Negotiation',
    difficulty: 'Advanced',
    duration: '15 min',
    isPremium: true,
    initialPrompt: "Thanks for meeting. I'm David Chen. Let's discuss the terms of our potential partnership.",
    characterId: 'aexy-david-avatar',
  },
];

export const getScenarios = async (): Promise<Scenario[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  return mockScenarios;
};

export const getScenario = async (id: string): Promise<Scenario | undefined> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  return mockScenarios.find(s => s.id === id);
}

export const getUserProfile = async (email?: string | null): Promise<User | null> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));
    if (!email) return null; 
    
    // In a real app, you would fetch this from Firestore.
    // For this demo, we find the user in our mock array.
    const user = mockUsers.find(u => u.email === email);

    // Retrieve saved avatar from local storage if it exists
    if (user) {
        const savedAvatar = localStorage.getItem('aexy_user_avatar');
        if (savedAvatar) {
            user.avatarUrl = savedAvatar;
        }
    }
    
    // If the user is authenticated anonymously but no profile is found,
    // we can default to a free tier user.
    if (user) {
      return user;
    }

    // This handles the case where an anonymous user is authenticated
    // but doesn't have a profile selected yet. Default to free.
    const defaultUser = mockUsers.find(u => u.tier === 'FREE');
    return defaultUser || null;
}

// This function is no longer strictly needed for the anonymous flow,
// but is kept for potential future use or reference.
export const createUserProfile = (uid: string, email: string) => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
        console.log(`User profile for ${email} already exists.`);
        return;
    }

    const newUser: User = {
        id: uid,
        email: email,
        tier: 'FREE',
        conversationsToday: 0,
        conversationsLimit: 3,
        streak: 0,
        avatarUrl: PlaceHolderImages.find(p => p.id === 'aexy-user-avatar-placeholder')?.imageUrl || '',
        level: 'Beginner',
    };

    mockUsers.push(newUser);
    console.log(`User profile created for ${uid} with email ${email}`);
};
