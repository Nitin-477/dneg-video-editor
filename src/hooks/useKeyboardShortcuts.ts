import { useEffect } from 'react';
import { useEditor } from '../store/EditorContext';

export const useKeyboardShortcuts = () => {
    const { state, dispatch } = useEditor();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                dispatch({ type: 'TOGGLE_PLAY' });
            }

            if ((e.code === 'Delete' || e.code === 'Backspace') && state.selectedSegmentId) {
                if ((e.target as HTMLElement).tagName !== 'INPUT') {
                    e.preventDefault();
                    dispatch({ type: 'REMOVE_SEGMENT', payload: state.selectedSegmentId });
                }
            }

            if (e.code === 'Escape') {
                dispatch({ type: 'SELECT_SEGMENT', payload: null });
                dispatch({ type: 'SELECT_OVERLAY', payload: null });
            }

            if (e.code === 'Equal' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                dispatch({ type: 'SET_ZOOM', payload: state.zoom * 1.2 });
            }

            if (e.code === 'Minus' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                dispatch({ type: 'SET_ZOOM', payload: state.zoom / 1.2 });
            }

            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                const newTime = Math.max(0, state.currentTime - 0.1);
                dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
            }

            if (e.code === 'ArrowRight') {
                e.preventDefault();
                const totalDuration = state.segments.reduce((sum, seg) => sum + seg.duration, 0);
                const newTime = Math.min(totalDuration, state.currentTime + 0.1);
                dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state, dispatch]);
};
