import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, SlidersHorizontal, MousePointer2, X, Target, Plus, Minus } from 'lucide-react';
import { MathFormula } from './MathFormula';

// --- Types ---

interface VariableConfig {
  min: number;
  max: number;
  step: number;
  value: number;
  label?: string;
}

interface PlotFunction {
  expr: string;
  color: string;
  label: string;
}

interface AdvancedPlotConfig {
  functions: PlotFunction[];
  variables?: Record<string, VariableConfig>;
  xDomain?: [number, number];
  yDomain?: [number, number];
}

type LegacyFunctionType = 
  | 'linear' | 'quadratic' | 'cubic' | 'sqrt' | 'inverse' 
  | 'exp_growth' | 'exp_decay' | 'log_growth' | 'log_decay' 
  | 'sin' | 'cos' | 'tan' | 'tick' | 'abs';

interface LegacyConfig {
  f: string;
  xDomain: [number, number];
  yDomain: [number, number];
  discontinuityThreshold?: number;
  name?: string;
}

const LEGACY_CONFIGS: Record<LegacyFunctionType, LegacyConfig> = {
  linear: { f: "x", xDomain: [-4, 4], yDomain: [-4, 4], name: "y=x" },
  quadratic: { f: "x * x", xDomain: [-3, 3], yDomain: [-1, 8], name: "y=x^2" },
  cubic: { f: "x * x * x", xDomain: [-2.5, 2.5], yDomain: [-5, 5], name: "y=x^3" },
  sqrt: { f: "Math.sqrt(x)", xDomain: [-1, 9], yDomain: [-2, 4], name: "y=\\sqrt{x}" },
  inverse: { f: "1 / x", xDomain: [-4, 4], yDomain: [-4, 4], discontinuityThreshold: 5, name: "y=x^{-1}" },
  tick: { f: "x + 1/x", xDomain: [-4, 4], yDomain: [-5, 5], discontinuityThreshold: 5, name: "y=x+\\frac{1}{x}" },
  exp_growth: { f: "Math.pow(2, x)", xDomain: [-4, 4], yDomain: [-1, 8], name: "y=2^x" },
  exp_decay: { f: "Math.pow(0.5, x)", xDomain: [-4, 4], yDomain: [-1, 8], name: "y=0.5^x" },
  log_growth: { f: "Math.log2(x)", xDomain: [-1, 8], yDomain: [-4, 4], name: "y=\\log_2x" },
  log_decay: { f: "-Math.log2(x)", xDomain: [-1, 8], yDomain: [-4, 4], name: "y=\\log_{0.5}x" },
  abs: { f: "Math.abs(x)", xDomain: [-4, 4], yDomain: [-1, 5], name: "y=|x|" },
  sin: { f: "Math.sin(x)", xDomain: [-2 * Math.PI, 2 * Math.PI], yDomain: [-1.5, 1.5], name: "y=\\sin x" },
  cos: { f: "Math.cos(x)", xDomain: [-2 * Math.PI, 2 * Math.PI], yDomain: [-1.5, 1.5], name: "y=\\cos x" },
  tan: { f: "Math.tan(x)", xDomain: [-1.5 * Math.PI, 1.5 * Math.PI], yDomain: [-3, 3], discontinuityThreshold: 4, name: "y=\\tan x" },
};

// --- Helper: Safe Evaluator ---
const evaluateExpr = (expr: string, x: number, vars: Record<string, number> = {}) => {
    try {
        const varNames = Object.keys(vars);
        const varValues = Object.values(vars);
        const f = new Function('x', ...varNames, `
            "use strict";
            try {
                return ${expr};
            } catch(e) { return NaN; }
        `);
        return f(x, ...varValues);
    } catch (e) {
        return NaN;
    }
};

