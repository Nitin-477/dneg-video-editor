import React from 'react';

interface SegmentResizerProps {
    position: 'left' | 'right';
    onResizeStart: (e: React.MouseEvent) => void;
    isActive?: boolean;
}

export const SegmentResizer: React.FC<SegmentResizerProps> = ({
    position,
    onResizeStart,
    isActive = false,
}) => {
    return (
        <div
            className={`segment-resizer segment-resizer-${position}`}
            style={{
                position: 'absolute',
                [position]: 0,
                top: 0,
                width: '10px',
                height: '100%',
                cursor: 'ew-resize',
                backgroundColor: isActive ? '#2196F3' : 'transparent',
                transition: 'background-color 0.2s ease',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onMouseDown={onResizeStart}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2196F3';
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
            }}
        >
            <div
                style={{
                    width: '3px',
                    height: '30px',
                    backgroundColor: 'white',
                    borderRadius: '2px',
                    opacity: isActive ? 1 : 0.5,
                }}
            />
        </div>
    );
};
