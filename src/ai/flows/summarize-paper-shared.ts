/**
 * @fileOverview Shared types and schemas for the summarize-paper flow.
 */

import { z } from 'genkit';

export const SummarizePaperInputSchema = z.object({
  title: z.string().describe('The title of the research paper.'),
  link: z.string().url().describe('A valid URL link to the research paper.'),
});
export type SummarizePaperInput = z.infer<typeof SummarizePaperInputSchema>;

export const SummarizePaperOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, one-paragraph summary of the research paper, written for a general audience.'
    ),
});
export type SummarizePaperOutput = z.infer<typeof SummarizePaperOutputSchema>;
