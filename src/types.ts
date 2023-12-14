import type { ERAS, GENRES, ARTISTS } from "~/constants";
import type { RouterOutputs } from "~/trpc/shared";

export type Category = typeof ERAS | typeof GENRES | typeof ARTISTS;

export type CategoryFilter = RouterOutputs["filter"]["getFilters"][number];

export type FilterListProps = {
  category: Category
}

export type CategoryFilterProps = {
  category: Category
  filter: CategoryFilter
}
