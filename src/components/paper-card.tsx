'use client';

import type { Paper } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Highlight from './highlight';
import { Button } from './ui/button';
import { ArrowUpRight } from 'lucide-react';

type PaperCardProps = {
  paper: Paper;
  query: string;
  onCardClick: () => void;
};

export default function PaperCard({ paper, query, onCardClick }: PaperCardProps) {
  return (
    <Card 
      onClick={onCardClick}
      className="flex flex-col bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer border border-secondary"
    >
      <CardHeader>
        <CardTitle className="text-lg text-primary-foreground">
          <Highlight text={paper.title} highlight={query} />
        </CardTitle>
        <CardDescription>
          <Highlight text={paper.authors} highlight={query} /> - {paper.year}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="flex flex-wrap gap-2">
          {paper.keywords.slice(0, 4).map(keyword => (
            <div key={keyword} className="text-xs text-muted-foreground">
              <Highlight text={`#${keyword}`} highlight={query} />
            </div>
          ))}
        </div>
        <Button
            variant="ghost"
            className="w-full justify-center mt-4"
        >
            View AI Summary
            <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
