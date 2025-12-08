import React, { useRef, useState } from 'react';
import { Overlay } from '../../types/editor.types';
import { useEditor } from '../../store/EditorContext';

interface OverlayDisplayProps {
    overlay: Overlay;
}

export const OverlayDisplay: React.FC<OverlayDisplayProps> = ({ overlay }) => {
    const { dispatch } = useEditor();
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const startOverlayPos = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        startOverlayPos.current = { x: overlay.x, y: overlay.y };

        const handleMouseMove = (moveE: MouseEvent) => {
            if (!containerRef.current?.parentElement) return;

            const parent = containerRef.current.parentElement;
            const deltaX = moveE.clientX - startPos.current.x;
            const deltaY = moveE.clientY - startPos.current.y;

            const relDeltaX = deltaX / parent.clientWidth;
            const relDeltaY = deltaY / parent.clientHeight;

            let newX = startOverlayPos.current.x + relDeltaX;
            let newY = startOverlayPos.current.y + relDeltaY;

            newX = Math.max(0, Math.min(1 - overlay.width, newX));
            newY = Math.max(0, Math.min(1 - overlay.height, newY));

            dispatch({
                type: 'UPDATE_OVERLAY',
                payload: { id: overlay.id, updates: { x: newX, y: newY } },
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                left: `${overlay.x * 100}%`,
                top: `${overlay.y * 100}%`,
                width: `${overlay.width * 100}%`,
                height: `${overlay.height * 100}%`,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                transition: isDragging ? 'none' : 'all 0.2s ease',
                zIndex: isDragging ? 1000 : 100,
            }}
            onMouseDown={handleMouseDown}
        >
            {overlay.text}
        </div>
    );
};
