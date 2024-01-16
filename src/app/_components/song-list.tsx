"use client";

import type { ElemPos, SongListProps } from "~/types";
import { useMemo } from "react";
import { Table, TableRow, useKeyBindings, useSongTable } from "./song-list-utils";

const SongList = ({ songs }: SongListProps) => {
  const { activeRow, bodyRef, handleClick, handleKeyDown, listEvent } = useKeyBindings(songs, undefined);
  const table = useSongTable(songs);
  const bRc = bodyRef?.current;
  const bodyAtts = useMemo<ElemPos>(() => {
    return !bRc ? null : [bRc.clientHeight, bRc.offsetTop, bRc.scrollTop];
  }, [bRc, bRc?.clientHeight, bRc?.offsetTop, bRc?.scrollTop]);

  return (
    <Table bodyRef={bodyRef} handleKeyDown={handleKeyDown} table={table}>
      {table.getRowModel().rows.map((row, i) => (
        <TableRow
          active={i === activeRow}
          bodyAtts={bodyAtts}
          handleClick={handleClick}
          index={i}
          key={row.id}
          listEvent={listEvent}
          row={row}
        />
      ))}
    </Table>
  );
};

export default SongList;
