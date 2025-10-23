
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Lock, Shield, ArrowRight } from 'lucide-react';
import type { Scenario, User } from '@/lib/types';
import { UpgradeModal } from './UpgradeModal';
import { cn } from '@/lib/utils';

interface ScenarioCardProps {
  scenario: Scenario;
  user: User;
  onStartPractice: (scenarioId: string) => void;
}

export function ScenarioCard({ scenario, user, onStartPractice }: ScenarioCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFreeTier = user.tier === 'FREE';
  const isPremiumScenario = scenario.isPremium;
  const limitReached = user.conversationsToday >= user.conversationsLimit;
  
  const isLocked = isPremiumScenario && isFreeTier;
  const isDisabled = limitReached || isLocked;

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLocked) {
      setIsModalOpen(true);
    } else if (limitReached) {
      console.log("Daily limit reached.");
    } else {
      onStartPractice(scenario.id);
    }
  };
  
  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200/80',
    Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200/80',
    Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200/80',
  };

  return (
    <>
      <Card className={cn(
          "flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5", 
          (isDisabled && !isLocked) && "opacity-60 bg-muted/50 saturate-50",
          isLocked ? "border-dashed border-2" : "border"
        )}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl mb-2">{scenario.title}</CardTitle>
            {isPremiumScenario && 
              <Badge variant="outline" className="border-accent text-accent bg-accent/10 font-semibold">
                Premium
              </Badge>
            }
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
            <Badge variant="outline" className={cn("capitalize font-medium", difficultyColors[scenario.difficulty])}>
              <Shield className="h-3 w-3 mr-1.5" />
              {scenario.difficulty}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{scenario.duration}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{scenario.initialPrompt}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCardClick} disabled={isDisabled} className="w-full font-semibold group" variant={isLocked ? 'secondary' : 'default'}>
            {isLocked ? <Lock className="mr-2 h-4 w-4" /> : null}
            {isLocked ? 'Upgrade to Unlock' : 'Start Practice'}
            {!isLocked && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </Button>
        </CardFooter>
      </Card>
      <UpgradeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
