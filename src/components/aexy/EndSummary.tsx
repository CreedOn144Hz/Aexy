"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import type { Message, Scenario } from "@/lib/types";
import { Progress } from "../ui/progress";
import { useRouter } from "next/navigation";

interface EndSummaryProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  messages: Message[];
  scenario: Scenario | null;
}

const ScoreItem = ({ label, score }: { label: string, score: number }) => (
    <div className="grid grid-cols-3 items-center gap-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Progress value={score} className="h-2 col-span-2" />
        {/* <span className="text-sm font-bold text-right">{score}%</span> */}
    </div>
);

export function EndSummary({ isOpen, onOpenChange, messages, scenario }: EndSummaryProps) {
  const router = useRouter();
  
  // Calculate average scores from feedback. This is a mock implementation.
  const userMessagesWithFeedback = messages.filter(m => m.role === 'user' && m.feedback);
  
  let avgGrammar = 85;
  let avgPronunciation = 90;
  
  if (userMessagesWithFeedback.length > 0) {
    const totalGrammar = userMessagesWithFeedback.reduce((sum, msg) => sum + (msg.feedback?.grammar.score ?? 0), 0);
    const totalPronunciation = userMessagesWithFeedback.reduce((sum, msg) => sum + (msg.feedback?.pronunciation.score ?? 0), 0);
    avgGrammar = Math.round(totalGrammar / userMessagesWithFeedback.length);
    avgPronunciation = Math.round(totalPronunciation / userMessagesWithFeedback.length);
  }

  // Mock other scores
  const fluencyScore = Math.round((avgGrammar + avgPronunciation) / 2.2);
  const vocabularyScore = 88;


  const handleDone = () => {
    onOpenChange(false);
    router.push('/');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center items-center bg-primary/10 rounded-full h-12 w-12 mx-auto mb-4">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center font-headline text-2xl">Conversation Complete!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Well done! Here's a summary of your performance in the "{scenario?.title}" scenario.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <h3 className="text-lg font-semibold font-headline">Overall Scores</h3>
            <div className="space-y-3 p-4 rounded-lg border bg-secondary/50">
                <ScoreItem label="Fluency" score={fluencyScore} />
                <ScoreItem label="Grammar" score={avgGrammar} />
                <ScoreItem label="Pronunciation" score={avgPronunciation} />
                <ScoreItem label="Vocabulary" score={vocabularyScore} />
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDone} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
