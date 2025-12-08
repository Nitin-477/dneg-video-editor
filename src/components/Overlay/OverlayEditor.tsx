import React, { useState } from 'react';
import { useEditor } from '../../store/EditorContext';
import { v4 as uuidv4 } from 'uuid';

export const OverlayEditor: React.FC = () => {
    const { state, dispatch } = useEditor();
    const [text, setText] = useState('');
    const [duration, setDuration] = useState(5);
    const [startTime, setStartTime] = useState(0);
    const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);

    const handleAddOverlay = () => {

        let segmentIds: string[] = [];

        if (selectedSegmentIds.length > 0) {
            segmentIds = selectedSegmentIds;
        } else if (state.selectedSegmentId) {
            segmentIds = [state.selectedSegmentId];
        }

        if (segmentIds.length === 0) {
            alert('Please select at least one segment first');
            return;
        }

        if (!text || text.trim() === '') {
            alert('Please enter overlay text');
            return;
        }

        if (duration <= 0) {
            alert('Duration must be greater than 0');
            return;
        }

        if (startTime < 0) {
            alert('Start time cannot be negative');
            return;
        }

        const overlay = {
            id: uuidv4(),
            segmentIds: segmentIds,
            startTime: startTime,
            duration: duration,
            text: text.trim(),
            x: 0.1,
            y: 0.1,
            width: 0.3,
            height: 0.1,
        };

        dispatch({ type: 'ADD_OVERLAY', payload: overlay });

        setText('');
        setStartTime(0);
        setDuration(5);
        setSelectedSegmentIds([]);

        alert(`Overlay added successfully to ${segmentIds.length} segment(s)!`);
    };

    const handleSegmentToggle = (segmentId: string) => {
        setSelectedSegmentIds(prev =>
            prev.includes(segmentId)
                ? prev.filter(id => id !== segmentId)
                : [...prev, segmentId]
        );
    };

    const handleSelectAll = () => {
        setSelectedSegmentIds(state.segments.map(s => s.id));
    };

    const handleClearSelection = () => {
        setSelectedSegmentIds([]);
    };

    const currentlySelected = state.selectedSegmentId
        ? state.segments.find(s => s.id === state.selectedSegmentId)
        : null;

    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
            }}
        >
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Add Text Overlay</h3>

            {currentlySelected && selectedSegmentIds.length === 0 && (
                <div
                    style={{
                        padding: '10px',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        border: '1px solid rgba(33, 150, 243, 0.3)',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '12px',
                        color: '#2196F3',
                    }}
                >
                    ℹ️ Will be added to: <strong>{currentlySelected.label}</strong>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                        Overlay Text *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter overlay text..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{
                            padding: '12px',
                            borderRadius: '4px',
                            border: '1px solid #555',
                            backgroundColor: '#3a3a3a',
                            color: 'white',
                            width: '100%',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                            Start Time (s)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="0"
                            value={startTime}
                            onChange={(e) => setStartTime(Number(e.target.value))}
                            style={{
                                padding: '12px',
                                borderRadius: '4px',
                                border: '1px solid #555',
                                backgroundColor: '#3a3a3a',
                                color: 'white',
                                width: '100%',
                            }}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                            Duration (s)
                        </label>
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder="5"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            style={{
                                padding: '12px',
                                borderRadius: '4px',
                                border: '1px solid #555',
                                backgroundColor: '#3a3a3a',
                                color: 'white',
                                width: '100%',
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        padding: '12px',
                        backgroundColor: '#1e1e1e',
                        borderRadius: '4px',
                        border: '1px solid #555',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <span style={{ color: '#999', fontSize: '12px' }}>
                            Assign to Segments ({selectedSegmentIds.length} selected)
                        </span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                                onClick={handleSelectAll}
                                disabled={state.segments.length === 0}
                                style={{
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    backgroundColor: '#555',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: state.segments.length > 0 ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Select All
                            </button>
                            <button
                                onClick={handleClearSelection}
                                disabled={selectedSegmentIds.length === 0}
                                style={{
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    backgroundColor: '#555',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: selectedSegmentIds.length > 0 ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        maxHeight: '150px',
                        overflow: 'auto'
                    }}>
                        {state.segments.map(segment => (
                            <label
                                key={segment.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px',
                                    backgroundColor: selectedSegmentIds.includes(segment.id) ? '#4CAF50' : '#3a3a3a',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSegmentIds.includes(segment.id)}
                                    onChange={() => handleSegmentToggle(segment.id)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span style={{ color: 'white', fontSize: '13px', flex: 1 }}>
                                    {segment.label}
                                </span>
                                <span style={{ color: '#999', fontSize: '11px' }}>
                                    {segment.duration}s
                                </span>
                            </label>
                        ))}

                        {state.segments.length === 0 && (
                            <div style={{
                                color: '#666',
                                fontSize: '12px',
                                textAlign: 'center',
                                padding: '20px'
                            }}>
                                No segments available. Add segments first.
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleAddOverlay}
                    disabled={
                        !text ||
                        text.trim() === '' ||
                        (selectedSegmentIds.length === 0 && !state.selectedSegmentId) ||
                        state.segments.length === 0
                    }
                    style={{
                        padding: '14px',
                        backgroundColor:
                            text &&
                                text.trim() !== '' &&
                                (selectedSegmentIds.length > 0 || state.selectedSegmentId) &&
                                state.segments.length > 0
                                ? '#4CAF50'
                                : '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor:
                            text &&
                                text.trim() !== '' &&
                                (selectedSegmentIds.length > 0 || state.selectedSegmentId) &&
                                state.segments.length > 0
                                ? 'pointer'
                                : 'not-allowed',
                        fontWeight: 'bold',
                        fontSize: '14px',
                    }}
                >
                    ➕ Add Overlay
                </button>
            </div>
        </div>
    );
};
