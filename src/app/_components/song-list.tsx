"use client";

import { eraEnum } from "../enums";

import { type EraEnum } from "@prisma/client";
import type { ElemPos, ListEvent, Song, TableRowProps } from "~/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useMemo,
  type MouseEvent,
} from "react";
import { page } from "../_utils";

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

const TableRow = <T,>({
  active,
  bodyAtts,
  handleClick,
  index,
  listEvent,
  row,
}: TableRowProps<T>) => {
  const rowRef = useRef<HTMLTableRowElement>(null);

  // Keep row in shot as you scroll into overflow
  useEffect(() => {
    if (active) {
      const rRef = rowRef?.current;
      if (listEvent === "down") {
        if (rRef && bodyAtts) {
          const overflowedBelow = rRef.offsetTop > bodyAtts[0] + bodyAtts[2];
          overflowedBelow && rRef.scrollIntoView({ block: "end" });
        }
      }
      if (listEvent === "up") {
        if (rRef && bodyAtts) {
          const overflowedAbove = rRef.offsetTop < bodyAtts[1] + bodyAtts[2];
          overflowedAbove && rRef.scrollIntoView({ block: "start" });
        }
      }
    }
  }, [active, listEvent]);

  return (
    <tr
      className={`grid w-full grid-cols-[auto_3fr_4fr_5fr] py-1 pl-6 text-left ${active && "bg-blue-500"
        }`}
      onClick={(e) => handleClick(e, index)}
      ref={rowRef}
    >
      {row.getVisibleCells().map((cell, i) => (
        <td
          className={`${i === 0 ? "w-16" : ""
            } overflow-hidden text-ellipsis whitespace-nowrap`}
          key={cell.id}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

export type SongListProps = { songs?: Song[] };

const SongList = ({ songs }: SongListProps) => {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [listEvent, setListEvent] = useState<ListEvent>(null);
  const [gee, setGee] = useState(false);
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const bRc = bodyRef?.current;
  const bodyAtts = useMemo<ElemPos>(() => {
    return !bRc ? null : [bRc.clientHeight, bRc.offsetTop, bRc.scrollTop];
  }, [bRc, bRc?.clientHeight, bRc?.offsetTop, bRc?.scrollTop]);

  const table = useReactTable({
    data: songs!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleClick = (e: MouseEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    setListEvent("click");
    setActiveRow((currentIndex) => (currentIndex === index ? null : index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const bRc = bodyRef.current;

    if (event.key === "ArrowDown" || event.key === "j") {
      setActiveRow((currentRow) => {
        if (currentRow === null) return 0;
        if (currentRow === songs!.length - 1) return currentRow;
        return currentRow + 1;
      });
      setListEvent("down");
    }

    if (event.key === "ArrowUp" || event.key === "k") {
      setActiveRow((currentRow) => {
        if (currentRow === null) return songs!.length - 1;
        if (currentRow === 0) return currentRow;
        return currentRow - 1;
      });
      setListEvent("up");
    }

    if (event.key === "g") {
      if (!gee) {
        setGee(true);
        setTimeout(() => setGee((g) => g && false), 190);
      } else {
        setActiveRow(0);
        setGee(false);
        bRc && bRc.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    if (event.key === "G") {
      songs && setActiveRow(songs.length - 1);
      bRc && bRc.scrollIntoView({ block: "end", behavior: "smooth" });
    }

    if (event.key === "PageDown" || event.key === "d") {
      bRc && page(bRc, 1);
    }

    if (event.key === "PageUp" || event.key === "u") {
      bRc && page(bRc, 0);
    }
  };

  return (
    <div
      className="relative ml-4 max-h-full w-[calc(100%-32px)] border-2 border-slate-800 bg-slate-800 focus:border-2"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <table className="absolute flex h-full w-full flex-col bg-slate-800">
        <thead className="top-0 bg-slate-800">
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
        <tbody ref={bodyRef} className={`w-full flex-1 overflow-y-scroll`}>
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
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
