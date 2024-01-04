"use client";

import { api } from "~/trpc/react";
import FilterLists from "./filter-lists";
import { type ReactNode } from "react";

type SwitcherProps = {
  children: ReactNode;
};

const FilterListLoader = ({ children }: SwitcherProps) => {
  const { data, isLoading } = api.filter.getFilterGraph.useQuery();

  return (
    <div className="grid h-[45vh] w-full grid-cols-[1fr_1fr_1fr] gap-4 px-4">
      {isLoading ? (
        children
      ) : (
        <FilterLists filterGraph={data!} />
      )}
    </div>
  );
};

export default FilterListLoader;
