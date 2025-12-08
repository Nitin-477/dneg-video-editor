import React from 'react';
import { useEditor } from '../../store/EditorContext';
import { SegmentBlock } from '../Segment/SegmentBlock';
import { TransitionIndicator } from '../Segment/TransitionIndicator';

interface TimelineTrackProps {
    pixelsPerSecond: number;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({ pixelsPerSecond }) => {
    const { state } = useEditor();

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100px',
                backgroundColor: '#2a2a2a',
                borderRadius: '4px',
                marginBottom: '10px',
            }}
        >

            <div
                style={{
                    position: 'absolute',
                    left: '10px',
                    top: '10px',
                    color: '#999',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 1,
                }}
            >
                Video Segments
            </div>

            <div style={{ position: 'relative', paddingTop: '30px', height: '100%' }}>
                {state.segments.map(segment => (
                    <SegmentBlock
                        key={segment.id}
                        segment={segment}
                        pixelsPerSecond={pixelsPerSecond}
                    />
                ))}
                {state.transitions.map((transition, idx) => {
                    const fromSegment = state.segments.find(s => s.id === transition.fromSegmentId);
                    if (!fromSegment) return null;

                    return (
                        <TransitionIndicator
                            key={idx}
                            transition={transition}
                            pixelsPerSecond={pixelsPerSecond}
                            fromSegmentEndTime={fromSegment.startTime + fromSegment.duration}
                        />
                    );
                })}
            </div>
        </div>
    );
};