// --- Helper: Find Intersections ---
const findIntersections = (funcs: PlotFunction[], xDomain: [number, number], variables: Record<string, number>) => {
    const intersections: { x: number, y: number, fIdx1: number, fIdx2: number }[] = [];
    if (funcs.length < 2) return intersections;

    const [xMin, xMax] = xDomain;
    const step = (xMax - xMin) / 1000; // Increased precision from 300 to 1000

    for (let i = 0; i < funcs.length; i++) {
        for (let j = i + 1; j < funcs.length; j++) {
            let prevDiff = evaluateExpr(funcs[i].expr, xMin, variables) - evaluateExpr(funcs[j].expr, xMin, variables);
            
            for (let x = xMin + step; x <= xMax; x += step) {
                const y1 = evaluateExpr(funcs[i].expr, x, variables);
                const y2 = evaluateExpr(funcs[j].expr, x, variables);
                const diff = y1 - y2;

                if (Math.sign(prevDiff) !== Math.sign(diff) && !isNaN(prevDiff) && !isNaN(diff) && Math.abs(diff - prevDiff) < 10) {
                    // Linear interpolation for approximate root
                    const ratio = Math.abs(prevDiff) / (Math.abs(prevDiff) + Math.abs(diff));
                    const exactX = x - step + ratio * step;
                    const exactY = evaluateExpr(funcs[i].expr, exactX, variables);
                    intersections.push({ x: exactX, y: exactY, fIdx1: i, fIdx2: j });
                }
                prevDiff = diff;
            }
        }
    }
    return intersections;
};

interface FunctionPlotProps {
  type?: string; 
  color?: string; 
  label?: string; 
  config?: AdvancedPlotConfig; 
  onInteract?: (action: string, payload?: any) => void;
  savedState?: any;
}

