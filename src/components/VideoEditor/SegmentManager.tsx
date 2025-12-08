import React, { useState, useRef } from 'react';
import { useEditor } from '../../store/EditorContext';
import { v4 as uuidv4 } from 'uuid';

export const SegmentManager: React.FC = () => {
    const { state, dispatch } = useEditor();
    const [videoSource, setVideoSource] = useState('');
    const [label, setLabel] = useState('');
    const [duration, setDuration] = useState(10);
    const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loadingMetadata, setLoadingMetadata] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            alert('Please select a valid video file');
            return;
        }

        setSelectedFile(file);
        setLabel(file.name.replace(/\.[^/.]+$/, ''));
        setLoadingMetadata(true);

        // Create object URL
        const objectUrl = URL.createObjectURL(file);
        setVideoSource(objectUrl);

        // Get video duration using promises
        try {
            const videoDuration = await getVideoDuration(objectUrl);
            setDuration(Math.round(videoDuration * 100) / 100); // Round to 2 decimal places for accuracy
            setLoadingMetadata(false);
        } catch (error) {
            console.error('Failed to load video metadata:', error);
            setDuration(10); // Default fallback
            setLoadingMetadata(false);
        }
    };

    const getVideoDuration = (url: string): Promise<number> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                resolve(video.duration);
                video.src = ''; // Clean up
            };

            video.onerror = () => {
                reject(new Error('Failed to load video metadata'));
                video.src = '';
            };

            // Set timeout for loading
            setTimeout(() => {
                reject(new Error('Timeout loading video metadata'));
                video.src = '';
            }, 10000);

            video.src = url;
        });
    };

    const handleAddSegment = () => {
        if (!videoSource || !label) {
            alert('Please provide video source and label');
            return;
        }

        if (duration <= 0) {
            alert('Duration must be greater than 0');
            return;
        }

        const lastSegment = state.segments[state.segments.length - 1];
        const startTime = lastSegment ? lastSegment.startTime + lastSegment.duration : 0;

        const segment = {
            id: uuidv4(),
            startTime,
            duration,
            source: videoSource,
            label,
        };

        dispatch({ type: 'ADD_SEGMENT', payload: segment });

        setVideoSource('');
        setLabel('');
        setDuration(10);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddTransition = () => {
        if (state.segments.length < 2) {
            alert('Need at least 2 segments to add transition');
            return;
        }

        const fromSegment = state.segments[state.segments.length - 2];
        const toSegment = state.segments[state.segments.length - 1];

        const transition = {
            fromSegmentId: fromSegment.id,
            toSegmentId: toSegment.id,
            type: 'Fade' as const,
            duration: 1.0,
            easing: 'ease-in-out',
        };

        dispatch({ type: 'ADD_TRANSITION', payload: transition });
    };

    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
            }}
        >
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Add Video Segment</h3>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button
                    onClick={() => setUploadMethod('file')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: uploadMethod === 'file' ? '#4CAF50' : '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        flex: 1,
                        fontWeight: uploadMethod === 'file' ? 'bold' : 'normal',
                    }}
                >
                    📁 Upload File
                </button>
                <button
                    onClick={() => setUploadMethod('url')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: uploadMethod === 'url' ? '#4CAF50' : '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        flex: 1,
                        fontWeight: uploadMethod === 'url' ? 'bold' : 'normal',
                    }}
                >
                    🔗 Video URL
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {uploadMethod === 'file' && (
                    <div
                        style={{
                            padding: '30px 20px',
                            border: '2px dashed #555',
                            borderRadius: '4px',
                            textAlign: 'center',
                            backgroundColor: '#1e1e1e',
                            cursor: loadingMetadata ? 'wait' : 'pointer',
                            transition: 'border-color 0.3s',
                        }}
                        onClick={() => !loadingMetadata && fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        {loadingMetadata ? (
                            <>
                                <div style={{ color: '#2196F3', marginBottom: '8px', fontSize: '40px' }}>⏳</div>
                                <div style={{ color: 'white', fontSize: '14px' }}>
                                    Loading video metadata...
                                </div>
                            </>
                        ) : selectedFile ? (
                            <>
                                <div style={{ color: '#4CAF50', marginBottom: '8px', fontSize: '40px' }}>✓</div>
                                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                                    {selectedFile.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {duration}s
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '50px', marginBottom: '10px' }}>📹</div>
                                <div style={{ color: 'white', fontSize: '14px' }}>
                                    Click to select video file
                                </div>
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                                    Supports: MP4, WebM, OGG, MOV
                                </div>
                            </>
                        )}
                    </div>
                )}

                {uploadMethod === 'url' && (
                    <>
                        <input
                            type="text"
                            placeholder="https://example.com/video.mp4"
                            value={videoSource}
                            onChange={(e) => setVideoSource(e.target.value)}
                            style={{
                                padding: '12px',
                                borderRadius: '4px',
                                border: '1px solid #555',
                                backgroundColor: '#3a3a3a',
                                color: 'white',
                                fontSize: '14px',
                            }}
                        />
                        <div
                            style={{
                                fontSize: '11px',
                                color: '#FF9800',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                borderRadius: '4px',
                                border: '1px solid rgba(255, 152, 0, 0.3)',
                            }}
                        >
                            ⚠️ YouTube URLs are not supported. Use direct video URLs only.
                        </div>
                    </>
                )}

                <input
                    type="text"
                    placeholder="Segment label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    style={{
                        padding: '12px',
                        borderRadius: '4px',
                        border: '1px solid #555',
                        backgroundColor: '#3a3a3a',
                        color: 'white',
                    }}
                />

                <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Duration (seconds)"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    style={{
                        padding: '12px',
                        borderRadius: '4px',
                        border: '1px solid #555',
                        backgroundColor: '#3a3a3a',
                        color: 'white',
                    }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleAddSegment}
                        disabled={!videoSource || !label || loadingMetadata}
                        style={{
                            padding: '14px',
                            backgroundColor: videoSource && label && !loadingMetadata ? '#4CAF50' : '#555',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: videoSource && label && !loadingMetadata ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold',
                            flex: 1,
                            fontSize: '14px',
                        }}
                    >
                        ➕ Add Segment
                    </button>

                    <button
                        onClick={handleAddTransition}
                        disabled={state.segments.length < 2}
                        style={{
                            padding: '14px',
                            backgroundColor: state.segments.length >= 2 ? '#9C27B0' : '#555',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: state.segments.length >= 2 ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold',
                            flex: 1,
                            fontSize: '14px',
                        }}
                    >
                        ✨ Add Transition
                    </button>
                </div>
            </div>
        </div>
    );
};
