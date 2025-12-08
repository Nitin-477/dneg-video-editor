import { useEffect, useRef } from 'react';
import { useEditor } from '../store/EditorContext';

export const useTimeline = () => {
    const { state, dispatch } = useEditor();
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        if (!state.isPlaying) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            return;
        }

        const startTime = performance.now();
        const initialTime = state.currentTime;

        const updateTime = (currentTimestamp: number) => {
            const elapsed = (currentTimestamp - startTime) / 1000;
            const newTime = initialTime + elapsed;

            const totalDuration = state.segments.reduce((sum, seg) => sum + seg.duration, 0);

            if (newTime >= totalDuration) {
                dispatch({ type: 'SET_CURRENT_TIME', payload: totalDuration });
                dispatch({ type: 'TOGGLE_PLAY' });
                return;
            }

            dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
            animationFrameRef.current = requestAnimationFrame(updateTime);
        };

        animationFrameRef.current = requestAnimationFrame(updateTime);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [state.isPlaying, state.segments, dispatch]);

    return state;
};
