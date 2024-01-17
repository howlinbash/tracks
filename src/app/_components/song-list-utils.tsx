import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import type {
  InnerTableRowProps,
  ListEvent,
  Song,
  TableRowProps,
  VirtualTableRowProps,
  ScrollToIndex,
} from "~/types";
import {
  type Table as TansStackTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { page } from "../_utils";
import Prompt from "./prompt";

const InnerTableRow = <T,>({ row }: InnerTableRowProps<T>) =>
  row.getVisibleCells().map((cell, i) => (
    <td
      className={`${
        i === 0 ? "w-16" : ""
      } overflow-hidden text-ellipsis whitespace-nowrap`}
      key={cell.id}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  ));

export const TableRow = <T,>({
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
      className={`grid w-full grid-cols-[auto_3fr_4fr_5fr] py-1 pl-6 text-left ${
        active && "bg-blue-500"
      }`}
      onClick={(e) => handleClick(e, index)}
      ref={rowRef}
    >
      <InnerTableRow row={row} />
    </tr>
  );
};

export const VirtualTableRow = <T,>({
  active,
  handleClick,
  index,
  listEvent,
  range,
  row,
  vRow,
}: VirtualTableRowProps<T>) => {
  const rowRef = useRef<HTMLTableRowElement>(null);

  // Keep row in shot as you scroll into overflow
  useEffect(() => {
    if (active && range) {
      const ref = rowRef?.current;
      if (ref) {
        if (listEvent === "down") {
          const inRange = vRow.index < range.endIndex;
          !inRange && ref.scrollIntoView({ block: "end" });
        }
        if (listEvent === "up") {
          const inRange = vRow.index > range.startIndex;
          !inRange && ref.scrollIntoView({ block: "start" });
        }
      }
    }
  }, [active, listEvent]);

  if (!vRow) return null;

  return (
    <tr
      className={`absolute left-0 top-0 grid w-full grid-cols-[auto_3fr_4fr_5fr] py-1 pl-6 text-left h-[${
        vRow.size
      }px]  ${active && "bg-blue-500"}`}
      key={index}
      onClick={(e) => handleClick(e, index)}
      ref={rowRef}
      style={{ transform: `translateY(${vRow.start}px)` }}
    >
      <InnerTableRow row={row} />
    </tr>
  );
};

type TableProps<T> = {
  bodyRef: RefObject<HTMLTableSectionElement>;
  children: ReactNode;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  isPrompting: boolean;
  setIsPrompting: (is: boolean) => void;
  song: Song | undefined;
  table: TansStackTable<T>;
};

export const Table = <T,>({
  bodyRef,
  children,
  handleKeyDown,
  isPrompting,
  setIsPrompting,
  song,
  table,
}: TableProps<T>) => {
  return (
    <>
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
            {children}
          </tbody>
        </table>
      </div>
      {isPrompting && song ? (
        <Prompt setIsPrompting={setIsPrompting} song={song} />
      ) : null}
    </>
  );
};

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

export const useSongTable = (songs: Song[] | undefined) => {
  const table = useReactTable({
    data: songs!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return table;
};

export const useKeyBindings = (
  songs: Song[] | undefined,
  bodyRef: RefObject<HTMLTableSectionElement> | undefined,
  scrollToIndex: ScrollToIndex | undefined,
) => {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [isPrompting, setIsPrompting] = useState(false);
  const [gee, setGee] = useState(false);
  const [listEvent, setListEvent] = useState<ListEvent>(null);

  const handleClick = (e: MouseEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    setActiveRow((currentIndex) => (currentIndex === index ? null : index));
    setIsPrompting(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const bRc = bodyRef?.current;

    if (event.key === "Enter") {
      setIsPrompting((p) => !p);
    }

    if (event.key === "Escape") {
      setIsPrompting(false);
    }

    if (isPrompting) return; // ensure only above bindings apply to Prompt

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
        if (currentRow === null || currentRow === 0) return currentRow;
        return currentRow - 1;
      });
      setListEvent("up");
    }

    if (event.key === "G" || event.key === "End") {
      songs && setActiveRow(songs.length - 1);
      if (scrollToIndex) {
        songs && scrollToIndex(songs.length - 1);
      } else {
        bRc && bRc.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    }

    if (event.key === "g" || event.key === "Home") {
      if (!gee && event.key === "g") {
        setGee(true);
        setTimeout(() => setGee((g) => g && false), 190);
      } else {
        setActiveRow(0);
        setGee(false);
        if (scrollToIndex) {
          scrollToIndex(0);
        } else {
          bRc && bRc.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }

    if (event.key === "PageDown" || event.key === "d") {
      bRc && page(bRc, 1);
    }

    if (event.key === "PageUp" || event.key === "u") {
      bRc && page(bRc, 0);
    }
  };

  return {
    activeRow,
    bodyRef,
    handleClick,
    handleKeyDown,
    isPrompting,
    listEvent,
    setIsPrompting,
  };
};
