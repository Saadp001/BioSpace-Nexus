'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Paper } from '@/lib/types';
import { Input } from '@/components/ui/input';
import PaperCard from './paper-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Rocket, Search, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images.ts';
import Image from 'next/image';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { summarizePaper } from '@/ai/flows/summarize-paper-flow';
import type { SummarizePaperOutput } from '@/ai/flows/summarize-paper-shared';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { geminiSearch } from '@/ai/flows/gemini-search-flow';
import type { GeminiSearchOutput } from '@/ai/flows/gemini-search-shared';
import { Card, CardContent } from '@/components/ui/card';

type SearchClientProps = {
  papers: Paper[];
};

export default function SearchClient({ papers }: SearchClientProps) {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [summary, setSummary] = useState<SummarizePaperOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [useGemini, setUseGemini] = useState(false);
  const [geminiResult, setGeminiResult] = useState<GeminiSearchOutput | null>(
    null
  );
  const [isSearchingGemini, setIsSearchingGemini] = useState(false);

  const heroImage = PlaceHolderImages.find(img => img.id === 'dna-hero');

  const filteredPapers = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return papers.filter(paper => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        paper.title.toLowerCase().includes(lowerCaseQuery) ||
        paper.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery))
      );
    });
  }, [papers, searchQuery]);

  const handleSearch = () => {
    setGeminiResult(null);
    if (useGemini) {
      setIsSearchingGemini(true);
      startTransition(async () => {
        try {
          const result = await geminiSearch({ query });
          setGeminiResult(result);
        } catch (error) {
          console.error('Error searching with Gemini:', error);
        } finally {
          setIsSearchingGemini(false);
          setSearchQuery(query);
        }
      });
    } else {
      startTransition(() => {
        setSearchQuery(query);
      });
    }
  };

  const handleExploreClick = () => {
    setShowSearch(true);
    //
    setTimeout(() => {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  const handlePaperClick = async (paper: Paper) => {
    setSelectedPaper(paper);
    setSummary(null);
    setIsGenerating(true);
    try {
      const result = await summarizePaper({
        title: paper.title,
        link: paper.link,
      });
      setSummary(result);
    } catch (error) {
      console.error('Error generating summary:', error);
      // You could set an error state here to show in the dialog
    } finally {
      setIsGenerating(false);
    }
  };
  
  const formattedGeminiResponse = useMemo(() => {
    if (!geminiResult) return '';
    // A simple markdown to HTML conversion
    return geminiResult.response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">$1</a>')
      .replace(/^(#{1,6}) (.*$)/gim, (match, h, text) => `<h${h.length} class="text-lg font-bold mt-4 mb-2">${text}</h${h.length}>`)
      .replace(/\n/g, '<br />');
  }, [geminiResult]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center text-white pt-20">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-background/80" />
          <div className="relative z-10 w-full max-w-4xl px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="text-primary">BioSpace </span>
              <span className="text-accent">Nexus</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore decades of NASA bioscience research with AI-powered
              insights. Discover how space biology experiments are shaping the
              future of human exploration.
            </p>

            {!showSearch && (
              <Button size="lg" onClick={handleExploreClick}>
                <Search className="mr-2 h-5 w-5" />
                Explore Publications
              </Button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-12">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-primary">1000+</p>
                <p className="text-muted-foreground">Publications</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-primary">50+</p>
                <p className="text-muted-foreground">Missions</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-accent">AI-Powered</p>
                <p className="text-muted-foreground">Insights</p>
              </div>
            </div>

            {showSearch && (
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="search-input"
                    placeholder="Search publications, experiments, missions..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full h-14 pl-12 pr-28 rounded-full text-lg bg-background/80 border-2 border-border"
                  />
                  <Button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full"
                    disabled={isPending || isSearchingGemini}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Switch
                    id="gemini-switch"
                    checked={useGemini}
                    onCheckedChange={setUseGemini}
                  />
                  <Label htmlFor="gemini-switch" className="text-muted-foreground">
                    Enable Gemini Search
                  </Label>
                </div>
              </div>
            )}
          </div>
        </section>

        {showSearch && searchQuery && (
          <section className="container mx-auto py-12 md:py-16">
            <div className="md:col-span-3">
              {isPending || isSearchingGemini ? (
                <div className="space-y-4">
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <Skeleton key={i} className="w-full h-64 bg-secondary/40" />
                    ))}
                  </div>
                </div>
              ) : useGemini && geminiResult ? (
                 <Card className="bg-secondary/40 border border-secondary">
                    <CardContent className="p-6">
                       <h2 className="text-2xl font-bold text-accent mb-4">Gemini Search Results</h2>
                       <div className="prose prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: formattedGeminiResponse }} />
                    </CardContent>
                 </Card>
              ) : !useGemini ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredPapers.length} results for "{searchQuery}".
                  </div>
                  {filteredPapers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredPapers.map(paper => (
                        <PaperCard
                          key={paper.id}
                          paper={paper}
                          query={searchQuery}
                          onCardClick={() => handlePaperClick(paper)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Rocket className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-lg font-medium">
                        No results found
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Try adjusting your search terms.
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </section>
        )}
      </main>

      <Dialog
        open={!!selectedPaper}
        onOpenChange={() => setSelectedPaper(null)}
      >
        <DialogContent className="sm:max-w-[625px] bg-secondary border-border">
          {selectedPaper && (
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary-foreground">
                {selectedPaper.title}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground pt-2">
                {selectedPaper.authors} - {selectedPaper.year}
              </DialogDescription>
            </DialogHeader>
          )}
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-2 text-accent">
              AI Summary
            </h3>
            {isGenerating && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
              </div>
            )}
            {summary && (
              <p className="text-muted-foreground">{summary.summary}</p>
            )}
          </div>
          {selectedPaper && (
            <div className="flex justify-end">
              <Link
                href={selectedPaper.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="link">Read Original Paper</Button>
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
