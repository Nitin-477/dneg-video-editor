import React from 'react';
import { useEditor } from '../../store/EditorContext';
import { v4 as uuidv4 } from 'uuid';

const SAMPLE_VIDEOS = [
    {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        label: 'Big Buck Bunny',
        duration: 596,
    },
    {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        label: 'Elephants Dream',
        duration: 653,
    },
    {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        label: 'For Bigger Blazes',
        duration: 15,
    },
];

export const SampleVideos: React.FC = () => {
    const { state, dispatch } = useEditor();

    const handleAddSample = (sample: typeof SAMPLE_VIDEOS[0]) => {
        const lastSegment = state.segments[state.segments.length - 1];
        const startTime = lastSegment ? lastSegment.startTime + lastSegment.duration : 0;

        const segment = {
            id: uuidv4(),
            startTime,
            duration: sample.duration,
            source: sample.url,
            label: sample.label,
        };

        dispatch({ type: 'ADD_SEGMENT', payload: segment });
    };

    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                marginTop: '20px',
            }}
        >
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
                🎬 Sample Videos (Quick Test)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SAMPLE_VIDEOS.map((sample, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAddSample(sample)}
                        style={{
                            padding: '10px',
                            backgroundColor: '#3a3a3a',
                            color: 'white',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#4a4a4a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3a3a3a';
                        }}
                    >
                        <div style={{ fontWeight: 'bold' }}>{sample.label}</div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                            Duration: {sample.duration}s
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
