"use client";

import { api } from "~/trpc/react";
import type { ComponentType, ReactNode } from "react";
import type { Category, FilterListProps } from "~/types";

type SwitcherProps<T> = {
  children: ReactNode
  Component: ComponentType<T>
  category: Category
}

const FilterSwitcher = ({ children, Component, category }: SwitcherProps<FilterListProps>) => {
  const { data, isLoading } = api.filter.getFilters.useQuery({
    category,
  });
  return isLoading ? children : <Component filters={data!} category={category} />;
};

export default FilterSwitcher;
