import React, { useState } from 'react';
import { Segment } from '../../types/editor.types';
import { useEditor } from '../../store/EditorContext';
import { DraggableItem } from '../shared/DraggableItem';
import { SegmentResizer } from './SegmentResizer';

interface SegmentBlockProps {
    segment: Segment;
    pixelsPerSecond: number;
}

export const SegmentBlock: React.FC<SegmentBlockProps> = ({ segment, pixelsPerSecond }) => {
    const { dispatch, state } = useEditor();
    const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const width = segment.duration * pixelsPerSecond;
    const left = segment.startTime * pixelsPerSecond;

    const handleDrag = (deltaX: number) => {
        setDragOffset({ x: deltaX, y: 0 });
    };

    const handleDragEnd = (totalDeltaX: number) => {
        const newLeft = Math.max(0, left + totalDeltaX);
        const newStartTime = newLeft / pixelsPerSecond;

        dispatch({
            type: 'REORDER_SEGMENTS',
            payload: { segmentId: segment.id, newStartTime }
        });

        setDragOffset({ x: 0, y: 0 });
    };

    const handleResize = (newWidth: number) => {
        const newDuration = Math.max(1, newWidth / pixelsPerSecond);
        dispatch({
            type: 'RESIZE_SEGMENT',
            payload: { id: segment.id, newDuration }
        });
    };

    const handleResizeStart = (e: React.MouseEvent, edge: 'left' | 'right') => {
        e.stopPropagation();
        setIsResizing(edge);

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

            newWidth = Math.max(pixelsPerSecond, newWidth);
            handleResize(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(null);
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
                left: `${left + dragOffset.x}px`,
                top: '10px',
                transform: dragOffset.x !== 0 ? 'scale(1.02)' : 'scale(1)',
                transition: dragOffset.x === 0 ? 'transform 0.2s ease' : 'none',
                zIndex: state.selectedSegmentId === segment.id ? 10 : 1,
            }}
        >
            <DraggableItem
                axis="x"
                onDrag={handleDrag}
                onDragEnd={(totalDeltaX) => handleDragEnd(totalDeltaX)}
            >
                <div
                    style={{
                        width: `${width}px`,
                        height: '60px',
                        backgroundColor: '#4CAF50',
                        border: state.selectedSegmentId === segment.id ? '3px solid #2196F3' : '2px solid #333',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 12px',
                        color: 'white',
                        position: 'relative',
                        boxShadow: state.selectedSegmentId === segment.id
                            ? '0 4px 12px rgba(33, 150, 243, 0.5)'
                            : '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'SELECT_SEGMENT', payload: segment.id });
                    }}
                >
                    {/* Left resizer */}
                    <SegmentResizer
                        position="left"
                        onResizeStart={(e) => handleResizeStart(e, 'left')}
                        isActive={isResizing === 'left'}
                    />

                    {/* Content */}
                    <div style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        paddingLeft: '15px',
                        fontWeight: 'bold'
                    }}>
                        {segment.label}
                    </div>

                    <div style={{
                        fontSize: '12px',
                        opacity: 0.8,
                        paddingRight: '15px',
                        fontFamily: 'monospace'
                    }}>
                        {segment.duration.toFixed(1)}s
                    </div>

                    {/* Right resizer */}
                    <SegmentResizer
                        position="right"
                        onResizeStart={(e) => handleResizeStart(e, 'right')}
                        isActive={isResizing === 'right'}
                    />
                </div>
            </DraggableItem>
        </div>
    );
};
