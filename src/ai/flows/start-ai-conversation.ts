'use server';

/**
 * @fileOverview A flow to start a new conversation with an AI tutor.
 *
 * - startAIConversation - A function that handles the starting of a new AI conversation.
 * - StartAIConversationInput - The input type for the startAIConversation function.
 * - StartAIConversationOutput - The return type for the startAIConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { mockScenarios } from '@/lib/data';


const StartAIConversationInputSchema = z.object({
  scenarioId: z.string().describe('The ID of the scenario to start.'),
  userId: z.string().describe('The ID of the user starting the conversation.'),
});

export type StartAIConversationInput = z.infer<typeof StartAIConversationInputSchema>;

const StartAIConversationOutputSchema = z.object({
  conversationId: z.string().describe('The ID of the newly created conversation.'),
  initialPrompt: z.string().describe('The initial prompt from the AI tutor.'),
});

export type StartAIConversationOutput = z.infer<typeof StartAIConversationOutputSchema>;


export async function startAIConversation(
  input: StartAIConversationInput
): Promise<StartAIConversationOutput> {
  return startAIConversationFlow(input);
}

const getScenario = async (id: string) => {
    return mockScenarios.find(s => s.id === id);
};


const startAIConversationFlow = ai.defineFlow(
  {
    name: 'startAIConversationFlow',
    inputSchema: StartAIConversationInputSchema,
    outputSchema: StartAIConversationOutputSchema,
  },
  async ({ userId, scenarioId }) => {
    
    const scenario = await getScenario(scenarioId);

    if (!scenario) {
      throw new Error(`Scenario with ID ${scenarioId} not found.`);
    }

    // This is a mock conversation ID
    const newConversationId = `conv-${Date.now()}`;

    return {
      conversationId: newConversationId,
      initialPrompt: scenario.initialPrompt,
    };
  }
);
