import type { ERAS, GENRES, ARTISTS } from "~/constants";
import type { RouterOutputs } from "~/trpc/shared";
import type { MouseEvent } from "react";

export type Song = RouterOutputs["song"]["getSongs"][number];

export type Category = typeof ERAS | typeof GENRES | typeof ARTISTS;

export type CategoryFilter = RouterOutputs["filter"]["getFilters"][number];

export type FilterListProps = {
  category: Category
  filters: CategoryFilter[]
}

export type CategoryFilterProps = {
  category: Category
  filter: CategoryFilter
  handleClick?: (e: MouseEvent<HTMLDivElement>) => Promise<void>
}
