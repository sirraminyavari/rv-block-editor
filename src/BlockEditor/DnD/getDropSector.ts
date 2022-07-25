import { DragEvent } from 'react';

import { Direction } from '../../BlockEditor';

/**
 * Calculates the drop depth (sector) based on user's mouse position relative
 * to the sector indicator UI elements.
 */
export default function getDropSector(
  { clientX: mouseX }: DragEvent,
  sectorRects: DOMRect[],
  dir: Direction
): number | null {
  if (!sectorRects.length) return null;
  const len = sectorRects.length;
  for (let i = 0; i < len; i++) {
    const sectorRect = sectorRects[i];
    if (dir === 'ltr' ? sectorRect.x >= mouseX : sectorRect.right <= mouseX)
      return i ? i - 1 : 0;
  }
  return len - 1;
}
