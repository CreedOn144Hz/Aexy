'use server';

/**
 * @fileOverview A flow to generate AI responses for conversation practice, including grammar and pronunciation feedback and conversation summaries.
 *
 * - generateAIResponse - A function that generates AI responses based on user input using the Google Gemini API.
 * - GenerateAIResponseInput - The input type for the generateAIResponse function.
 * - GenerateAIResponseOutput - The return type for the generateAIResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAIResponseInputSchema = z.object({
  scenarioTitle: z.string().describe('The title of the practice scenario.'),
  scenarioDescription: z.string().describe('The initial prompt or description of the scenario.'),
  conversationHistory: z.string().describe('The history of the conversation so far.'),
  userMessage: z.string().describe('The latest message from the user.'),
});
export type GenerateAIResponseInput = z.infer<typeof GenerateAIResponseInputSchema>;

const GenerateAIResponseOutputSchema = z.object({
  aiResponse: z.string().describe('The AI generated response.'),
  feedback: z
    .object({
      grammar: z.object({
        score: z.number().describe('The grammar score for the user message. If there are no issues, this should be 100.'),
        issues: z.array(z.string()).describe('Any grammar issues in the user message.'),
      }),
      pronunciation: z.object({
        score: z.number().describe('The pronunciation score for the user message. If there are no issues, this should be 100.'),
        issues: z.array(z.string()).describe('Any pronunciation issues in the user message.'),
      }),
    })
    .describe('Feedback on the user message.'),
});
export type GenerateAIResponseOutput = z.infer<typeof GenerateAIResponseOutputSchema>;

export async function generateAIResponse(input: GenerateAIResponseInput): Promise<GenerateAIResponseOutput> {
  return generateAIResponseFlow(input);
}

const generateAIResponsePrompt = ai.definePrompt({
  name: 'generateAIResponsePrompt',
  input: {schema: GenerateAIResponseInputSchema},
  output: {schema: GenerateAIResponseOutputSchema},
  prompt: `You are an English tutor. Your role is to help a student practice their conversation skills in a specific scenario.

Scenario Topic: {{{scenarioTitle}}}
Scenario Description: {{{scenarioDescription}}}

Conversation History:
{{{conversationHistory}}}
Student: {{{userMessage}}}

Your task is to respond naturally as the character in the scenario, ask relevant follow-up questions to keep the conversation going, and provide feedback on the student's message in the requested JSON format. If no grammar or pronunciation issues are found, the score for that category must be 100.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateAIResponseFlow = ai.defineFlow(
  {
    name: 'generateAIResponseFlow',
    inputSchema: GenerateAIResponseInputSchema,
    outputSchema: GenerateAIResponseOutputSchema,
  },
  async input => {
    const {output} = await generateAIResponsePrompt(input);
    return output!;
  }
);
