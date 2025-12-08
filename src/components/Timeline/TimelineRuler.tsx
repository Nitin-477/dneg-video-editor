import React from 'react';

interface TimelineRulerProps {
    pixelsPerSecond: number;
    totalDuration: number;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({
    pixelsPerSecond,
    totalDuration,
}) => {
    const markers: number[] = [];
    const interval = Math.max(1, Math.ceil(50 / pixelsPerSecond)); // Adaptive interval

    for (let i = 0; i <= totalDuration; i += interval) {
        markers.push(i);
    }

    if (totalDuration > 0 && !markers.includes(totalDuration)) {
        markers.push(totalDuration);
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '25px',
                backgroundColor: '#1e1e1e',
                borderBottom: '1px solid #555',
                zIndex: 5,
            }}
        >
            {markers.map(time => (
                <div
                    key={time}
                    style={{
                        position: 'absolute',
                        left: `${time * pixelsPerSecond}px`,
                        top: 0,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        pointerEvents: 'none',
                    }}
                >
                    <div
                        style={{
                            width: '1px',
                            height: '8px',
                            backgroundColor: '#666',
                        }}
                    />
                    <span
                        style={{
                            fontSize: '9px',
                            color: '#999',
                            marginTop: '2px',
                            marginLeft: '2px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {time}s
                    </span>
                </div>
            ))}
        </div>
    );
};
