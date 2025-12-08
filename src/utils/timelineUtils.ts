export const pixelsToTime = (pixels: number, pixelsPerSecond: number): number => {
    return pixels / pixelsPerSecond;
};

export const timeToPixels = (time: number, pixelsPerSecond: number): number => {
    return time * pixelsPerSecond;
};

export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};
