import React from 'react';
import { VideoPreview } from './VideoPreview';
import { Timeline } from '../Timeline/Timeline';
import { Controls } from './Controls';
import { SegmentManager } from './SegmentManager';
import { SampleVideos } from './SampleVideos';
import { OverlayEditor } from '../Overlay/OverlayEditor';
import { ExportPanel } from './ExportPanel';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const VideoEditor: React.FC = () => {
    useKeyboardShortcuts();

    return (
        <div
            className="editor-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100vw',
                backgroundColor: '#121212',
                color: 'white',
                overflow: 'hidden',
            }}
        >
            <header
                style={{
                    padding: '15px 20px',
                    backgroundColor: '#1e1e1e',
                    borderBottom: '2px solid #333',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0,
                }}
            >
                <h1 style={{ margin: 0, fontSize: '24px' }}>🎬 DNEG Video Editor</h1>
                <div style={{ fontSize: '11px', color: '#999' }}>
                    Space: Play/Pause | ←→: Seek | +/-: Zoom | Del: Delete | Esc: Deselect
                </div>
            </header>

            <div
                className="editor-main"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '0',
                    flex: 1,
                    overflow: 'hidden',
                    minHeight: 0,
                }}
            >
                <div
                    className="editor-left-panel"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        padding: '20px',
                        overflow: 'auto',
                        backgroundColor: '#121212',
                        borderRight: '2px solid #333',
                    }}
                >
                    <VideoPreview />
                    <Controls />
                    <Timeline />
                </div>

                <div
                    className="editor-right-panel"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        padding: '20px',
                        overflow: 'auto',
                        backgroundColor: '#0a0a0a',
                    }}
                >
                    <SegmentManager />
                    <SampleVideos />
                    <OverlayEditor />
                    <ExportPanel />
                </div>
            </div>
        </div>
    );
};
