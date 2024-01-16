"use client";

import type { SongListProps } from "~/types";
import {
  useCallback,
  useRef,
} from "react";
import {
  type Range,
  type VirtualizerOptions,
  defaultRangeExtractor,
  elementScroll,
  useVirtualizer,
} from "@tanstack/react-virtual";
import { Table, VirtualTableRow, useKeyBindings, useSongTable } from "./song-list-utils";

function easeInOutQuint(t: number) {
  const easeIn = 10;
  const easeOut = 5;
  return t < 0.5 ? 4 * t ** easeIn : 1 + 4 * (--t) ** easeOut;
}

const WindowedSongList = ({ songs }: SongListProps) => {
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const scrollingRef = useRef<number>()
  const rangeRef = useRef<Range | null>(null);
  const table = useSongTable(songs);
  const { rows } = table.getRowModel();

  const scrollToFn: VirtualizerOptions<HTMLTableSectionElement, HTMLElement>['scrollToFn'] =
    useCallback((offset, canSmooth, instance) => {
      if (!bodyRef.current) return;
      const duration = 1000
      const start = bodyRef.current.scrollTop
      const startTime = (scrollingRef.current = Date.now())

      const run = () => {
        if (scrollingRef.current !== startTime) return
        const now = Date.now()
        const elapsed = now - startTime
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
        const interpolated = start + (offset - start) * progress

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance)
          requestAnimationFrame(run)
        } else {
          elementScroll(interpolated, canSmooth, instance)
        }
      }

      requestAnimationFrame(run)
    }, [])

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => bodyRef.current,
    overscan: 10,
    scrollToFn,
    rangeExtractor: useCallback((range: Range) => {
      rangeRef.current = range;

      return defaultRangeExtractor(range);
    }, [])
  });

  const { activeRow, handleClick, handleKeyDown, listEvent } = useKeyBindings(songs, rowVirtualizer.scrollToIndex);

  return (
    <Table bodyRef={bodyRef} handleKeyDown={handleKeyDown} table={table}>
      <div className="relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow, i) => (
          <VirtualTableRow
            active={virtualRow.index === activeRow}
            index={i}
            handleClick={handleClick}
            key={virtualRow.index}
            listEvent={listEvent}
            range={rangeRef.current}
            row={rows[virtualRow.index]!}
            vRow={virtualRow}
          />
        ))}
      </div>
    </Table>
  );
};

export default WindowedSongList;
