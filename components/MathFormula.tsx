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
    try {
        // Intercept console.warn specifically for the quirks mode warning
        // This is necessary because some embedding environments (like sandboxes or iframes)
        // force quirks mode regardless of the DOCTYPE, causing noisy warnings.
        const originalWarn = console.warn;
        console.warn = (...args) => {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('quirks mode')) {
                return;
            }
            originalWarn.apply(console, args);
        };

        const rendered = katex.renderToString(tex, {
          throwOnError: false,
          displayMode: block,
          strict: false,
          trust: true,
          output: 'html' // Force HTML output to avoid MathML issues in quirks mode
        });
        
        // Restore console.warn
        console.warn = originalWarn;
        
        setHtml(rendered);
    } catch (e) {
        console.error("KaTeX render error:", e);
        setHtml(null);
    }
  }, [tex, block]);

  // Fallback to text if rendering failed
  if (html === null) {
    return <span className={`${block ? 'block my-2' : ''} ${className}`}>{tex}</span>;
  }

  return (
    <span 
        className={`${block ? 'block my-2 overflow-x-auto overflow-y-hidden' : ''} ${className}`} 
        dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};