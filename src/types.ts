import type { ERAS, GENRES, ARTISTS } from "~/constants";
import type { RouterOutputs } from "~/trpc/shared";
import { type Dispatch, type MouseEvent, type SetStateAction } from "react";

export type Category = typeof ERAS | typeof GENRES | typeof ARTISTS;

export type CategoryFilter = RouterOutputs["filter"]["getFilters"][number];
export type FilterGraph = RouterOutputs["filter"]["getFilterGraph"];
export type Song = RouterOutputs["song"]["getSongs"][number];

export type Filters = {
  eras: null | number;
  genres: null | number;
  artists: null | number;
};

type SetFilter = Dispatch<SetStateAction<Filters>>;

export type FilterListProps = {
  category: Category;
  filters: Filters;
  filterGraph: FilterGraph;
  index: number;
  setFilter: SetFilter;
};

export type CategoryFilterProps = {
  active?: boolean;
  category: Category;
  filter: CategoryFilter;
  handleClick?: (e: MouseEvent<HTMLDivElement>, filterId: number) => void;
};

export type FilterListsProps = { filterGraph: FilterGraph };
