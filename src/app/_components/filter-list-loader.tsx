"use client";

import { api } from "~/trpc/react";
import FilterLists from "./filter-lists";
import { type ReactNode } from "react";

type SwitcherProps = {
  children: ReactNode;
};

const FilterListLoader = ({ children }: SwitcherProps) => {
  const { data, isLoading } = api.filter.getFilterGraph.useQuery();

  return isLoading ? children : <FilterLists filterGraph={data!} />;
};

export default FilterListLoader;
