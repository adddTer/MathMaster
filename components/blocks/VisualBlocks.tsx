import React from 'react';
import { FunctionPlot } from '../../components/FunctionPlot';
import { SolidGeometry } from '../../components/SolidGeometry';
import { ComplexPlane } from '../../components/ComplexPlane';
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
    return <ComplexPlane {...data} />;
};

export const GeometryBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::solid_geometry\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return <SolidGeometry {...data} />;
};
