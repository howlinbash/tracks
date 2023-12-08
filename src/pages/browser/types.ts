import type { ERAS, GENRES, ARTISTS } from "~/constants";

export type Song = {
  id: number
  label: string
}

export type Category = typeof ERAS | typeof GENRES | typeof ARTISTS;

export type FilterListProps = {
  category: Category
}
