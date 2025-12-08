import { useMemo } from 'react';
import { Segment } from '../types/editor.types';

interface SnapResult {
    snappedPosition: number;
    isSnapping: boolean;
    snapLine?: number;
}

export const useSnapping = (
    segments: Segment[],
    snapThreshold: number = 10
) => {
    const snapPoints = useMemo(() => {
        const points: number[] = [0];

        segments.forEach(segment => {
            points.push(segment.startTime);
            points.push(segment.startTime + segment.duration);
        });

        return [...new Set(points)].sort((a, b) => a - b);
    }, [segments]);

    const findSnapPoint = (position: number, pixelsPerSecond: number): SnapResult => {
        const thresholdInTime = snapThreshold / pixelsPerSecond;

        for (const point of snapPoints) {
            const distance = Math.abs(position - point);

            if (distance < thresholdInTime) {
                return {
                    snappedPosition: point,
                    isSnapping: true,
                    snapLine: point,
                };
            }
        }

        return {
            snappedPosition: position,
            isSnapping: false,
        };
    };

    return { findSnapPoint, snapPoints };
};
