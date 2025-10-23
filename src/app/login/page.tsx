
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { Loader2, UserCheck, Shield, Gem } from 'lucide-react';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

const tierEmails = {
  FREE: 'freetier@gmail.com',
  STANDARD: 'tier1@gmail.com',
  PREMIUM: 'premium@gmail.com',
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const auth = useAuth();
  const { user: firebaseUser, isUserLoading } = useUser();
  const router = useRouter();

  async function handleTierLogin(tier: 'FREE' | 'STANDARD' | 'PREMIUM') {
    if (!auth) return;
    setIsLoading(true);
    setSelectedTier(tier);

    localStorage.setItem('aexy_user_email', tierEmails[tier]);
    
    if (!firebaseUser) {
        initiateAnonymousSignIn(auth);
    }
    
    // Redirect to avatar selection page
    router.push('/select-avatar');
  }

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Select a Profile</CardTitle>
          <CardDescription className="text-center">
            Choose a pre-configured account to start your practice. No password needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full justify-start h-14 text-base"
            disabled={isLoading}
            onClick={() => handleTierLogin('FREE')}
          >
            {isLoading && selectedTier === 'FREE' 
              ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              : <UserCheck className="mr-3 h-5 w-5 text-green-500" />
            }
            <div>
              <p className="font-semibold text-left">Free Tier</p>
              <p className="font-normal text-xs text-muted-foreground">3 conversations/day</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full justify-start h-14 text-base"
            disabled={isLoading}
            onClick={() => handleTierLogin('STANDARD')}
          >
            {isLoading && selectedTier === 'STANDARD' 
              ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              : <Shield className="mr-3 h-5 w-5 text-blue-500" />
            }
            <div>
              <p className="font-semibold text-left">Standard Tier</p>
              <p className="font-normal text-xs text-muted-foreground">10 conversations/day</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full justify-start h-14 text-base"
            disabled={isLoading}
            onClick={() => handleTierLogin('PREMIUM')}
          >
            {isLoading && selectedTier === 'PREMIUM' 
              ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              : <Gem className="mr-3 h-5 w-5 text-purple-500" />
            }
            <div>
              <p className="font-semibold text-left">Premium Tier</p>
              <p className="font-normal text-xs text-muted-foreground">Unlimited conversations</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
