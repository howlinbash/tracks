"use client";

import { api } from "~/trpc/react";
import type { ComponentType, ReactNode } from "react";
import type { FilterListsProps } from "~/types";

type SwitcherProps<T> = {
  children: ReactNode;
  Component: ComponentType<T>;
};

const FilterSwitcher = ({
  children,
  Component,
}: SwitcherProps<FilterListsProps>) => {
  const { data, isLoading } = api.filter.getFilterGraph.useQuery();
  return isLoading ? children : <Component filterGraph={data!} />;
};

export default FilterSwitcher;
