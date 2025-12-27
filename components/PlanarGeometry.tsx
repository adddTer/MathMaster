
import React, { useMemo } from 'react';
import { MathFormula } from './MathFormula';

// --- Types ---

export interface GeoPoint {
  type: 'point';
  x: number;
  y: number;
  label?: string;
  color?: string;
  fill?: boolean; // Solid or hollow
}

export interface GeoVector {
  type: 'vector';
  start?: {x: number, y: number}; // Defaults to 0,0 if specific start not provided
  end: {x: number, y: number};    
  x?: number; // Component x (alternative to end)
  y?: number; // Component y (alternative to end)
  label?: string;
  color?: string;
  dashed?: boolean;
}

export interface GeoLine {
  type: 'line' | 'segment';
  start: {x: number, y: number};
  end: {x: number, y: number};
  label?: string;
  color?: string;
  dashed?: boolean;
}

export interface GeoCircle {
  type: 'circle';
  center: {x: number, y: number};
  radius: number;
  label?: string;
  color?: string;
  fill?: string; // Fill color (usually semi-transparent)
  dashed?: boolean;
}

export interface GeoPolygon {
  type: 'polygon';
  points: {x: number, y: number}[];
  label?: string;
  color?: string;
  fill?: string;
}

export interface GeoFunction {
  type: 'function';
  expr: string; // "x*x" or "Math.sin(x)"
  label?: string;
  color?: string;
  dashed?: boolean;
}

export type GeometryItem = GeoPoint | GeoVector | GeoLine | GeoCircle | GeoPolygon | GeoFunction;

interface PlanarGeometryProps {
  items: GeometryItem[];
  xDomain?: [number, number];
  yDomain?: [number, number];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  axisLabels?: [string, string]; // e.g. ['x', 'y'] or ['Re', 'Im']
  title?: string;
  hideLabels?: boolean;
}

// --- Helper: Expression Evaluator ---
const evaluateExpr = (expr: string, x: number) => {
    try {
        const f = new Function('x', `return ${expr};`);
        return f(x);
    } catch (e) { return NaN; }
};

