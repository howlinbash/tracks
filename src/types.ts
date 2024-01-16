import type { ERAS, GENRES, ARTISTS } from "~/constants";
import type { RouterOutputs } from "~/trpc/shared";
import type { Dispatch, MouseEvent, SetStateAction } from "react";
import type { Row } from "@tanstack/react-table";
import type { Range, VirtualItem } from "@tanstack/react-virtual";

export type Category = typeof ERAS | typeof GENRES | typeof ARTISTS;

export type CategoryFilter = RouterOutputs["filter"]["getFilters"][number];
export type FilterGraph = RouterOutputs["filter"]["getFilterGraph"];
export type Song = RouterOutputs["song"]["getSongs"][number];
export type Songs = RouterOutputs["song"]["getSongs"];

export type Filters = {
  eras: null | number;
  genres: null | number;
  artists: null | number;
};

export type ListEvent =
  | "click"
  | "up"
  | "down"
  | "jumpTop"
  | "jumpBottom"
  | null;

type SetFilters = Dispatch<SetStateAction<Filters>>;

export type FilterListProps = {
  category: Category;
  filters: Filters;
  filterGraph: FilterGraph;
  setFilters: SetFilters;
};

export type FilterLiServerProps = {
  category: Category;
  filter?: CategoryFilter;
};

export type ElemPos = [number, number, number] | null;

export type FilterLiProps = FilterLiServerProps & {
  active: boolean;
  listEvent: ListEvent;
  handleClick: (
    e: MouseEvent<HTMLDivElement>,
    filterId: number | undefined,
  ) => void;
  index?: number;
  listContainerPos: ElemPos;
};

export type FilterListsProps = {
  filterGraph: FilterGraph;
};

type CommonTableRowProps<T> = {
  active: boolean;
  handleClick: (
    e: MouseEvent<HTMLTableRowElement>,
    i: number,
  ) => void;
  index: number;
  listEvent: ListEvent
  row: Row<T>;
}

export type TableRowProps<T> = CommonTableRowProps<T> & {
  bodyAtts: ElemPos;
};

export type VirtualTableRowProps<T> = CommonTableRowProps<T> & {
  range: Range | null;
  vRow: VirtualItem;
};

export type InnerTableRowProps<T> = { row: Row<T> };

export type SongListProps = { songs?: Song[] };

type ScrollAlignment = 'start' | 'center' | 'end' | 'auto';
type ScrollBehavior = 'auto' | 'smooth';
interface ScrollToOptions {
    align?: ScrollAlignment;
    behavior?: ScrollBehavior;
}
export type ScrollToIndex = (index: number, options?: ScrollToOptions) => void;
