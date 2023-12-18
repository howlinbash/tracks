"use client";

import type { CategoryFilterProps, FilterListProps } from "~/types";
import { api } from "~/trpc/react";
import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import { ERAS } from "~/constants";
import type { MouseEvent } from "react";

export const CategoryFilterBody = ({ category, filter, handleClick }: CategoryFilterProps) => {
  return (
    <li key={filter.id}>
      <div
        className={`m-0 w-full py-4 pl-6 pr-0 text-left text-lg ${filter.active && "bg-blue-950"
          }`}
        onClick={handleClick}
      >
        <span>
          {category === ERAS ? eraEnum[filter.label as EraEnum] : filter.label}
        </span>
      </div>
      <hr className="m-0 ml-6 h-px bg-stone-200" />
    </li>
  );
};

const CategoryFilter = ({ category, filter }: CategoryFilterProps) => {
  const utils = api.useUtils()
  const setFilter = api.filter.setFilter.useMutation({
    onSuccess: (res) => {
      console.log({ res });
      void utils.filter.getFilters.invalidate()
    },
  });

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFilter.mutate({ category, filterId: filter.id });
  };

  return (
    <CategoryFilterBody category={category} filter={filter} handleClick={handleClick} />
  );
};

const FilterList = ({ category, filters }: FilterListProps) => {
  return (
    <div className="h-full w-full overflow-y-scroll">
      <ul className="list-none p-0">
        {filters.map((filter) => (
          <CategoryFilter category={category} filter={filter} />
        ))}
      </ul>
    </div>
  );
};

export default FilterList;
