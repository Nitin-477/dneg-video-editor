import React from 'react';
import { Transition } from '../../types/editor.types';

interface TransitionIndicatorProps {
    transition: Transition;
    pixelsPerSecond: number;
    fromSegmentEndTime: number;
}

export const TransitionIndicator: React.FC<TransitionIndicatorProps> = ({
    transition,
    pixelsPerSecond,
    fromSegmentEndTime,
}) => {
    const left = fromSegmentEndTime * pixelsPerSecond;
    const width = transition.duration * pixelsPerSecond;

    return (
        <div
            style={{
                position: 'absolute',
                left: `${left}px`,
                top: '65px',
                width: `${width}px`,
                height: '30px',
                backgroundColor: '#9C27B0',
                border: '1px solid #7B1FA2',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                zIndex: 50,
            }}
        >
            {transition.type} ({transition.duration}s)
        </div>
    );
};
