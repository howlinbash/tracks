"use client";

import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import type { Song } from "~/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable, type Row
} from "@tanstack/react-table";
import { type KeyboardEvent, useState } from "react";

const columnHelper = createColumnHelper<Song>();

const columns = [
  columnHelper.accessor("era", {
    cell: (info) => eraEnum[info.getValue() as EraEnum],
    header: () => <span>Era</span>,
  }),
  columnHelper.accessor("genre", {
    cell: (info) => info.getValue(),
    header: () => <span>Genre</span>,
  }),
  columnHelper.accessor("artist", {
    header: () => <span>Artist</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("song", {
    header: () => <span>Song</span>,
    cell: (info) => info.getValue(),
  }),
];

type TableRowProps<T> = { row: Row<T>, active: boolean };

const TableRow = <T,>({ row, active }: TableRowProps<T>) => {
  return (
    <tr className={`grid w-full grid-cols-[auto_3fr_4fr_5fr] py-1 pl-6 text-left ${active && "bg-blue-500"}`}>
      {row.getVisibleCells().map((cell, i) => (
        <td className={`${i === 0 ? "w-16" : ""} text-ellipsis whitespace-nowrap overflow-hidden`} key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

export type SongListProps = { songs?: Song[] };

const SongList = ({ songs }: SongListProps) => {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  // const selectNextRow = useDebouncedCallback((filterId: number) => {
  //   setFilter(setFilterState(category, filterId));
  // }, 100);

  const table = useReactTable({
    data: songs!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "j") {
      setActiveRow((currentRow) => {
        if (currentRow === null) return 0;
        if (currentRow === songs!.length - 1) return currentRow;
        return currentRow + 1;
      });
    }

    if (event.key === "ArrowUp" || event.key === "k") {
      setActiveRow((currentRow) => {
        if (currentRow === null) return songs!.length - 1;
        if (currentRow === 0) return currentRow;
        return currentRow - 1;
      });
    }
  };

  // TODO: Add windowing
  return (
    <div
      className="ml-4 w-[calc(100%-32px)] overflow-y-scroll border-2 border-slate-800 bg-slate-800 focus:border-2"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <table className="h-full w-full bg-slate-800">
        <thead className="sticky top-0 bg-slate-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              className="grid w-full grid-cols-[auto_3fr_4fr_5fr] border-b border-stone-200 py-2 pl-6 text-left"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header, i) => (
                <th className={i === 0 ? "w-16" : ""} key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <TableRow row={row} active={i === activeRow} key={row.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
