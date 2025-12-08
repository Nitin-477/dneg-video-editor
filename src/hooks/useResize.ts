import { useRef, useState, useCallback } from 'react';

interface ResizeOptions {
    minWidth?: number;
    maxWidth?: number;
    onResize?: (newWidth: number) => void;
    onResizeEnd?: (finalWidth: number) => void;
    snapGrid?: number;
}

export const useResize = (options: ResizeOptions = {}) => {
    const [isResizing, setIsResizing] = useState(false);
    const startWidth = useRef(0);
    const startX = useRef(0);

    const handleResizeStart = useCallback((e: React.MouseEvent, initialWidth: number) => {
        e.stopPropagation();
        e.preventDefault();

        setIsResizing(true);
        startWidth.current = initialWidth;
        startX.current = e.clientX;

        const handleMouseMove = (moveE: MouseEvent) => {
            const deltaX = moveE.clientX - startX.current;
            let newWidth = startWidth.current + deltaX;

            if (options.minWidth !== undefined) {
                newWidth = Math.max(options.minWidth, newWidth);
            }
            if (options.maxWidth !== undefined) {
                newWidth = Math.min(options.maxWidth, newWidth);
            }

            if (options.snapGrid) {
                newWidth = Math.round(newWidth / options.snapGrid) * options.snapGrid;
            }

            options.onResize?.(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            const finalWidth = startWidth.current;
            options.onResizeEnd?.(finalWidth);

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [options]);

    return {
        isResizing,
        handleResizeStart,
    };
};
