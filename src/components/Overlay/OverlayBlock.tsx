import React from 'react';
import { Overlay } from '../../types/editor.types';
import { useEditor } from '../../store/EditorContext';

interface OverlayBlockProps {
    overlay: Overlay;
    pixelsPerSecond: number;
}

export const OverlayBlock: React.FC<OverlayBlockProps> = ({ overlay, pixelsPerSecond }) => {
    const { state, dispatch } = useEditor();

    const firstSegment = state.segments.find(s => overlay.segmentIds.includes(s.id));
    if (!firstSegment) return null;

    const left = (firstSegment.startTime + overlay.startTime) * pixelsPerSecond;
    const width = overlay.duration * pixelsPerSecond;

    return (
        <div
            style={{
                position: 'absolute',
                left: `${left}px`,
                top: '5px',
                width: `${width}px`,
                height: '30px',
                backgroundColor: '#FF9800',
                border: state.selectedOverlayId === overlay.id ? '2px solid #2196F3' : '1px solid #333',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                color: 'white',
                fontSize: '11px',
                cursor: 'pointer',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            }}
            onClick={() => dispatch({ type: 'SELECT_OVERLAY', payload: overlay.id })}
        >
            {overlay.text || `Overlay ${overlay.id}`}
        </div>
    );
};
