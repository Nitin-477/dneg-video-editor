import React from 'react';
import { useEditor } from '../../store/EditorContext';
import { exportToJSON } from '../../utils/exportUtils';

export const ExportPanel: React.FC = () => {
    const { state } = useEditor();

    const handleExport = () => {
        const json = exportToJSON(state);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video-editor-export.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopyToClipboard = () => {
        const json = exportToJSON(state);
        navigator.clipboard.writeText(json);
        alert('Exported JSON copied to clipboard!');
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
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Export</h3>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleExport}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    Download JSON
                </button>

                <button
                    onClick={handleCopyToClipboard}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    Copy to Clipboard
                </button>
            </div>

            <div
                style={{
                    marginTop: '15px',
                    padding: '15px',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflow: 'auto',
                }}
            >
                <pre style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                    {exportToJSON(state)}
                </pre>
            </div>
        </div>
    );
};
