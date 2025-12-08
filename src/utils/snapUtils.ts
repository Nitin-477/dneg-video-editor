export const snapToGrid = (value: number, gridSize: number): number => {
    return Math.round(value / gridSize) * gridSize;
};

export const findNearestSnapPoint = (
    position: number,
    snapPoints: number[],
    threshold: number
): number | null => {
    for (const point of snapPoints) {
        if (Math.abs(position - point) < threshold) {
            return point;
        }
    }
    return null;
};
