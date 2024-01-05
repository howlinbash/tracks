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
  containerPos,
  handleClick,
  index,
  listEvent,
  row,
  scrollCorrect,
}: TableRowProps<T>) => {
  const rowRef = useRef<HTMLTableRowElement>(null);

  // Keep row in shot as you scroll into overflow
  useEffect(() => {
    if (active) {
      const rRef = rowRef?.current;
      if (listEvent === "down") {
        if (rRef && containerPos) {
          const overflowedBelow =
            rRef.offsetTop >
            containerPos[2] + containerPos[0] - containerPos[3];
          overflowedBelow && rRef.scrollIntoView({ block: "end" });
        }
      }
      if (listEvent === "up") {
        if (rRef && containerPos) {
          const overflowedAbove =
            rRef.offsetTop < containerPos[3] + containerPos[2];
          if (overflowedAbove) {
            rRef.scrollIntoView({ block: "start" });
            scrollCorrect();
          }
        }
      }
    }
  }, [active, listEvent]);

  return (
    <tr
      className={`grid w-full grid-cols-[auto_3fr_4fr_5fr] py-1 pl-6 text-left ${
        active && "bg-blue-500"
      }`}
      onClick={(e) => handleClick(e, index)}
      ref={rowRef}
    >
      {row.getVisibleCells().map((cell, i) => (
        <td
          className={`${
            i === 0 ? "w-16" : ""
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
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLTableSectionElement>(null);
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const cRc = containerRef?.current;
  const hRc = headRef?.current;
  const containerPos = useMemo<ElemPos>(() => {
    return !cRc
      ? null
      : [cRc.clientHeight, cRc.offsetTop, cRc.scrollTop, hRc!.clientHeight];
  }, [
    cRc,
    hRc,
    cRc?.clientHeight,
    cRc?.offsetTop,
    cRc?.scrollTop,
    hRc?.clientHeight,
  ]);

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
    const cRc = containerRef.current;

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
        if (bRc) {
          bRc.scrollTo({ top: 0, behavior: "smooth" });
          scrollCorrect();
        }
      }
    }

    if (event.key === "G") {
      songs && setActiveRow(songs.length - 1);
      cRc && cRc.scrollIntoView({ block: "end", behavior: "smooth" });
    }

    if (event.key === "PageDown" || event.key === "d") {
      cRc && page(cRc, 1);
    }

    if (event.key === "PageUp" || event.key === "u") {
      cRc && page(cRc, 0);
    }
  };

  const scrollCorrect = () => {
    if (!hRc || !cRc) return;
    cRc.scrollBy({ top: -hRc.clientHeight });
  };

  return (
    <div
      className="ml-4 w-[calc(100%-32px)] overflow-y-scroll border-2 border-slate-800 bg-slate-800 focus:border-2"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={containerRef}
    >
      <table className="h-full w-full bg-slate-800">
        <thead className="sticky top-0 bg-slate-800" ref={headRef}>
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
        <tbody ref={bodyRef}>
          {table.getRowModel().rows.map((row, i) => (
            <TableRow
              active={i === activeRow}
              containerPos={containerPos}
              handleClick={handleClick}
              index={i}
              key={row.id}
              listEvent={listEvent}
              row={row}
              scrollCorrect={scrollCorrect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
