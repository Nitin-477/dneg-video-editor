import React from 'react';

interface SnapGuidesProps {
    snapLines: number[];
    pixelsPerSecond: number;
}

export const SnapGuides: React.FC<SnapGuidesProps> = ({
    snapLines,
    pixelsPerSecond,
}) => {
    return (
        <>
            {snapLines.map((time, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'absolute',
                        left: `${time * pixelsPerSecond}px`,
                        top: 0,
                        width: '2px',
                        height: '100%',
                        backgroundColor: '#00FF00',
                        opacity: 0.6,
                        zIndex: 999,
                        pointerEvents: 'none',
                    }}
                />
            ))}
        </>
    );
};
