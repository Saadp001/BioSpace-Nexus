import papersData from '@/lib/papers.json';
import type { Paper } from '@/lib/types';
import SearchClient from '@/components/search-client';

export default function Home() {
  const papers: Paper[] = papersData.map((paper, index) => ({
    ...paper,
    id: `paper-${index}`,
    authors: paper.authors || 'N/A',
  }));

  return <SearchClient papers={papers} />;
}
