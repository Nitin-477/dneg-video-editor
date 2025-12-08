import React, { useRef, useState, useCallback, ReactNode } from 'react';

interface DraggableItemProps {
    children: ReactNode;
    onDragStart?: (e: MouseEvent) => void;
    onDrag?: (deltaX: number, deltaY: number, e: MouseEvent) => void;
    onDragEnd?: (totalDeltaX: number, totalDeltaY: number) => void;
    axis?: 'x' | 'y' | 'both';
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
    children,
    onDragStart,
    onDrag,
    onDragEnd,
    axis = 'both',
    disabled = false,
    className = '',
    style = {},
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const totalDelta = useRef({ x: 0, y: 0 });
    const elementRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (disabled) return;

        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        totalDelta.current = { x: 0, y: 0 };

        onDragStart?.(e.nativeEvent);

        const handleMouseMove = (moveE: MouseEvent) => {
            let deltaX = moveE.clientX - startPos.current.x;
            let deltaY = moveE.clientY - startPos.current.y;

            if (axis === 'x') deltaY = 0;
            if (axis === 'y') deltaX = 0;

            totalDelta.current = { x: deltaX, y: deltaY };
            onDrag?.(deltaX, deltaY, moveE);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            onDragEnd?.(totalDelta.current.x, totalDelta.current.y);

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [disabled, axis, onDragStart, onDrag, onDragEnd]);

    return (
        <div
            ref={elementRef}
            className={`draggable-item ${className} ${isDragging ? 'dragging' : ''}`}
            style={{
                ...style,
                cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
};
