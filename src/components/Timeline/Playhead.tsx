import React, { useRef } from 'react';
import { useEditor } from '../../store/EditorContext';

interface PlayheadProps {
    currentTime: number;
    pixelsPerSecond: number;
}

export const Playhead: React.FC<PlayheadProps> = ({ currentTime, pixelsPerSecond }) => {
    const { dispatch } = useEditor();
    const isDragging = useRef(false);

    const position = currentTime * pixelsPerSecond;

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        isDragging.current = true;

        const handleMouseMove = (moveE: MouseEvent) => {
            if (!isDragging.current) return;

            const timeline = document.querySelector('.timeline-container');
            if (!timeline) return;

            const rect = timeline.getBoundingClientRect();
            const x = moveE.clientX - rect.left;
            const newTime = Math.max(0, x / pixelsPerSecond);

            dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position}px`,
                top: 0,
                width: '2px',
                height: '100%',
                backgroundColor: '#FF4444',
                zIndex: 100,
                cursor: 'ew-resize',
            }}
            onMouseDown={handleMouseDown}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '-6px',
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#FF4444',
                    borderRadius: '50%',
                    border: '2px solid white',
                }}
            />
        </div>
    );
};
