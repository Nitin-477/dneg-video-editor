import React from 'react';
import { useEditor } from '../../store/EditorContext';

export const Controls: React.FC = () => {
    const { state, dispatch } = useEditor();

    const totalDuration = state.segments.reduce((sum, seg) => sum + seg.duration, 0);

    const handlePlayPause = () => {
        if (!state.isPlaying) {
            const currentSegment = state.segments.find(
                s => state.currentTime >= s.startTime &&
                    state.currentTime < s.startTime + s.duration
            );

            if (!currentSegment) {
                console.log('⚠️ Not in any segment, resetting to beginning');
                dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
            }

            if (state.playMode === 'all') {
                console.log('▶ Play button clicked - setting SINGLE mode');
                dispatch({ type: 'SET_PLAY_MODE', payload: 'single' });
            }
        }
        dispatch({ type: 'TOGGLE_PLAY' });
    };

    const handlePlayAll = () => {
        console.log('▶▶ Play All button clicked - setting ALL mode');
        dispatch({ type: 'SET_PLAY_MODE', payload: 'all' });
        dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });

        setTimeout(() => {
            if (!state.isPlaying) {
                dispatch({ type: 'TOGGLE_PLAY' });
            }
        }, 50);
    };

    const handleStop = () => {
        console.log('⏹ Stop button clicked');
        if (state.isPlaying) {
            dispatch({ type: 'TOGGLE_PLAY' });
        }
        dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
        dispatch({ type: 'SET_PLAY_MODE', payload: 'single' });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            display: 'flex',
            gap: '15px',
            padding: '20px',
            backgroundColor: '#1e1e1e',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            flexWrap: 'wrap',
        }}>
            <button
                onClick={handleStop}
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                }}
            >
                ⏹ Stop
            </button>

            <button
                onClick={handlePlayPause}
                disabled={state.segments.length === 0}
                style={{
                    padding: '12px 24px',
                    backgroundColor: state.segments.length === 0 ? '#555' : (state.isPlaying ? '#FF9800' : '#4CAF50'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: state.segments.length > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                    fontWeight: 'bold',
                }}
            >
                {state.isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>

            <button
                onClick={handlePlayAll}
                disabled={state.segments.length === 0}
                style={{
                    padding: '12px 24px',
                    backgroundColor: state.segments.length > 0 ? '#2196F3' : '#555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: state.segments.length > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                    fontWeight: 'bold',
                }}
            >
                ▶▶ Play All
            </button>

            <div style={{
                marginLeft: '20px',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#2a2a2a',
                padding: '10px 15px',
                borderRadius: '6px',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#999', fontSize: '10px', marginBottom: '2px' }}>CURRENT</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196F3' }}>
                        {formatTime(state.currentTime)}
                    </div>
                </div>
                <div style={{ color: '#555', fontSize: '20px' }}>│</div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#999', fontSize: '10px', marginBottom: '2px' }}>TOTAL</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {formatTime(totalDuration)}
                    </div>
                </div>
            </div>

            <div style={{
                padding: '8px 12px',
                backgroundColor: '#2a2a2a',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: state.playMode === 'all' ? '#2196F3' : '#4CAF50',
                border: `2px solid ${state.playMode === 'all' ? '#2196F3' : '#4CAF50'}`,
            }}>
                MODE: {state.playMode === 'all' ? '▶▶ ALL' : '▶ SINGLE'}
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#2a2a2a',
                borderRadius: '6px',
            }}>
                <div
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: state.isPlaying ? '#4CAF50' : '#666',
                        boxShadow: state.isPlaying ? '0 0 10px #4CAF50' : 'none',
                        animation: state.isPlaying ? 'pulse 2s infinite' : 'none',
                    }}
                />
                <span style={{
                    fontSize: '12px',
                    color: state.isPlaying ? '#4CAF50' : '#666',
                    fontWeight: 'bold'
                }}>
                    {state.isPlaying ? 'PLAYING' : 'PAUSED'}
                </span>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.9); }
        }
      `}</style>
        </div>
    );
};
