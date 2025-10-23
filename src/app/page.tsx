
'use client';

import { DashboardHeader } from '@/components/aexy/DashboardHeader';
import { ScenarioCard } from '@/components/aexy/ScenarioCard';
import { getScenarios, getUserProfile } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { Scenario, User } from '@/lib/types';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { CreativeLoadingScreen } from '@/components/aexy/CreativeLoadingScreen';

export default function DashboardPage() {
  const { user: firebaseUser, isUserLoading } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, isUserLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!firebaseUser) return;
      
      try {
        setIsLoading(true);
        const storedEmail = localStorage.getItem('aexy_user_email');
        
        // Enforce a minimum loading time for a better user experience
        const [data, _] = await Promise.all([
          (async () => {
            const [scenariosData, userProfile] = await Promise.all([
              getScenarios(),
              getUserProfile(storedEmail)
            ]);
            return { scenariosData, userProfile };
          })(),
          new Promise(res => setTimeout(res, 2500)) // Minimum 2.5 second delay
        ]);

        if (data.userProfile) {
            setUser(data.userProfile);
        } else if (!isUserLoading) {
            router.push('/login');
        }

        setScenarios(data.scenariosData);
        
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isUserLoading) {
      loadData();
    }
  }, [firebaseUser, isUserLoading, router]);
  
  const handleStartPractice = (scenarioId: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push(`/conversation/${scenarioId}`);
    }, 2000); // 2-second delay to show loading screen
  };

  if (isLoading || isUserLoading || !user || isNavigating) {
    return <CreativeLoadingScreen />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30 text-foreground">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader user={user} />
        <section className="mt-12">
          <h2 className="text-3xl font-bold font-headline">Daily Practice</h2>
          <p className="mt-1 text-muted-foreground">
            Choose a scenario to start your conversation.
          </p>
          <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
             {scenarios && scenarios.length > 0 ? (
                scenarios.map((scenario) => (
                    <ScenarioCard 
                      key={scenario.id} 
                      scenario={scenario} 
                      user={user}
                      onStartPractice={handleStartPractice}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No scenarios available.</p>
                </div>
            )}
          </div>
        </section>
      </main>
      <footer className="text-center py-4 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Aexy Tutor. All rights reserved.</p>
      </footer>
    </div>
  );
}
