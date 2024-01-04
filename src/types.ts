import type { ERAS, GENRES, ARTISTS } from "~/constants";
import type { RouterOutputs } from "~/trpc/shared";
import { type Dispatch, type MouseEvent, type SetStateAction } from "react";

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

export type ElemPos<T extends number | undefined> = [T, T, T];

export type FilterLiProps = FilterLiServerProps & {
  active: boolean;
  listEvent: ListEvent;
  handleClick: (
    e: MouseEvent<HTMLDivElement>,
    filterId: number | undefined,
  ) => void;
  index?: number;
  listContainerPos: ElemPos<number | undefined>;
};

export type FilterListsProps = {
  filterGraph: FilterGraph;
};
