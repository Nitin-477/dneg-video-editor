import React from 'react';
import { useEditor } from '../../store/EditorContext';

export const ZoomControls: React.FC = () => {
    const { state, dispatch } = useEditor();

    const handleZoomIn = () => {
        dispatch({ type: 'SET_ZOOM', payload: state.zoom * 1.2 });
    };

    const handleZoomOut = () => {
        dispatch({ type: 'SET_ZOOM', payload: state.zoom / 1.2 });
    };

    const handleAutoFit = () => {
        const totalDuration = state.segments.reduce((sum, seg) => sum + seg.duration, 0);
        if (totalDuration === 0) return;

        const containerWidth = 800;
        const optimalZoom = containerWidth / (totalDuration * 50);
        dispatch({ type: 'SET_ZOOM', payload: Math.min(Math.max(optimalZoom, 0.2), 2) });
    };

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
                onClick={handleZoomOut}
                style={{
                    padding: '6px 12px',
                    backgroundColor: '#3a3a3a',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                }}
            >
                −
            </button>

            <button
                onClick={handleZoomIn}
                style={{
                    padding: '6px 12px',
                    backgroundColor: '#3a3a3a',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                }}
            >
                +
            </button>

            <button
                onClick={handleAutoFit}
                style={{
                    padding: '6px 12px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                }}
            >
                Fit
            </button>

            <span style={{ color: '#999', fontSize: '11px', minWidth: '50px' }}>
                {(state.zoom * 100).toFixed(0)}%
            </span>
        </div>
    );
};
