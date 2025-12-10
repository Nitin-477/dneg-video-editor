import { Segment } from '../types/editor.types';

export const detectOverlap = (
    segment1: Segment,
    segment2: Segment
): boolean => {
    const end1 = segment1.startTime + segment1.duration;
    const end2 = segment2.startTime + segment2.duration;

    return (
        (segment1.startTime >= segment2.startTime && segment1.startTime < end2) ||
        (segment2.startTime >= segment1.startTime && segment2.startTime < end1)
    );
};

export const preventOverlap = (
    segments: Segment[],
    _movedSegment: Segment
): Segment[] => {
    const sorted = [...segments].sort((a, b) => a.startTime - b.startTime);
    let currentTime = 0;

    return sorted.map(seg => {
        const updated = { ...seg, startTime: currentTime };
        currentTime += seg.duration;
        return updated;
    });
};
