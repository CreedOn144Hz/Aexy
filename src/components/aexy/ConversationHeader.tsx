"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Scenario } from "@/lib/types";

interface ConversationHeaderProps {
  scenario: Scenario;
  onEndConversation: () => void;
}

export function ConversationHeader({ scenario, onEndConversation }: ConversationHeaderProps) {
  return (
    <header className="flex items-center justify-between p-3 border-b bg-background shadow-sm">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
            <h1 className="text-lg font-bold font-headline">{scenario.title}</h1>
            <p className="text-sm text-muted-foreground">{scenario.difficulty} · {scenario.duration}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEndConversation}>
            <Flag className="mr-2 h-4 w-4" />
            <span>End Conversation</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
