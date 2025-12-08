import React, { useRef } from 'react';
import { useEditor } from '../../store/EditorContext';
import { SegmentBlock } from '../Segment/SegmentBlock';
import { TransitionIndicator } from '../Segment/TransitionIndicator';
import { OverlayTrack } from './OverlayTrack';
import { Playhead } from './Playhead';
import { ZoomControls } from './ZoomControls';
import { TimelineRuler } from './TimelineRuler';

export const Timeline: React.FC = () => {
    const { state, dispatch } = useEditor();
    const timelineRef = useRef<HTMLDivElement>(null);

    const pixelsPerSecond = 50 * state.zoom;
    const totalDuration = state.segments.reduce((sum, seg) => sum + seg.duration, 0);
    const timelineWidth = Math.max(800, totalDuration * pixelsPerSecond);

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;
        const newTime = clickX / pixelsPerSecond;
        dispatch({ type: 'SET_CURRENT_TIME', payload: Math.max(0, newTime) });
    };

    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: '#1e1e1e',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
            }}>
                <h3 style={{ color: 'white', margin: 0 }}>Timeline</h3>
                <ZoomControls />
            </div>

            <div
                ref={timelineRef}
                className="timeline-container"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '150px',
                    backgroundColor: '#2a2a2a',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    borderRadius: '4px',
                    border: '1px solid #333',
                }}
                onClick={handleTimelineClick}
            >
                <div
                    style={{
                        position: 'relative',
                        width: `${timelineWidth}px`,
                        height: '100%',
                        minWidth: '100%',
                    }}
                >
                    <TimelineRuler
                        pixelsPerSecond={pixelsPerSecond}
                        totalDuration={totalDuration}
                    />

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

                    <Playhead
                        currentTime={state.currentTime}
                        pixelsPerSecond={pixelsPerSecond}
                    />
                </div>
            </div>
            <div style={{ marginTop: '10px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                <OverlayTrack pixelsPerSecond={pixelsPerSecond} />
            </div>
        </div>
    );
};
