'use server';
/**
 * @fileOverview A flow for performing a search with Gemini.
 *
 * - geminiSearch - A function that takes a search query and returns a response from Gemini.
 */

import { ai } from '@/ai/genkit';
import {
  GeminiSearchInputSchema,
  type GeminiSearchInput,
  GeminiSearchOutputSchema,
  type GeminiSearchOutput,
} from '@/ai/flows/gemini-search-shared';

export async function geminiSearch(
  input: GeminiSearchInput
): Promise<GeminiSearchOutput> {
  return geminiSearchFlow(input);
}

const geminiSearchPrompt = ai.definePrompt({
  name: 'geminiSearchPrompt',
  input: { schema: GeminiSearchInputSchema },
  output: { schema: GeminiSearchOutputSchema },
  prompt: `You are a helpful research assistant for the Cosmic Scholar space biology search engine. The user is looking for information. Provide a comprehensive answer to their query based on your knowledge. Format your response in Markdown. If you provide links, ensure they are valid.

User Query: {{{query}}}`,
});

const geminiSearchFlow = ai.defineFlow(
  {
    name: 'geminiSearchFlow',
    inputSchema: GeminiSearchInputSchema,
    outputSchema: GeminiSearchOutputSchema,
  },
  async input => {
    const { output } = await geminiSearchPrompt(input);
    return output!;
  }
);
