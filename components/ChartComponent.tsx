
import React, { useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartComponentProps {
  type: 'bar' | 'line' | 'scatter' | 'histogram';
  data: DataPoint[];
  width?: number;
  height?: number;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  type,
  data,
  width = 600, // Increased default width
  height = 350, // Increased default height
  title,
  xLabel,
  yLabel,
  color = 'blue'
}) => {
  const padding = { top: 50, right: 30, bottom: 50, left: 60 }; // Increased padding
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)) * 1.1, [data]); // 10% headroom
  const minValue = 0; // Assuming positive data for basic charts, can be adjusted

  const colorMap: Record<string, string> = {
    blue: "#3b82f6", red: "#ef4444", emerald: "#10b981", purple: "#8b5cf6",
    orange: "#f97316", indigo: "#6366f1", slate: "#64748b"
  };
  const themeColor = colorMap[color] || color;

  const getX = (index: number) => padding.left + (index / (data.length - (type === 'histogram' ? 0 : 1))) * plotWidth;
  // For bars/histogram, we need band width
  const bandWidth = plotWidth / data.length; 
  const getBarX = (index: number) => padding.left + index * bandWidth;
  
  const getY = (value: number) => height - padding.bottom - (value / maxValue) * plotHeight;

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const val = (maxValue / steps) * i;
      const y = getY(val);
      lines.push(
        <g key={i}>
          <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f1f5f9" strokeWidth="1" />
          <text x={padding.left - 8} y={y + 4} fontSize="12" fill="#94a3b8" textAnchor="end">{val.toFixed(1).replace(/\.0$/, '')}</text>
        </g>
      );
    }
    return lines;
  }, [maxValue, height]);

  return (
    <div className="flex flex-col items-center my-6 w-full">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2 overflow-hidden hover:shadow-md transition-shadow w-full max-w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block" style={{ maxHeight: height }}>
          {/* Title */}
          {title && (
            <text x={width / 2} y={25} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#334155">
              {title}
            </text>
          )}

          {/* Grid & Axes */}
          {gridLines}
          
          {/* Y Axis Line */}
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#cbd5e1" strokeWidth="1" />
          {/* X Axis Line */}
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#cbd5e1" strokeWidth="1" />

          {/* Labels */}
          {yLabel && <text x={15} y={padding.top - 15} fontSize="12" fill="#64748b" fontWeight="bold">{yLabel}</text>}
          {xLabel && <text x={width - 30} y={height - 15} fontSize="12" fill="#64748b" fontWeight="bold">{xLabel}</text>}

          {/* Data Rendering */}
          {type === 'line' && (
            <polyline
              points={data.map((d, i) => `${getBarX(i) + bandWidth/2},${getY(d.value)}`).join(' ')}
              fill="none"
              stroke={themeColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {data.map((d, i) => {
            const x = getBarX(i);
            const y = getY(d.value);
            const barH = height - padding.bottom - y;
            const itemColor = d.color ? (colorMap[d.color] || d.color) : themeColor;

            return (
              <g key={i} className="group">
                {/* Visual Elements */}
                {(type === 'bar' || type === 'histogram') && (
                  <rect
                    x={x + (type === 'bar' ? bandWidth * 0.15 : 0.5)} // Gap for bar, almost none for histogram
                    y={y}
                    width={bandWidth * (type === 'bar' ? 0.7 : 1) - (type === 'histogram' ? 1 : 0)}
                    height={barH}
                    fill={itemColor}
                    opacity={0.8}
                    rx={type === 'bar' ? 4 : 0}
                  />
                )}
                
                {(type === 'line' || type === 'scatter') && (
                  <circle cx={x + bandWidth/2} cy={y} r={type === 'scatter' ? 5 : 4} fill="white" stroke={itemColor} strokeWidth="2.5" />
                )}

                {/* X Axis Labels */}
                <text 
                  x={x + bandWidth/2} 
                  y={height - padding.bottom + 20} 
                  fontSize="12" 
                  fill="#64748b" 
                  textAnchor="middle"
                  className="truncate"
                >
                  {d.label}
                </text>

                {/* Value Tooltips (Simple Hover via CSS group) */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <rect x={x + bandWidth/2 - 20} y={y - 25} width="40" height="20" rx="4" fill="#1e293b" opacity="0.9" />
                    <text x={x + bandWidth/2} y={y - 11} fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">{d.value}</text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
