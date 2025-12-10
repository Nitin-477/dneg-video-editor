import React from 'react';
import { useEditor } from '../../store/EditorContext';
import { OverlayBlock } from '../Overlay/OverlayBlock';

interface OverlayTrackProps {
    pixelsPerSecond: number;
}

export const OverlayTrack: React.FC<OverlayTrackProps> = ({ pixelsPerSecond }) => {
    const { state } = useEditor();
    const totalDuration = state.segments.reduce((sum, seg) => sum + seg.duration, 0);
    const timelineWidth = Math.max(800, totalDuration * pixelsPerSecond);

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '50px',
                backgroundColor: '#2a2a2a',
                borderRadius: '4px',
                border: '1px solid #333',
                overflow: 'auto',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: `${timelineWidth}px`,
                    height: '100%',
                    minWidth: '100%',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '5px',
                        color: '#999',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                >
                    Overlays
                </div>

                {state.overlays.map(overlay => (
                    <OverlayBlock
                        key={overlay.id}
                        overlay={overlay}
                        pixelsPerSecond={pixelsPerSecond}
                    />
                ))}
            </div>
        </div>
    );
};
