import Image from 'next/image';
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { format } from "date-fns";
import { FeedbackDisplay } from './FeedbackDisplay';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export function MessageBubble({ message, isTyping = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const character = PlaceHolderImages.find(p => p.imageUrl === message.avatarUrl);

  if (isTyping) {
    return (
        <div className="flex items-end gap-3">
            <Image
                src={message.avatarUrl}
                alt={character?.description || 'AI Avatar'}
                width={40}
                height={40}
                className="rounded-full"
                data-ai-hint={character?.imageHint || 'robot face'}
            />
            <div className="bg-secondary rounded-lg rounded-bl-none p-3 max-w-lg">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-0"></span>
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></span>
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></span>
                </div>
            </div>
      </div>
    );
  }

  return (
    <div>
        <div className={cn("flex items-start gap-3", isUser && "justify-end")}>
        {!isUser && (
            <Image
                src={message.avatarUrl}
                alt={character?.description || 'AI Avatar'}
                width={40}
                height={40}
                className="rounded-full"
                data-ai-hint={character?.imageHint || 'robot face'}
            />
        )}
        <div className="flex flex-col gap-1 w-full max-w-lg">
            <div
                className={cn(
                    "p-3 rounded-lg shadow-sm whitespace-pre-wrap",
                    isUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-secondary-foreground rounded-bl-none"
                )}
                >
                <p className="text-sm">{message.content}</p>
            </div>
            <p className={cn("text-xs text-muted-foreground", isUser && "text-right")}>
                {format(new Date(message.timestamp), "p")}
            </p>
        </div>
        {isUser && (
            <Image
                src={message.avatarUrl}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
                data-ai-hint="person smiling"
            />
        )}
        </div>
        {isUser && message.feedback && (
            <div className="flex justify-end mt-2">
                <div className="w-full max-w-lg ml-auto pl-12">
                     <FeedbackDisplay feedback={message.feedback} />
                </div>
            </div>
        )}
    </div>
  );
}
