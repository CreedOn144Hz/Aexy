import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { Message } from "@/lib/types";
import { CheckCircle, XCircle } from "lucide-react";

interface FeedbackDisplayProps {
  feedback: NonNullable<Message['feedback']>;
}

const ScoreBar = ({ label, score }: { label: string, score: number }) => (
    <div className="space-y-1">
        <div className="flex justify-between items-center">
            <p className="text-xs font-medium">{label}</p>
            <p className="text-xs font-bold">{score}/100</p>
        </div>
        <Progress value={score} className="h-2" />
    </div>
);


export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const { grammar, pronunciation } = feedback;
  const hasGrammarIssues = grammar.issues.length > 0;
  const hasPronunciationIssues = pronunciation.issues.length > 0;

  return (
    <Accordion type="single" collapsible className="w-full bg-card rounded-lg border px-3">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="py-2 text-xs hover:no-underline [&[data-state=open]>svg]:text-primary">
            <div className="flex items-center gap-4 w-full pr-4">
                <ScoreBar label="Grammar" score={grammar.score} />
                <ScoreBar label="Pronunciation" score={pronunciation.score} />
            </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-2 text-xs">
            {(!hasGrammarIssues && !hasPronunciationIssues) ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <p>Great job! No issues found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {hasGrammarIssues && (
                        <div>
                            <h4 className="font-semibold mb-1">Grammar Issues:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {grammar.issues.map((issue, index) => (
                                    <li key={`g-${index}`} className="flex items-start">
                                        <XCircle className="h-3 w-3 mr-2 mt-0.5 text-destructive flex-shrink-0" />
                                        <span>{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {hasPronunciationIssues && (
                        <div>
                            <h4 className="font-semibold mb-1">Pronunciation Issues:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {pronunciation.issues.map((issue, index) => (
                                    <li key={`p-${index}`} className="flex items-start">
                                        <XCircle className="h-3 w-3 mr-2 mt-0.5 text-destructive flex-shrink-0" />
                                        <span>{issue}</span>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
