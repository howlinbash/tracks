import type { ERAS, GENRES, ARTISTS } from "~/constants";
import type { RouterOutputs } from "~/trpc/shared";
import type { Dispatch, MouseEvent, SetStateAction } from "react";

export type Song = RouterOutputs["song"]["getSongs"][number];

export type Category = typeof ERAS | typeof GENRES | typeof ARTISTS;

export type CategoryFilter = RouterOutputs["filter"]["getFilters"][number];

export type FilterListProps = {
  category: Category;
  filters: CategoryFilter[];
};

export type CategoryFilterSharedProps = {
  active?: boolean;
  category: Category;
  filter: CategoryFilter;
};

export type Filters = {
  eras: null | number;
  genres: null | number;
  artists: null | number;
};

export type CategoryFilterProps = CategoryFilterSharedProps & {
  setFilter: Dispatch<SetStateAction<Filters>>;
};

export type CategoryFilterBodyProps = CategoryFilterSharedProps & {
  handleClick?: (e: MouseEvent<HTMLDivElement>) => void;
};

export type FilterGraph = RouterOutputs["filter"]["getFilterGraph"];

export type FilterListsProps = { filterGraph: FilterGraph };