export const PlanarGeometry: React.FC<PlanarGeometryProps> = ({
  items = [],
  xDomain = [-5, 5],
  yDomain = [-5, 5],
  width = 400,
  height = 300,
  showGrid = true,
  showAxes = true,
  axisLabels = ['x', 'y'],
  title,
  hideLabels = false
}) => {
  const padding = 40;

  // --- Auto-Fit Logic ---
  // If axes are hidden, we calculate the domain based on items to center them
  const { computedXDomain, computedYDomain } = useMemo(() => {
      if (showAxes) {
          return { computedXDomain: xDomain, computedYDomain: yDomain };
      }

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      let hasPoints = false;

      const checkPoint = (x?: number, y?: number) => {
          if (typeof x !== 'number' || typeof y !== 'number') return;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          hasPoints = true;
      };

      if (Array.isArray(items)) {
          items.forEach(item => {
              if (!item) return;
              if (item.type === 'point') {
                  checkPoint(item.x, item.y);
              } else if (item.type === 'vector') {
                  const sx = item.start ? item.start.x : 0;
                  const sy = item.start ? item.start.y : 0;
                  checkPoint(sx, sy);
                  if (item.end) {
                      checkPoint(item.end.x, item.end.y);
                  } else if (item.x !== undefined && item.y !== undefined) {
                      checkPoint(sx + item.x, sy + item.y);
                  }
              } else if (item.type === 'line' || item.type === 'segment') {
                  if (item.start && item.end) {
                      checkPoint(item.start.x, item.start.y);
                      checkPoint(item.end.x, item.end.y);
                  }
              } else if (item.type === 'polygon' && Array.isArray(item.points)) {
                  item.points.forEach(p => checkPoint(p?.x, p?.y));
              } else if (item.type === 'circle' && item.center) {
                  const r = item.radius || 0;
                  checkPoint(item.center.x - r, item.center.y - r);
                  checkPoint(item.center.x + r, item.center.y + r);
              }
          });
      }

      if (!hasPoints) {
          return { computedXDomain: xDomain, computedYDomain: yDomain };
      }

      // Add padding (20%)
      const spanX = maxX - minX || 2; // Default span if single point
      const spanY = maxY - minY || 2;
      const padX = spanX * 0.2;
      const padY = spanY * 0.2;

      return { 
          computedXDomain: [minX - padX, maxX + padX] as [number, number], 
          computedYDomain: [minY - padY, maxY + padY] as [number, number] 
      };
  }, [items, showAxes, xDomain, yDomain]);

  const [xMin, xMax] = computedXDomain;
  const [yMin, yMax] = computedYDomain;

  // Coordinate Mapping
  const mapX = (val: number) => padding + ((val - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const mapY = (val: number) => height - (padding + ((val - yMin) / (yMax - yMin)) * (height - 2 * padding));

  const originX = mapX(0);
  const originY = mapY(0);

  // --- Grid & Axes Generation ---
  const { gridLines, axisElements } = useMemo(() => {
      const gLines: React.ReactNode[] = [];
      const axes: React.ReactNode[] = [];
      
      if (showGrid && showAxes) {
          const xStep = (xMax - xMin) <= 10 ? 1 : Math.ceil((xMax - xMin) / 10);
          const yStep = (yMax - yMin) <= 10 ? 1 : Math.ceil((yMax - yMin) / 10);

          for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i += xStep) {
              const xPos = mapX(i);
              gLines.push(<line key={`v${i}`} x1={xPos} y1={padding} x2={xPos} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" />);
              if (showAxes && i !== 0) axes.push(<text key={`xl${i}`} x={xPos} y={originY + 15} fontSize="9" fill="#94a3b8" textAnchor="middle">{i}</text>);
          }
          for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i += yStep) {
              const yPos = mapY(i);
              gLines.push(<line key={`h${i}`} x1={padding} y1={yPos} x2={width - padding} y2={yPos} stroke="#f1f5f9" strokeWidth="1" />);
              if (showAxes && i !== 0) axes.push(<text key={`yl${i}`} x={originX - 10} y={yPos + 3} fontSize="9" fill="#94a3b8" textAnchor="end">{i}</text>);
          }
      }

      if (showAxes) {
          // X Axis
          if (originY >= padding && originY <= height - padding) {
              axes.push(
                  <g key="xaxis">
                      <line x1={padding} y1={originY} x2={width - padding} y2={originY} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-geo)" />
                      <text x={width - padding + 10} y={originY + 4} fontSize="12" fill="#64748b" fontWeight="bold" fontFamily="serif">{axisLabels[0]}</text>
                  </g>
              );
          }
          // Y Axis
          if (originX >= padding && originX <= width - padding) {
              axes.push(
                  <g key="yaxis">
                      <line x1={originX} y1={height - padding} x2={originX} y2={padding} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-geo)" />
                      <text x={originX} y={padding - 10} fontSize="12" fill="#64748b" fontWeight="bold" textAnchor="middle" fontFamily="serif">{axisLabels[1]}</text>
                  </g>
              );
          }
          // Origin Label
          axes.push(<text key="origin" x={originX - 10} y={originY + 15} fontSize="10" fill="#94a3b8">O</text>);
      }

      return { gridLines: gLines, axisElements: axes };
  }, [xMin, xMax, yMin, yMax, width, height, showGrid, showAxes, axisLabels]);

  // --- Item Rendering ---
  const renderItem = (item: GeometryItem, idx: number) => {
      const color = item.color || "#3b82f6"; // default blue
      const key = `item-${idx}`;

      const labelStyle: React.CSSProperties = { 
          color: color,
          textShadow: '0px 0px 3px white, 0px 0px 3px white, 0px 0px 3px white',
          fontWeight: 'bold',
          fontSize: '12px',
          whiteSpace: 'nowrap'
      };

      try {
          switch (item.type) {
              case 'point': {
                  if (typeof item.x !== 'number' || typeof item.y !== 'number') return null;
                  const px = mapX(item.x);
                  const py = mapY(item.y);
                  return (
                      <g key={key}>
                          <circle cx={px} cy={py} r={item.fill === false ? 3 : 4} fill={item.fill === false ? "white" : color} stroke={color} strokeWidth="2" />
                          {!hideLabels && item.label && (
                              <foreignObject x={px + 6} y={py - 15} width="100" height="30" style={{ overflow: 'visible' }}>
                                  <div style={labelStyle}>
                                      <MathFormula tex={item.label} />
                                  </div>
                              </foreignObject>
                          )}
                      </g>
                  );
              }
              case 'vector': {
                  const startX = item.start ? mapX(item.start.x) : originX;
                  const startY = item.start ? mapY(item.start.y) : originY;
                  let endX, endY;
                  if (item.end) {
                      endX = mapX(item.end.x);
                      endY = mapY(item.end.y);
                  } else if (item.x !== undefined && item.y !== undefined) {
                      const startCoordX = item.start ? item.start.x : 0;
                      const startCoordY = item.start ? item.start.y : 0;
                      endX = mapX(startCoordX + item.x);
                      endY = mapY(startCoordY + item.y);
                  } else {
                      return null;
                  }

                  return (
                      <g key={key}>
                          <line 
                            x1={startX} y1={startY} x2={endX} y2={endY} 
                            stroke={color} strokeWidth="2" 
                            strokeDasharray={item.dashed ? "4 3" : "none"}
                            markerEnd={`url(#arrow-vec-${color.replace('#', '')})`} 
                          />
                          {!hideLabels && item.label && (
                              <foreignObject x={(startX + endX)/2} y={(startY + endY)/2 - 15} width="100" height="30" style={{ overflow: 'visible' }}>
                                  <div style={labelStyle}>
                                      <MathFormula tex={item.label} />
                                  </div>
                              </foreignObject>
                          )}
                      </g>
                  );
              }
              case 'line':
              case 'segment': {
                  if (!item.start || !item.end) return null;
                  const x1 = mapX(item.start.x);
                  const y1 = mapY(item.start.y);
                  const x2 = mapX(item.end.x);
                  const y2 = mapY(item.end.y);
                  
                  return (
                      <g key={key}>
                          <line 
                            x1={x1} y1={y1} x2={x2} y2={y2} 
                            stroke={color} strokeWidth="2" 
                            strokeDasharray={item.dashed ? "5 5" : "none"}
                            strokeLinecap="round"
                          />
                          {!hideLabels && item.label && (
                              <foreignObject x={(x1+x2)/2} y={(y1+y2)/2 - 10} width="100" height="30" style={{ overflow: 'visible' }}>
                                  <div style={{ ...labelStyle, color: '#64748b' }}><MathFormula tex={item.label} /></div>
                              </foreignObject>
                          )}
                      </g>
                  );
              }
              case 'circle': {
                  if (!item.center) return null;
                  const cx = mapX(item.center.x);
                  const cy = mapY(item.center.y);
                  const r = (item.radius || 1) * ((width - 2 * padding) / (xMax - xMin));
                  
                  return (
                      <g key={key}>
                          <circle 
                            cx={cx} cy={cy} r={r} 
                            fill={item.fill || "none"} 
                            stroke={color} 
                            strokeWidth="1.5"
                            strokeDasharray={item.dashed ? "4 4" : "none"}
                          />
                          {!hideLabels && item.label && (
                              <foreignObject x={cx + r/1.4} y={cy - r/1.4} width="100" height="30" style={{ overflow: 'visible' }}>
                                  <div style={labelStyle}><MathFormula tex={item.label} /></div>
                              </foreignObject>
                          )}
                      </g>
                  );
              }
              case 'polygon': {
                  if (!Array.isArray(item.points)) return null;
                  const pointsStr = item.points.map(p => `${mapX(p.x)},${mapY(p.y)}`).join(' ');
                  return (
                      <g key={key}>
                          <polygon points={pointsStr} fill={item.fill || `${color}20`} stroke={color} strokeWidth="1.5" />
                          {!hideLabels && item.label && item.points[0] && (
                              <text x={mapX(item.points[0].x)} y={mapY(item.points[0].y) - 10} fontSize="10" fill={color} stroke="white" strokeWidth="0.5" paintOrder="stroke">{item.label}</text>
                          )}
                      </g>
                  );
              }
              case 'function': {
                  const pathPoints: string[] = [];
                  const step = (xMax - xMin) / (width / 2);
                  for (let x = xMin; x <= xMax; x += step) {
                      const y = evaluateExpr(item.expr, x);
                      if (isFinite(y) && y >= yMin - (yMax-yMin) && y <= yMax + (yMax-yMin)) {
                          pathPoints.push(`${mapX(x).toFixed(1)},${mapY(y).toFixed(1)}`);
                      }
                  }
                  return (
                      <g key={key}>
                          <polyline points={pathPoints.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeDasharray={item.dashed ? "5 5" : "none"} />
                          {!hideLabels && item.label && (
                              <foreignObject x={width - padding - 60} y={mapY(evaluateExpr(item.expr, xMax - 1))} width="100" height="30" style={{overflow:'visible'}}>
                                  <div style={labelStyle}>
                                      <MathFormula tex={item.label} />
                                  </div>
                              </foreignObject>
                          )}
                      </g>
                  );
              }
              default: return null;
          }
      } catch (e) {
          console.warn("Failed to render geometry item:", item);
          return null;
      }
  };

  // Collect all unique colors to generate markers
  const uniqueColors: string[] = Array.from(new Set(items?.filter(i => i?.color).map(i => i.color || "#3b82f6") || []));
  uniqueColors.push("#64748b"); 

  if (!items || !Array.isArray(items)) return null;

  return (
    <div className="flex flex-col items-center my-6 w-full">
        <div 
            className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mx-auto"
            style={{ 
                width: '100%', 
                maxWidth: width, 
                aspectRatio: `${width}/${height}` 
            }}
        >
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <defs>
                    <marker id="arrow-geo" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
                    </marker>
                    {uniqueColors.map(c => (
                        <marker key={c} id={`arrow-vec-${c.replace('#', '')}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L9,3 z" fill={c} />
                        </marker>
                    ))}
                </defs>

                {gridLines}
                {axisElements}
                
                {items.map((item, idx) => renderItem(item, idx))}
            </svg>
        </div>
        {title && <div className="text-xs text-slate-500 font-medium mt-2 bg-slate-50 px-3 py-1 rounded-full">{title}</div>}
    </div>
  );
};
