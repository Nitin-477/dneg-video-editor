import { useEffect, useRef } from 'react';
import { useEditor } from '../store/EditorContext';

export const useVideoSync = (videoRef: React.RefObject<HTMLVideoElement>) => {
    const { state } = useEditor();
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        const syncPlayback = () => {
            if (state.isPlaying && video.paused) {
                video.play().catch(err => console.error('Play error:', err));
            } else if (!state.isPlaying && !video.paused) {
                video.pause();
            }

            animationFrameRef.current = requestAnimationFrame(syncPlayback);
        };

        syncPlayback();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [state.isPlaying, videoRef]);

    return { videoRef };
};
