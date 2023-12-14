import type { ERAS, GENRES, ARTISTS } from "~/constants";
import type { RouterOutputs } from "~/trpc/shared";

export type Song = {
  id: number
  label: string
}

export type Category = typeof ERAS | typeof GENRES | typeof ARTISTS;

type Filter = RouterOutputs["filter"]["getFilters"][number];

export type FilterListProps = {
  category: Category
}

export type CategoryFilterProps = {
  category: Category
  filter: Filter
}
