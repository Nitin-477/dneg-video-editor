export interface Segment {
    id: string;
    startTime: number;
    duration: number;
    source: string;
    label: string;
    videoElement?: HTMLVideoElement;
}

export interface Overlay {
    id: string;
    segmentIds: string[];
    startTime: number;
    duration: number;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Transition {
    fromSegmentId: string;
    toSegmentId: string;
    type: 'Fade' | 'Dissolve' | 'Wipe';
    duration: number;
    easing: string;
}

export interface EditorState {
    segments: Segment[];
    overlays: Overlay[];
    transitions: Transition[];
    currentTime: number;
    isPlaying: boolean;
    zoom: number;
    selectedSegmentId: string | null;
    selectedOverlayId: string | null;
    playMode: 'single' | 'all';
}
