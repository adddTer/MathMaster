
import React, { useState, useEffect, useRef } from 'react';
import { Rotate3d, Move, Maximize2 } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  start: number; // index of start point
  end: number;   // index of end point
  dashed?: boolean;
}

interface SolidShape {
  vertices: Point3D[];
  edges: Edge[];
  faces?: number[][]; // indices of vertices forming a face (for future shading)
}

interface SolidGeometryProps {
  type: 'cube' | 'tetrahedron' | 'prism' | 'pyramid' | 'cylinder_wire';
  width?: number;
  height?: number;
  label?: string;
  autoRotate?: boolean;
}

// Basic Shape Definitions
const SHAPES: Record<string, SolidShape> = {
  cube: {
    vertices: [
      {x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1}, // Back face
      {x: -1, y: -1, z: 1}, {x: 1, y: -1, z: 1}, {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1}    // Front face
    ],
    edges: [
      {start:0, end:1, dashed: true}, {start:1, end:2}, {start:2, end:3}, {start:3, end:0, dashed: true}, // Back
      {start:4, end:5}, {start:5, end:6}, {start:6, end:7}, {start:7, end:4}, // Front
      {start:0, end:4, dashed: true}, {start:1, end:5}, {start:2, end:6}, {start:3, end:7} // Connecting
    ]
  },
  tetrahedron: {
    vertices: [
      {x: 0, y: -1, z: 0}, // Top
      {x: -1, y: 1, z: -1}, // Base L
      {x: 1, y: 1, z: -1},  // Base R
      {x: 0, y: 1, z: 1}    // Base Front
    ],
    edges: [
      {start: 0, end: 1}, {start: 0, end: 2}, {start: 0, end: 3},
      {start: 1, end: 2, dashed: true}, {start: 2, end: 3}, {start: 3, end: 1}
    ]
  },
  prism: { // Triangular prism
    vertices: [
      {x: -0.8, y: -1, z: -0.5}, {x: 0.8, y: -1, z: -0.5}, {x: 0, y: -1, z: 0.8}, // Top
      {x: -0.8, y: 1, z: -0.5}, {x: 0.8, y: 1, z: -0.5}, {x: 0, y: 1, z: 0.8}     // Bottom
    ],
    edges: [
      {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 0}, // Top
      {start: 3, end: 4, dashed: true}, {start: 4, end: 5}, {start: 5, end: 3, dashed: true}, // Bottom
      {start: 0, end: 3, dashed: true}, {start: 1, end: 4}, {start: 2, end: 5} // Pillars
    ]
  },
  pyramid: { // Square pyramid
    vertices: [
        {x: 0, y: -1, z: 0}, // Apex
        {x: -1, y: 1, z: -1}, {x: 1, y: 1, z: -1}, {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1} // Base
    ],
    edges: [
        {start: 0, end: 1}, {start: 0, end: 2}, {start: 0, end: 3}, {start: 0, end: 4},
        {start: 1, end: 2, dashed: true}, {start: 2, end: 3}, {start: 3, end: 4}, {start: 4, end: 1, dashed: true}
    ]
  },
  cylinder_wire: {
      // Approximate cylinder with two octagons and lines
      vertices: [
          // Top Circle
          {x: 1, y: -1, z: 0}, {x: 0.7, y: -1, z: 0.7}, {x: 0, y: -1, z: 1}, {x: -0.7, y: -1, z: 0.7},
          {x: -1, y: -1, z: 0}, {x: -0.7, y: -1, z: -0.7}, {x: 0, y: -1, z: -1}, {x: 0.7, y: -1, z: -0.7},
          // Bottom Circle
          {x: 1, y: 1, z: 0}, {x: 0.7, y: 1, z: 0.7}, {x: 0, y: 1, z: 1}, {x: -0.7, y: 1, z: 0.7},
          {x: -1, y: 1, z: 0}, {x: -0.7, y: 1, z: -0.7}, {x: 0, y: 1, z: -1}, {x: 0.7, y: 1, z: -0.7},
      ],
      edges: [
          // Top Loop
          {start:0, end:1}, {start:1, end:2}, {start:2, end:3}, {start:3, end:4}, {start:4, end:5}, {start:5, end:6}, {start:6, end:7}, {start:7, end:0},
          // Bottom Loop - removed dashed: true from last segment for cleaner wireframe
          {start:8, end:9}, {start:9, end:10}, {start:10, end:11}, {start:11, end:12}, {start:12, end:13}, {start:13, end:14}, {start:14, end:15}, {start:15, end:8},
          // Sides (Generatrices)
          {start:0, end:8}, {start:4, end:12}, {start:2, end:10}, {start:6, end:14}
      ]
  }
};

export const SolidGeometry: React.FC<SolidGeometryProps> = ({ 
  type, 
  width = 300, 
  height = 300,
  label,
  autoRotate = false
}) => {
  const [rotation, setRotation] = useState({ x: -0.3, y: 0.5 }); // Initial slight tilt
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  const shape = SHAPES[type] || SHAPES.cube;

  // Auto Rotation Effect
  useEffect(() => {
      if (autoRotate && !isDragging) {
          const animate = (_time: number) => {
              setRotation(prev => ({ ...prev, y: prev.y + 0.005 }));
              animationRef.current = requestAnimationFrame(animate);
          };
          animationRef.current = requestAnimationFrame(animate);
          return () => {
              if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
          };
      }
  }, [autoRotate, isDragging]);

  // Projection Logic
  const project = (p: Point3D, rotX: number, rotY: number) => {
      // 1. Rotation Matrix Y
      let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
      let z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);
      
      // 2. Rotation Matrix X
      let y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);

      // 3. Perspective Projection (Weak)
      // Map x, y to SVG coordinates. z is depth.
      // Scale factor
      const scale = width / 3.5; 
      
      return {
          x: x1 * scale + width / 2,
          y: y2 * scale + height / 2,
          z: z2 // Keep z for future depth sorting if needed
      };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      setRotation(prev => ({
          x: prev.x + deltaY * 0.01,
          y: prev.y + deltaX * 0.01
      }));
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };

  if (!shape || !shape.vertices) return null;

  // Render
  const projectedVertices = shape.vertices.map(v => project(v, rotation.x, rotation.y));

  return (
    <div className="flex flex-col items-center my-6 w-full">
        <div 
            className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-move touch-none mx-auto"
            style={{ 
                width: '100%', 
                maxWidth: width, 
                aspectRatio: `${width}/${height}` 
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="absolute top-2 right-2 text-slate-300">
                <Rotate3d className="w-5 h-5" />
            </div>
            
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full pointer-events-none">
                {/* Edges */}
                {shape.edges.map((edge, i) => {
                    const start = projectedVertices[edge.start];
                    const end = projectedVertices[edge.end];
                    
                    if (!start || !end) return null;

                    return (
                        <line 
                            key={i}
                            x1={start.x} y1={start.y}
                            x2={end.x} y2={end.y}
                            stroke={edge.dashed ? "#94a3b8" : "#3b82f6"} // slate-400 or blue-500
                            strokeWidth={edge.dashed ? 1.5 : 2}
                            strokeDasharray={edge.dashed ? "4 4" : "none"}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    );
                })}
                
                {/* Vertices (Optional: Dots) */}
                {projectedVertices.map((v, i) => (
                    <circle key={i} cx={v.x} cy={v.y} r={3} fill="#64748b" />
                ))}
            </svg>
        </div>
        {label && <div className="text-xs text-slate-500 font-medium mt-2 bg-slate-50 px-3 py-1 rounded-full">{label}</div>}
    </div>
  );
};
