import { EditorState } from '../types/editor.types';

export const exportToJSON = (state: EditorState) => {
    return JSON.stringify(
        {
            segments: state.segments.map(({ id, startTime, duration, source, label }) => ({
                id,
                startTime,
                duration,
                source,
                label,
            })),
            overlays: state.overlays.map(({ id, segmentIds, startTime, duration, x, y, width, height }) => ({
                id,
                segmentIds,
                startTime,
                duration,
                x,
                y,
                width,
                height,
            })),
            transitions: state.transitions,
        },
        null,
        2
    );
};
