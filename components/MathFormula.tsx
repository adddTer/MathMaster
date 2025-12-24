
import React, { useEffect, useState } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  tex: string;
  block?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ tex, block = false, className = '' }) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!katex) {
        console.warn("KaTeX is not loaded");
        setHtml(tex); // Fallback
        return;
    }
    try {
        const rendered = katex.renderToString(tex, {
          throwOnError: false,
          displayMode: block,
          strict: false,
          trust: true,
          output: 'html'
        });
        
        setHtml(rendered);
    } catch (e) {
        console.error("KaTeX render error:", e);
        setHtml(tex); // Fallback
    }
  }, [tex, block]);

  // Fallback to text if rendering failed
  if (html === null) {
    return <span className={`${block ? 'block my-2' : ''} ${className}`}>{tex}</span>;
  }

  // If fallback triggered (html === tex), render as text
  if (html === tex) {
      return <span className={`${block ? 'block my-2' : ''} ${className} font-mono text-xs text-red-400 bg-red-50 p-1 rounded`}>{tex}</span>;
  }

  return (
    <span 
        className={`${block ? 'block my-2 overflow-x-auto overflow-y-hidden' : ''} ${className}`} 
        dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};
