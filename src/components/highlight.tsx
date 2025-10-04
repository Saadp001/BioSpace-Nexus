"use client";

import React from 'react';

type HighlightProps = {
  text: string;
  highlight: string;
};

export default function Highlight({ text, highlight }: HighlightProps) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/30 text-primary-foreground rounded-sm px-0.5 py-0">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
