/**
 * Sum lengths of segments of table text.
 */
export const sumSegments = (segments: string[]) =>
    segments.reduce((a, v) => a + v.length + 1, 0)
