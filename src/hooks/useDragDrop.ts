import { useRef, useState, useCallback, useEffect } from 'react';

interface DragOptions {
    onDragStart?: (e: MouseEvent) => void;
    onDrag?: (deltaX: number, deltaY: number, e: MouseEvent) => void;
    onDragEnd?: (totalDeltaX: number, totalDeltaY: number) => void;
    axis?: 'x' | 'y' | 'both';
    disabled?: boolean;
    snapGrid?: number;
}

export const useDragDrop = (options: DragOptions) => {
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const totalDelta = useRef({ x: 0, y: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (options.disabled) return;

        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        totalDelta.current = { x: 0, y: 0 };

        options.onDragStart?.(e.nativeEvent);
    }, [options]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        let deltaX = e.clientX - startPos.current.x;
        let deltaY = e.clientY - startPos.current.y;

        // Apply axis constraints
        if (options.axis === 'x') deltaY = 0;
        if (options.axis === 'y') deltaX = 0;

        if (options.snapGrid) {
            deltaX = Math.round(deltaX / options.snapGrid) * options.snapGrid;
            deltaY = Math.round(deltaY / options.snapGrid) * options.snapGrid;
        }

        totalDelta.current = { x: deltaX, y: deltaY };
        options.onDrag?.(deltaX, deltaY, e);
    }, [isDragging, options]);

    const handleMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        options.onDragEnd?.(totalDelta.current.x, totalDelta.current.y);
    }, [isDragging, options]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return {
        isDragging,
        handleMouseDown,
    };
};
