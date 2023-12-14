"use client";

import { type CategoryFilterProps } from "~/types";
import { api } from "~/trpc/react";
import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import { ERAS } from "~/constants";
import type { MouseEvent } from "react";

const CategoryFilter = ({ category, filter }: CategoryFilterProps) => {
  const setFilter = api.filter.setFilter.useMutation({
    onSuccess: (res) => {
      console.log({ res });
    },
  });

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFilter.mutate({ category, filterId: filter.id });
  };

  return (
    <li key={filter.id}>
      <div
        className={`m-0 w-full py-4 pl-6 pr-0 text-left text-lg${
          filter.active && " bg-blue-950"
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

export default CategoryFilter;
