'use server';
/**
 * @fileOverview A flow for summarizing research papers.
 *
 * - summarizePaper - A function that takes a paper's title and link and returns a summary.
 */

import { ai } from '@/ai/genkit';
import {
  SummarizePaperInputSchema,
  type SummarizePaperInput,
  SummarizePaperOutputSchema,
  type SummarizePaperOutput,
} from '@/ai/flows/summarize-paper-shared';

export async function summarizePaper(
  input: SummarizePaperInput
): Promise<SummarizePaperOutput> {
  return summarizePaperFlow(input);
}

const summarizePaperPrompt = ai.definePrompt({
  name: 'summarizePaperPrompt',
  input: { schema: SummarizePaperInputSchema },
  output: { schema: SummarizePaperOutputSchema },
  prompt: `You are a science communication expert specializing in space biology. Your task is to summarize a research paper for a general audience.

Given the title and a link to the paper, provide a concise, one-paragraph summary that is easy to understand, avoiding jargon where possible.

Paper Title: {{{title}}}
Paper Link: {{{link}}}

IMPORTANT: You MUST access the content from the provided 'Paper Link' to generate the summary. Do not make up information. If you cannot access the link, state that you are unable to provide a summary at this time.

Generate the summary based on the content found at the provided link. Focus on the key findings and their significance.`,
});

const summarizePaperFlow = ai.defineFlow(
  {
    name: 'summarizePaperFlow',
    inputSchema: SummarizePaperInputSchema,
    outputSchema: SummarizePaperOutputSchema,
  },
  async input => {
    const { output } = await summarizePaperPrompt(input);
    return output!;
  }
);
