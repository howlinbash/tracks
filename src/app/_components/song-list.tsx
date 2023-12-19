"use client"

import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import type { Song } from "~/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<Song>()

const columns = [
  columnHelper.accessor('era', {
    cell: info => eraEnum[info.getValue() as EraEnum],
    header: () => <span>Era</span>,
  }),
  columnHelper.accessor('genre', {
    cell: info => info.getValue(),
    header: () => <span>Genre</span>,
  }),
  columnHelper.accessor('artist', {
    header: () => <span>Artist</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('song', {
    header: () => <span>Song</span>,
    cell: info => info.getValue(),
  }),
]

export type SongListProps = { items?: Song[] };

const SongList = ({ items: songs }: SongListProps) => {
  const table = useReactTable({
    data: songs!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full overflow-y-scroll px-4">
      <table className="bg-slate-800 w-full h-full">
        <thead className="sticky top-0 bg-slate-800">
          {table.getHeaderGroups().map(headerGroup => (
            <tr className="flex w-full py-2 pl-6 text-left" key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th className="w-full" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
          <hr className="m-0 h-px bg-stone-200" />
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr className="flex w-full py-1 pl-6 text-left" key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td className="w-full" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
