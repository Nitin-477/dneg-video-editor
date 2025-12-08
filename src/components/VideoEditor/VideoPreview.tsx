import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '../../store/EditorContext';
import { OverlayDisplay } from '../Overlay/OverlayDisplay';

export const VideoPreview: React.FC = () => {
    const { state, dispatch } = useEditor();
    const video1Ref = useRef<HTMLVideoElement>(null);
    const video2Ref = useRef<HTMLVideoElement>(null);
    const [videoError, setVideoError] = useState<string | null>(null);
    const currentSegmentIndexRef = useRef<number>(-1);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [video1Opacity, setVideo1Opacity] = useState(1);
    const [video2Opacity, setVideo2Opacity] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const whichVideoPlaying = useRef<1 | 2>(1);
    const transitionCompletedRef = useRef(false);
    const video1SegmentIndexRef = useRef<number>(-1);
    const video2SegmentIndexRef = useRef<number>(-1);

    const loadVideoIntoPlayer = (segmentIndex: number, videoPlayer: 1 | 2) => {
        if (segmentIndex < 0 || segmentIndex >= state.segments.length) return;

        const segment = state.segments[segmentIndex];
        const videoElem = videoPlayer === 1 ? video1Ref.current : video2Ref.current;

        if (!videoElem) return;

        if (videoPlayer === 1) {
            video1SegmentIndexRef.current = segmentIndex;
        } else {
            video2SegmentIndexRef.current = segmentIndex;
        }

        videoElem.src = segment.source;
        videoElem.load();

        videoElem.onloadeddata = () => {
            const localTime = state.currentTime - segment.startTime;
            videoElem.currentTime = Math.max(0, Math.min(localTime, segment.duration));

            if (state.isPlaying) {
                videoElem.play();
            }
        };
    };

    const loadTransitionVideo = async (nextSegmentIndex: number) => {
        if (nextSegmentIndex >= state.segments.length) return;

        const nextSegment = state.segments[nextSegmentIndex];
        const inactivePlayer = whichVideoPlaying.current === 1 ? 2 : 1;
        const videoElem = inactivePlayer === 1 ? video1Ref.current : video2Ref.current;

        if (!videoElem) return;

        if (inactivePlayer === 1) {
            video1SegmentIndexRef.current = nextSegmentIndex;
        } else {
            video2SegmentIndexRef.current = nextSegmentIndex;
        }

        videoElem.src = nextSegment.source;
        videoElem.load();

        return new Promise<void>((resolve) => {
            videoElem.onloadeddata = () => {
                videoElem.currentTime = 0;
                videoElem.play();
                resolve();
            };
        });
    };

    useEffect(() => {
        if (state.segments.length === 0) {
            currentSegmentIndexRef.current = -1;
            return;
        }

        let targetIndex = -1;
        for (let i = 0; i < state.segments.length; i++) {
            const seg = state.segments[i];
            if (state.currentTime >= seg.startTime && state.currentTime < seg.startTime + seg.duration) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex >= 0 && targetIndex !== currentSegmentIndexRef.current) {

            if (transitionCompletedRef.current) {
                currentSegmentIndexRef.current = targetIndex;
                transitionCompletedRef.current = false;


            } else {
                const activeVideoSegIndex = whichVideoPlaying.current === 1 ? video1SegmentIndexRef.current : video2SegmentIndexRef.current;

                if (activeVideoSegIndex === targetIndex) {
                    currentSegmentIndexRef.current = targetIndex;
                } else {
                    currentSegmentIndexRef.current = targetIndex;
                    loadVideoIntoPlayer(targetIndex, whichVideoPlaying.current);
                }
            }
        }

    }, [state.currentTime, state.segments.length]);

    useEffect(() => {
        const activeVideo = whichVideoPlaying.current === 1 ? video1Ref.current : video2Ref.current;

        if (activeVideo && currentSegmentIndexRef.current >= 0) {
            if (state.isPlaying && activeVideo.paused) {
                activeVideo.play();
            } else if (!state.isPlaying && !activeVideo.paused) {
                activeVideo.pause();
            }
        }
    }, [state.isPlaying]);

    useEffect(() => {
        const video1 = video1Ref.current;
        const video2 = video2Ref.current;
        if (!video1 || !video2) return;

        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
        }

        if (!state.isPlaying) return;

        pollIntervalRef.current = setInterval(() => {
            const currentIndex = currentSegmentIndexRef.current;
            if (currentIndex < 0 || currentIndex >= state.segments.length) return;

            const segment = state.segments[currentIndex];
            const activeVideo = whichVideoPlaying.current === 1 ? video1 : video2;

            const localTime = activeVideo.currentTime;
            const clampedLocalTime = Math.min(localTime, segment.duration);
            const globalTime = segment.startTime + clampedLocalTime;

            if (globalTime <= segment.startTime + segment.duration) {
                dispatch({ type: 'SET_CURRENT_TIME', payload: globalTime });
            }

            const transition = state.transitions.find(t => t.fromSegmentId === segment.id);

            if (transition && state.playMode === 'all' && !isTransitioning) {
                const transitionStartTime = segment.duration - transition.duration;

                if (localTime >= transitionStartTime - 0.5 && currentIndex + 1 < state.segments.length) {
                    setIsTransitioning(true);
                    loadTransitionVideo(currentIndex + 1);
                }
            }

            if (isTransitioning && transition) {
                const transitionStartTime = segment.duration - transition.duration;
                if (localTime >= transitionStartTime) {
                    const progress = Math.min((localTime - transitionStartTime) / transition.duration, 1);

                    if (whichVideoPlaying.current === 1) {
                        setVideo1Opacity(1 - progress);
                        setVideo2Opacity(progress);
                    } else {
                        setVideo2Opacity(1 - progress);
                        setVideo1Opacity(progress);
                    }
                }
            }

            const timeUntilSegmentEnd = segment.duration - localTime;

            if (timeUntilSegmentEnd <= 0.03 || localTime >= segment.duration) {
                if (state.playMode === 'all' && currentIndex + 1 < state.segments.length) {

                    if (isTransitioning) {
                        activeVideo.pause();

                        whichVideoPlaying.current = whichVideoPlaying.current === 1 ? 2 : 1;
                        if (whichVideoPlaying.current === 1) {
                            setVideo1Opacity(1);
                            setVideo2Opacity(0);
                        } else {
                            setVideo1Opacity(0);
                            setVideo2Opacity(1);
                        }

                        setIsTransitioning(false);
                        transitionCompletedRef.current = true;
                    } else {
                        activeVideo.pause();
                    }

                    const nextSegment = state.segments[currentIndex + 1];
                    dispatch({ type: 'SET_CURRENT_TIME', payload: nextSegment.startTime });

                } else {
                    video1.pause();
                    video2.pause();

                    setVideo1Opacity(1);
                    setVideo2Opacity(0);
                    setIsTransitioning(false);
                    whichVideoPlaying.current = 1;
                    transitionCompletedRef.current = false;
                    video1SegmentIndexRef.current = -1;
                    video2SegmentIndexRef.current = -1;

                    dispatch({ type: 'SET_CURRENT_TIME', payload: segment.startTime + segment.duration });
                    dispatch({ type: 'TOGGLE_PLAY' });
                }
            }
        }, 16);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [state.isPlaying, state.segments, state.playMode, state.transitions, isTransitioning, dispatch]);

    const getCurrentSegment = () => {
        if (currentSegmentIndexRef.current >= 0) {
            return state.segments[currentSegmentIndexRef.current];
        }
        return null;
    };

    const activeOverlays = state.overlays.filter(overlay => {
        const segment = getCurrentSegment();
        if (!segment) return false;
        const localTime = state.currentTime - segment.startTime;
        return overlay.segmentIds.includes(segment.id) &&
            localTime >= overlay.startTime &&
            localTime < overlay.startTime + overlay.duration;
    });

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            backgroundColor: '#000',
            aspectRatio: '16/9',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #333',
        }}>
            <video
                ref={video1Ref}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#000',
                    opacity: video1Opacity,
                    zIndex: 1,
                }}
                playsInline
            />

            <video
                ref={video2Ref}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#000',
                    opacity: video2Opacity,
                    zIndex: 1,
                }}
                playsInline
            />

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 3,
            }}>
                {activeOverlays.map(overlay => (
                    <div key={overlay.id} style={{ pointerEvents: 'auto' }}>
                        <OverlayDisplay overlay={overlay} />
                    </div>
                ))}
            </div>

            {videoError && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#f44336',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    padding: '20px',
                    borderRadius: '8px',
                    zIndex: 200,
                }}>
                    ⚠️ {videoError}
                </div>
            )}

            {state.segments.length === 0 && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#999',
                    textAlign: 'center',
                    zIndex: 10,
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎬</div>
                    <div>Add video segments</div>
                </div>
            )}

            {state.isPlaying && currentSegmentIndexRef.current >= 0 && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '8px 12px',
                    backgroundColor: state.playMode === 'all'
                        ? 'rgba(33, 150, 243, 0.9)'
                        : 'rgba(76, 175, 80, 0.9)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    zIndex: 10,
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        animation: 'blink 1s infinite',
                    }} />
                    <span>
                        {state.playMode === 'all' ? '▶▶ PLAY ALL' : '▶ PLAY'} | {getCurrentSegment()?.label}
                    </span>
                </div>
            )}

            {isTransitioning && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(156, 39, 176, 0.9)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10,
                }}>
                    ✨ Crossfade
                </div>
            )}

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};
