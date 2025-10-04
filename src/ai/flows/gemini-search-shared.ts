/**
 * @fileOverview Shared types and schemas for the gemini-search-flow.
 */

import { z } from 'genkit';

export const GeminiSearchInputSchema = z.object({
  query: z.string().describe('The search query from the user.'),
});
export type GeminiSearchInput = z.infer<typeof GeminiSearchInputSchema>;

export const GeminiSearchOutputSchema = z.object({
  response: z
    .string()
    .describe(
      "The comprehensive answer to the user's query, formatted as Markdown."
    ),
});
export type GeminiSearchOutput = z.infer<typeof GeminiSearchOutputSchema>;
