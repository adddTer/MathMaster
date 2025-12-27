
import React from 'react';
import { FunctionPlot } from '../../components/FunctionPlot';
import { SolidGeometry } from '../../components/SolidGeometry';
import { PlanarGeometry, GeometryItem } from '../../components/PlanarGeometry';
import { ChartComponent } from '../../components/ChartComponent';
import { safeParseJSON, ErrorBlock } from './utils';

export const PlotBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::plot\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const props: any = {};
    if (data.functions) {
        props.config = data;
    } else if (data.type) {
        props.type = data.type;
        props.color = data.color;
        props.label = data.label;
    }
    return (
        <div className="my-4 w-full">
             <FunctionPlot 
                {...props} 
                onInteract={onInteract} 
                savedState={savedState} 
             />
        </div>
    );
};

export const ChartBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::chart\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return <ChartComponent {...data} />;
};

export const ComplexBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::complex_plane\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    
    // Adapter: Convert old ComplexPlane data to new PlanarGeometry items
    const items: GeometryItem[] = [];
    
    if (data.showUnitCircle) {
        items.push({ type: 'circle', center: {x:0, y:0}, radius: 1, dashed: true, color: '#cbd5e1' });
    }

    if (Array.isArray(data.points)) {
        data.points.forEach((pt: any) => {
            const color = pt.color || '#3b82f6';
            // Vector
            if (pt.showVector) {
                items.push({ 
                    type: 'vector', 
                    start: {x:0, y:0}, 
                    end: {x: pt.x, y: pt.y}, 
                    color: color 
                });
            }
            // Point
            items.push({ 
                type: 'point', 
                x: pt.x, 
                y: pt.y, 
                label: pt.label, 
                color: color 
            });
            // Components (Dashed lines)
            if (pt.showComponents) {
                items.push({ type: 'line', start: {x: pt.x, y: pt.y}, end: {x: pt.x, y: 0}, dashed: true, color: color });
                items.push({ type: 'line', start: {x: pt.x, y: pt.y}, end: {x: 0, y: pt.y}, dashed: true, color: color });
            }
        });
    }

    const range = data.range || 5;

    return (
        <PlanarGeometry 
            items={items}
            xDomain={[-range, range]}
            yDomain={[-range, range]}
            axisLabels={['Re', 'Im']}
            title={data.label}
            width={300}
            height={300}
        />
    );
};

export const PlanarBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::planar_geometry\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    
    return <PlanarGeometry {...data} />;
};

export const GeometryBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::solid_geometry\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return <SolidGeometry {...data} />;
};