export const FunctionPlot: React.FC<FunctionPlotProps> = ({ 
    type, 
    color = "blue", 
    label, 
    config: propConfig,
    onInteract,
    savedState
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);
    const plotRef = useRef<HTMLDivElement>(null);
    
    // Check for mobile portrait mode to trigger rotation
    const [isMobilePortrait, setIsMobilePortrait] = useState(false);

    useEffect(() => {
        if (isFullscreen) {
            const checkMobile = () => {
                const isNarrow = window.innerWidth < 768;
                const isPortrait = window.innerHeight > window.innerWidth;
                setIsMobilePortrait(isNarrow && isPortrait);
            };
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        } else {
            setIsMobilePortrait(false);
        }
    }, [isFullscreen]);

    // Normalize Config
    const config: AdvancedPlotConfig = useMemo(() => {
        if (propConfig) return propConfig;
        const legacy = LEGACY_CONFIGS[type as LegacyFunctionType] || LEGACY_CONFIGS.linear;
        return {
            functions: [{ 
                expr: legacy.f, 
                color: color, 
                label: label || legacy.name || "f(x)" 
            }],
            xDomain: legacy.xDomain,
            yDomain: legacy.yDomain
        };
    }, [type, color, label, propConfig]);

    // Variable State
    const initialVars = useMemo(() => {
        const vars: Record<string, number> = {};
        if (config.variables) {
            Object.entries(config.variables).forEach(([k, v]) => {
                vars[k] = v.value;
            });
        }
        return vars;
    }, [config.variables]);

    const [variables, setVariables] = useState<Record<string, number>>(() => ({
        ...initialVars,
        ...(savedState?.variables || {})
    }));

    const handleVarChange = (key: string, val: number) => {
        const newVars = { ...variables, [key]: val };
        setVariables(newVars);
        onInteract?.('update_state', { state: { variables: newVars } });
    };

    // Calculate Intersections (Memoized)
    const intersections = useMemo(() => {
        if (!config.functions || config.functions.length < 2) return [];
        return findIntersections(config.functions, config.xDomain || [-5, 5], variables);
    }, [config.functions, config.xDomain, variables]);

    // Helper for coordinate mapping
    const getMap = (width: number, height: number) => {
        const padding = 30;
        const [xMin, xMax] = config.xDomain || [-5, 5];
        const [yMin, yMax] = config.yDomain || [-5, 5];
        return {
            mapX: (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding),
            mapY: (y: number) => height - (padding + ((y - yMin) / (yMax - yMin)) * (height - 2 * padding))
        };
    };

    // --- Drawing Logic ---
    const drawPlot = (width: number, height: number, isDark: boolean) => {
        const { mapX, mapY } = getMap(width, height);
        const padding = 30;

        const colorMap: Record<string, string> = {
            blue: "#3b82f6", red: "#ef4444", emerald: "#10b981", purple: "#8b5cf6",
            orange: "#f97316", indigo: "#6366f1", pink: "#ec4899", gray: "#64748b"
        };

        const axisColor = isDark ? "#475569" : "#cbd5e1";
        const textColor = isDark ? "#94a3b8" : "#64748b";
        const gridColor = isDark ? "#e2e8f0" : "#f1f5f9"; 

        const [xMin, xMax] = config.xDomain || [-5, 5];

        // Paths
        const paths = config.functions.map((func, idx) => {
            const points: string[] = [];
            const step = (xMax - xMin) / (width * 1.5);
            let isDrawing = false;
            
            for (let x = xMin; x <= xMax; x += step) {
                const y = evaluateExpr(func.expr, x, variables);
                if (!isFinite(y)) {
                    isDrawing = false;
                    continue;
                }
                const svgX = mapX(x);
                const svgY = mapY(y);
                if (svgY < -height || svgY > height * 2) {
                    isDrawing = false;
                    continue;
                }
                if (!isDrawing) {
                    points.push(`M ${svgX.toFixed(1)} ${svgY.toFixed(1)}`);
                    isDrawing = true;
                } else {
                    points.push(`L ${svgX.toFixed(1)} ${svgY.toFixed(1)}`);
                }
            }
            return {
                d: points.join(' '),
                stroke: colorMap[func.color] || func.color || "#3b82f6",
                label: func.label
            };
        });

        const originX = mapX(0);
        const originY = mapY(0);

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <pattern id={`grid-${isDark ? 'dark' : 'light'}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={gridColor} strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${isDark ? 'dark' : 'light'})`} />

                {/* Axes */}
                {originY >= 0 && originY <= height && (
                    <line x1={padding} y1={originY} x2={width-padding} y2={originY} stroke={axisColor} strokeWidth="1.5" />
                )}
                {originX >= 0 && originX <= width && (
                    <line x1={originX} y1={height-padding} x2={originX} y2={padding} stroke={axisColor} strokeWidth="1.5" />
                )}

                <text x={width - 15} y={originY + 15} fontSize="10" fill={textColor} fontWeight="bold">x</text>
                <text x={originX + 8} y={15} fontSize="10" fill={textColor} fontWeight="bold">y</text>
                <text x={originX - 12} y={originY + 12} fontSize="10" fill={textColor}>0</text>

                {paths.map((p, i) => (
                    <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                ))}
            </svg>
        );
    };

    // --- Interactive State ---
    
    // Snapping Logic
    const activeState = useMemo(() => {
        if (!mousePos || !isFullscreen || isMobilePortrait) return null; // Disable snapping in rotated mobile view for simplicity
        
        const width = window.innerWidth - 300; 
        const height = window.innerHeight;
        const padding = 30; // Matches getMap padding
        const [xMin, xMax] = config.xDomain || [-5, 5];
        const plotWidth = width - 2 * padding;
        
        const { mapX, mapY } = getMap(width, height);

        // 1. Calculate raw math X from mouse X
        let mathX = xMin + ((mousePos.x - padding) / plotWidth) * (xMax - xMin);
        mathX = Math.max(xMin, Math.min(xMax, mathX));

        let snappedIntersection = null;
        let intersectionScreenY = 0;

        // 2. Check for snapping to intersections
        for (const pt of intersections) {
            const screenX = mapX(pt.x);
            if (Math.abs(mousePos.x - screenX) < 10) { // Increased snap threshold slightly
                mathX = pt.x;
                snappedIntersection = pt;
                intersectionScreenY = mapY(pt.y);
                break;
            }
        }

        // Calculate screen X for the current mathX (snapped or unsnapped)
        const screenX = mapX(mathX);

        // 3. Compute values
        return {
            x: mathX,
            screenX, // Use this for visualization positioning
            intersection: snappedIntersection,
            intersectionScreenY,
            ys: config.functions.map(f => ({
                label: f.label,
                val: evaluateExpr(f.expr, mathX, variables),
                color: f.color
            }))
        };
    }, [mousePos, isFullscreen, config, variables, intersections, isMobilePortrait]);

    // Styles for rotated container
    const rotatedContainerStyle: React.CSSProperties = isMobilePortrait ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vh',
        height: '100vw',
        transform: 'rotate(90deg)',
        transformOrigin: 'top left',
        marginLeft: '100vw', // Shift to bring back into view after rotation
        zIndex: 105,
        background: 'white',
        overflow: 'hidden'
    } : {
        flex: 1,
        position: 'relative',
        cursor: 'crosshair',
        overflow: 'hidden'
    };

    const plotWidth = isMobilePortrait ? window.innerHeight : (isFullscreen ? window.innerWidth - 300 : 400);
    const plotHeight = isMobilePortrait ? window.innerWidth : (isFullscreen ? window.innerHeight : 250);

    return (
        <>
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-white flex text-slate-800 font-sans">
                    {/* Main Plot Area */}
                    <div 
                        style={rotatedContainerStyle}
                        className={!isMobilePortrait ? "flex-1 relative cursor-crosshair overflow-hidden" : ""}
                        onMouseMove={(e) => {
                            if (isMobilePortrait) return; // Disable hover on rotated
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                        }}
                        onMouseLeave={() => setMousePos(null)}
                    >
                        <div className="absolute inset-0">
                            {drawPlot(plotWidth, plotHeight, false)}
                        </div>
                        
                        <button 
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-slate-100 rounded-full text-slate-600 shadow-sm border border-slate-200 transition-colors z-20"
                        >
                            <Minimize2 className="w-6 h-6" />
                        </button>

                        {/* Crosshair & Tooltip (Disabled on Mobile Rotated View) */}
                        {activeState && mousePos && !isMobilePortrait && (
                            <>
                                <div 
                                    className="absolute top-0 bottom-0 w-px bg-slate-400 pointer-events-none border-l border-dashed border-slate-400" 
                                    style={{ left: activeState.screenX }} 
                                />
                                <div 
                                    className="absolute top-16 left-4 bg-white/95 border border-slate-200 p-4 rounded-xl text-sm shadow-xl backdrop-blur pointer-events-none min-w-[200px]"
                                >
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                                        <MathFormula tex={`x = ${activeState.x.toFixed(3)}`} className="font-mono text-slate-500 font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        {activeState.ys.map((v, i) => (
                                            <div key={i} className={`flex items-center justify-between gap-3 font-mono ${activeState.intersection && (i === activeState.intersection.fIdx1 || i === activeState.intersection.fIdx2) ? 'bg-amber-50 rounded px-1 -mx-1' : ''}`}>
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className={`w-2 h-2 rounded-full bg-${v.color}-500 shrink-0`}></div>
                                                    <div className="opacity-80 text-xs text-slate-500 truncate max-w-[120px]">
                                                        {v.label.startsWith('y=') || v.label.includes('\\') || v.label.includes('f') ? <MathFormula tex={v.label} /> : v.label}
                                                    </div>
                                                </div>
                                                <span className="font-bold text-slate-700">{v.val.toFixed(3)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {activeState.intersection && (
                                    <>
                                        <div 
                                            className="absolute w-3 h-3 rounded-full border-2 border-amber-500 bg-white -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 shadow-sm"
                                            style={{ 
                                                left: activeState.screenX, 
                                                top: activeState.intersectionScreenY 
                                            }}
                                        />
                                        <div 
                                            className="absolute z-20 px-2 py-1.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl transform -translate-x-1/2 -translate-y-full mt-[-10px] whitespace-nowrap pointer-events-none"
                                            style={{ 
                                                left: activeState.screenX, 
                                                top: activeState.intersectionScreenY 
                                            }}
                                        >
                                            <div className="flex items-center gap-1 font-mono font-bold">
                                                <Target className="w-3 h-3 text-amber-400" />
                                                <span>({activeState.intersection.x.toFixed(3)}, {activeState.intersection.y.toFixed(3)})</span>
                                            </div>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar Controls (Hidden on Mobile Fullscreen) */}
                    {!isMobilePortrait && (
                        <div className="w-[300px] bg-slate-50 border-l border-slate-200 p-6 overflow-y-auto shrink-0 shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.05)]">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800">
                                <SlidersHorizontal className="w-5 h-5 text-primary-500" />
                                参数控制
                            </h3>
                            
                            {config.variables && Object.keys(config.variables).length > 0 ? (
                                <div className="space-y-8">
                                    {Object.entries(config.variables).map(([key, conf]) => (
                                        <div key={key}>
                                            <div className="flex justify-between mb-3 text-sm">
                                                <span className="font-bold text-slate-700">
                                                    {conf.label || key}
                                                </span>
                                                <span className="font-mono text-primary-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm min-w-[60px] text-center">
                                                    {key}={variables[key].toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => handleVarChange(key, Math.max(conf.min, variables[key] - (conf.step||0.1)))}
                                                    className="p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <input 
                                                    type="range"
                                                    min={conf.min}
                                                    max={conf.max}
                                                    step={conf.step || 0.1}
                                                    value={variables[key]}
                                                    onChange={(e) => handleVarChange(key, parseFloat(e.target.value))}
                                                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600 min-w-0"
                                                />
                                                <button 
                                                    onClick={() => handleVarChange(key, Math.min(conf.max, variables[key] + (conf.step||0.1)))}
                                                    className="p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono px-8">
                                                <span>{conf.min}</span>
                                                <span>{conf.max}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-slate-400 text-sm text-center py-10 bg-white rounded-xl border border-slate-100 border-dashed">
                                    当前图像无动态参数
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">当前函数</h4>
                                <div className="space-y-3">
                                    {config.functions.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                            <div className={`w-3 h-3 rounded-full shrink-0 bg-${f.color}-500 ring-2 ring-white shadow-sm`}></div>
                                            <MathFormula tex={f.label} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Inline (Normal) View */}
            <div className="flex flex-col items-center my-6 w-full group">
                <div className="relative w-full aspect-[16/10] md:aspect-[2/1] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-primary-200 transition-all">
                    {/* Plot Canvas */}
                    <div className="absolute inset-0 p-2">
                        {drawPlot(400, 250, false)}
                    </div>

                    {/* Fullscreen Button */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => setIsFullscreen(true)}
                            className="p-1.5 bg-white text-slate-600 rounded-lg shadow-sm border border-slate-200 hover:text-primary-600 hover:border-primary-200 transition-all"
                            title="全屏查看与探索"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* External Legend */}
                <div className="mt-3 flex flex-wrap justify-center gap-4">
                    {config.functions.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                            <div className={`w-2.5 h-2.5 rounded-full bg-${f.color}-500 shrink-0`}></div>
                            <MathFormula tex={f.label} className="text-slate-700 font-medium" />
                        </div>
                    ))}
                </div>

                {/* External Controls (Moved outside image) */}
                {config.variables && Object.keys(config.variables).length > 0 && (
                    <div className="w-full mt-4 bg-slate-50 border border-slate-100 rounded-xl p-4 grid gap-3 grid-cols-1">
                         {Object.entries(config.variables).slice(0, 4).map(([key, conf]) => (
                             <div key={key} className="flex items-center gap-3 text-xs bg-white p-2 rounded-lg border border-slate-100 shadow-sm min-w-0">
                                 <span className="font-bold w-6 text-center text-slate-600 shrink-0">{key}</span>
                                 <input 
                                    type="range"
                                    min={conf.min}
                                    max={conf.max}
                                    step={conf.step}
                                    value={variables[key]}
                                    onChange={(e) => handleVarChange(key, parseFloat(e.target.value))}
                                    className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600 min-w-0"
                                 />
                                 <span className="w-8 text-right font-mono text-primary-600 font-bold shrink-0">{variables[key]}</span>
                             </div>
                         ))}
                         {Object.keys(config.variables).length > 4 && (
                             <button onClick={() => setIsFullscreen(true)} className="text-xs text-primary-600 flex items-center justify-center gap-1 hover:underline sm:col-span-2">
                                 查看更多参数 <Maximize2 className="w-3 h-3" />
                             </button>
                         )}
                    </div>
                )}
            </div>
        </>
    );
};