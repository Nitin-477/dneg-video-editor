import React, { ReactNode } from 'react';

interface ResizableItemProps {
    children: ReactNode;
    width: number;
    onResize?: (newWidth: number, edge: 'left' | 'right') => void;
    onResizeEnd?: (finalWidth: number) => void;
    minWidth?: number;
    maxWidth?: number;
    showLeftHandle?: boolean;
    showRightHandle?: boolean;
    style?: React.CSSProperties;
}

export const ResizableItem: React.FC<ResizableItemProps> = ({
    children,
    width,
    onResize,
    onResizeEnd,
    minWidth = 50,
    maxWidth = Infinity,
    showLeftHandle = true,
    showRightHandle = true,
    style = {},
}) => {
    const handleResizeStart = (e: React.MouseEvent, edge: 'left' | 'right') => {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startWidth = width;

        const handleMouseMove = (moveE: MouseEvent) => {
            const deltaX = moveE.clientX - startX;
            let newWidth = startWidth;

            if (edge === 'right') {
                newWidth = startWidth + deltaX;
            } else {
                newWidth = startWidth - deltaX;
            }
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

            onResize?.(newWidth, edge);
        };

        const handleMouseUp = () => {
            onResizeEnd?.(width);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className="resizable-item"
            style={{
                position: 'relative',
                width: `${width}px`,
                ...style,
            }}
        >
            {showLeftHandle && (
                <div
                    className="resize-handle resize-handle-left"
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '8px',
                        height: '100%',
                        cursor: 'ew-resize',
                        backgroundColor: 'transparent',
                        zIndex: 10,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, 'left')}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(33, 150, 243, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                />
            )}

            {children}

            {showRightHandle && (
                <div
                    className="resize-handle resize-handle-right"
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '8px',
                        height: '100%',
                        cursor: 'ew-resize',
                        backgroundColor: 'transparent',
                        zIndex: 10,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, 'right')}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(33, 150, 243, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                />
            )}
        </div>
    );
};
