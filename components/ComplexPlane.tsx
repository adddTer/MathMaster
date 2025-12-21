import React, { useMemo } from 'react';
import { MathFormula } from './MathFormula';

interface ComplexPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
  showVector?: boolean;
  showComponents?: boolean;
  showAngle?: boolean;
}

interface ComplexPlaneProps {
  points?: ComplexPoint[];
  range?: number; // Coordinate range +/-
  size?: number; // Pixel size
  showUnitCircle?: boolean;
  showGrid?: boolean;
  label?: string;
}

export const ComplexPlane: React.FC<ComplexPlaneProps> = ({ 
  points = [], 
  range = 2, 
  size = 300,
  showUnitCircle = false,
  showGrid = true,
  label
}) => {
  const padding = 30;
  const width = size;
  const height = size;
  
  // Coordinate mapping
  // Map mathematical (x,y) to SVG coordinates
  // SVG: (0,0) is top-left. Math: (0,0) is center.
  const mapX = (val: number) => (val / range) * (width / 2 - padding) + width / 2;
  const mapY = (val: number) => height / 2 - (val / range) * (height / 2 - padding);

  const originX = width / 2;
  const originY = height / 2;

  // Grid generation
  const { gridLines, axisLabels } = useMemo(() => {
    const lines = [];
    const labels = [];
    const step = 1; // Grid step
    // Extend grid slightly beyond range to fill view
    const gridRange = Math.ceil(range);
    
    for (let i = -gridRange; i <= gridRange; i += step) {
        if (i === 0) continue;
        
        const xPos = mapX(i);
        const yPos = mapY(i);

        // Grid lines only if within bounds
        if (xPos >= padding && xPos <= width - padding) {
             lines.push(<line key={`v${i}`} x1={xPos} y1={padding} x2={xPos} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" />);
             // Axis Numbers (Real)
             labels.push(<text key={`xl${i}`} x={xPos} y={originY + 15} fontSize="9" fill="#94a3b8" textAnchor="middle">{i}</text>);
        }
        
        if (yPos >= padding && yPos <= height - padding) {
             lines.push(<line key={`h${i}`} x1={padding} y1={yPos} x2={width - padding} y2={yPos} stroke="#f1f5f9" strokeWidth="1" />);
             // Axis Numbers (Imaginary)
             labels.push(<text key={`yl${i}`} x={originX - 8} y={yPos + 3} fontSize="9" fill="#94a3b8" textAnchor="end">{i}i</text>);
        }
    }
    return { gridLines: lines, axisLabels: labels };
  }, [range, width, height]);

  return (
    <div className="flex flex-col items-center my-6 group">
      <div className="relative bg-white border border-slate-200 rounded-xl overflow-visible shadow-sm hover:shadow-md transition-shadow" style={{ width: '100%', maxWidth: size, aspectRatio: '1/1' }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <marker id="arrow-plane" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
            </marker>
            <marker id="arrow-vector" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="currentColor" className="text-current" />
            </marker>
          </defs>

          {/* Grid */}
          {showGrid && gridLines}

          {/* Unit Circle */}
          {showUnitCircle && (
             <circle 
                cx={originX} 
                cy={originY} 
                r={mapX(1) - originX} 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="1.5" 
                strokeDasharray="4 2" 
             />
          )}

          {/* Axes */}
          <line x1={padding} y1={originY} x2={width - padding} y2={originY} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-plane)" />
          <line x1={originX} y1={height - padding} x2={originX} y2={padding} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-plane)" />
          
          <text x={width - 25} y={originY - 8} fontSize="10" fill="#64748b" fontWeight="bold" fontFamily="sans-serif">Re</text>
          <text x={originX + 8} y={padding + 10} fontSize="10" fill="#64748b" fontWeight="bold" fontFamily="sans-serif">Im</text>
          <text x={originX - 10} y={originY + 15} fontSize="9" fill="#94a3b8" fontFamily="sans-serif">0</text>
          
          {showGrid && axisLabels}

          {/* Points & Vectors */}
          {points.map((pt, i) => {
             const px = mapX(pt.x);
             const py = mapY(pt.y);
             const color = pt.color || "#3b82f6";
             const r = Math.sqrt(pt.x*pt.x + pt.y*pt.y);
             const angleRad = Math.atan2(pt.y, pt.x); 
             
             return (
               <g key={i} style={{ color: color }}>
                  {/* Components (Dashed lines) */}
                  {pt.showComponents && (
                    <>
                      <line x1={px} y1={py} x2={px} y2={originY} stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
                      <line x1={px} y1={py} x2={originX} y2={py} stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
                    </>
                  )}

                  {/* Angle Arc */}
                  {pt.showAngle && r > 0 && (
                      <>
                        <path 
                            d={`M ${originX + 20} ${originY} A 20 20 0 0 ${pt.y >= 0 ? 0 : 1} ${originX + 20 * Math.cos(angleRad)} ${originY - 20 * Math.sin(angleRad)}`} 
                            fill="none" 
                            stroke={color} 
                            strokeWidth="1.5" 
                            opacity="0.6"
                        />
                        <text x={originX + 25} y={originY - 8 * Math.sign(pt.y || 1)} fontSize="9" fill={color}>θ</text>
                      </>
                  )}

                  {/* Vector */}
                  {pt.showVector && (
                     <line x1={originX} y1={originY} x2={px} y2={py} stroke={color} strokeWidth="2" markerEnd="url(#arrow-vector)" />
                  )}

                  {/* Point */}
                  <circle cx={px} cy={py} r="4" fill="white" stroke={color} strokeWidth="2" />
                  
                  {/* Label */}
                  {pt.label && (
                      <foreignObject x={px + 5} y={py - 25} width="120" height="40" style={{ overflow: 'visible' }}>
                          <div className="text-xs font-bold whitespace-nowrap px-2 py-1 rounded bg-white/90 backdrop-blur-sm shadow-sm inline-block border border-slate-100" style={{ color: color }}>
                              <MathFormula tex={pt.label} />
                          </div>
                      </foreignObject>
                  )}
               </g>
             );
          })}
        </svg>
      </div>
      {label && <div className="text-xs text-slate-500 font-medium mt-2 bg-slate-50 px-3 py-1 rounded-full">{label}</div>}
    </div>
  );
};