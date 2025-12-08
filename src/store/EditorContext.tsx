import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { EditorState, Segment, Overlay, Transition } from '../types/editor.types';

type Action =
    | { type: 'ADD_SEGMENT'; payload: Segment }
    | { type: 'UPDATE_SEGMENT'; payload: { id: string; updates: Partial<Segment> } }
    | { type: 'REMOVE_SEGMENT'; payload: string }
    | { type: 'REORDER_SEGMENTS'; payload: { segmentId: string; newStartTime: number } }
    | { type: 'RESIZE_SEGMENT'; payload: { id: string; newDuration: number } }
    | { type: 'ADD_OVERLAY'; payload: Overlay }
    | { type: 'UPDATE_OVERLAY'; payload: { id: string; updates: Partial<Overlay> } }
    | { type: 'REMOVE_OVERLAY'; payload: string }
    | { type: 'ADD_TRANSITION'; payload: Transition }
    | { type: 'SET_CURRENT_TIME'; payload: number }
    | { type: 'TOGGLE_PLAY' }
    | { type: 'SET_ZOOM'; payload: number }
    | { type: 'SELECT_SEGMENT'; payload: string | null }
    | { type: 'SELECT_OVERLAY'; payload: string | null }
    | { type: 'SET_PLAY_MODE'; payload: 'single' | 'all' };

const initialState: EditorState = {
    segments: [],
    overlays: [],
    transitions: [],
    currentTime: 0,
    isPlaying: false,
    zoom: 1,
    selectedSegmentId: null,
    selectedOverlayId: null,
    playMode: 'single',
};

function editorReducer(state: EditorState, action: Action): EditorState {
    switch (action.type) {
        case 'ADD_SEGMENT': {
            const newSegments = [...state.segments, action.payload];
            return { ...state, segments: newSegments };
        }

        case 'UPDATE_SEGMENT': {
            return {
                ...state,
                segments: state.segments.map(seg =>
                    seg.id === action.payload.id
                        ? { ...seg, ...action.payload.updates }
                        : seg
                ),
            };
        }

        case 'REMOVE_SEGMENT': {
            const segment = state.segments.find(s => s.id === action.payload);
            if (segment && segment.source.startsWith('blob:')) {
                URL.revokeObjectURL(segment.source);
            }

            return {
                ...state,
                segments: state.segments.filter(s => s.id !== action.payload),
                selectedSegmentId: state.selectedSegmentId === action.payload ? null : state.selectedSegmentId,
            };
        }

        case 'REORDER_SEGMENTS': {
            const { segmentId, newStartTime } = action.payload;
            const segment = state.segments.find(s => s.id === segmentId);
            if (!segment) return state;

            const updatedSegments = shiftSegments(state.segments, segmentId, newStartTime);
            return { ...state, segments: updatedSegments };
        }

        case 'RESIZE_SEGMENT': {
            const { id, newDuration } = action.payload;
            return {
                ...state,
                segments: state.segments.map(seg =>
                    seg.id === id ? { ...seg, duration: newDuration } : seg
                ),
            };
        }

        case 'ADD_OVERLAY': {
            return { ...state, overlays: [...state.overlays, action.payload] };
        }

        case 'UPDATE_OVERLAY': {
            return {
                ...state,
                overlays: state.overlays.map(ov =>
                    ov.id === action.payload.id
                        ? { ...ov, ...action.payload.updates }
                        : ov
                ),
            };
        }

        case 'REMOVE_OVERLAY': {
            return {
                ...state,
                overlays: state.overlays.filter(o => o.id !== action.payload),
                selectedOverlayId: state.selectedOverlayId === action.payload ? null : state.selectedOverlayId,
            };
        }

        case 'ADD_TRANSITION': {
            return { ...state, transitions: [...state.transitions, action.payload] };
        }

        case 'SET_CURRENT_TIME': {
            return { ...state, currentTime: action.payload };
        }

        case 'TOGGLE_PLAY': {
            return { ...state, isPlaying: !state.isPlaying };
        }

        case 'SET_ZOOM': {
            return { ...state, zoom: Math.max(0.1, Math.min(5, action.payload)) };
        }

        case 'SELECT_SEGMENT': {
            return { ...state, selectedSegmentId: action.payload };
        }

        case 'SELECT_OVERLAY': {
            return { ...state, selectedOverlayId: action.payload };
        }

        case 'SET_PLAY_MODE': {
            return { ...state, playMode: action.payload };
        }

        default:
            return state;
    }
}

function shiftSegments(segments: Segment[], movedId: string, newStartTime: number): Segment[] {
    const sorted = [...segments].sort((a, b) => a.startTime - b.startTime);
    const movedIndex = sorted.findIndex(s => s.id === movedId);
    const movedSegment = sorted[movedIndex];

    sorted.splice(movedIndex, 1);
    const insertIndex = sorted.findIndex(s => s.startTime > newStartTime);
    const finalIndex = insertIndex === -1 ? sorted.length : insertIndex;
    sorted.splice(finalIndex, 0, { ...movedSegment, startTime: newStartTime });

    let currentTime = 0;
    return sorted.map(seg => {
        const updated = { ...seg, startTime: currentTime };
        currentTime += seg.duration;
        return updated;
    });
}

const EditorContext = createContext<{
    state: EditorState;
    dispatch: React.Dispatch<Action>;
} | null>(null);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    React.useEffect(() => {
        return () => {
            state.segments.forEach(segment => {
                if (segment.source.startsWith('blob:')) {
                    URL.revokeObjectURL(segment.source);
                }
            });
        };
    }, []);

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) throw new Error('useEditor must be used within EditorProvider');
    return context;
};
