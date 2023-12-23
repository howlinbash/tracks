"use client";

import type {
  Category,
  CategoryFilterBodyProps,
  CategoryFilterProps,
  FilterGraph,
  FilterListsProps,
  Filters,
} from "~/types";
import { api } from "~/trpc/react";
import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import { ERAS } from "~/constants";
import { useState, type MouseEvent } from "react";

export const CategoryFilterBody = ({
  active,
  category,
  filter,
  handleClick,
}: CategoryFilterBodyProps) => {
  return (
    <li key={filter.id}>
      <div
        className={`m-0 w-full py-1 pl-4 pr-0 text-left ${
          (active ?? filter.active) && "bg-blue-500"
        }`}
        onClick={handleClick}
      >
        <span>
          {category === ERAS ? eraEnum[filter.label as EraEnum] : filter.label}
        </span>
      </div>
    </li>
  );
};

const CategoryFilter = ({
  active,
  category,
  filter,
  setFilter,
}: CategoryFilterProps) => {
  const utils = api.useUtils();
  const postFilter = api.filter.postFilter.useMutation({
    onSuccess: () => {
      void utils.song.getSongs.invalidate();
    },
  });

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFilter((state) => {
      let nextState: Filters = state;
      switch (category) {
        case "eras": {
          console.log("switch eras");
          nextState = {
            eras: state.eras === filter.id ? null : filter.id,
            genres: null,
            artists: null,
          };
          break;
        }
        case "genres": {
          console.log("switch genres");
          nextState = {
            eras: state.eras,
            genres: state.genres === filter.id ? null : filter.id,
            artists: null,
          };
          break;
        }
        case "artists": {
          console.log("switch artists");
          nextState = {
            eras: state.eras,
            genres: state.genres,
            artists: state.artists === filter.id ? null : filter.id,
          };
          break;
        }
      }

      postFilter.mutate(nextState);
      return nextState;
    });
  };

  return (
    <CategoryFilterBody
      active={active}
      category={category}
      filter={filter}
      handleClick={handleClick}
    />
  );
};

const initFilters = {
  eras: null,
  genres: null,
  artists: null,
};

const getVisibleIds = (
  category: Category,
  filters: Filters,
  filterGraph: FilterGraph,
) => {
  switch (category) {
    case "eras":
      return filterGraph.eras.allIds;
    case "genres": {
      if (filters.eras) {
        return filterGraph.eras.byId[filters.eras]!.genres;
      }
      return filterGraph.genres.allIds;
    }
    case "artists": {
      if (filters.eras && filters.genres) {
        return filterGraph.genres.byId[filters.genres]!.artists[filters.eras];
      }
      if (filters.eras) {
        return filterGraph.eras.byId[filters.eras]!.artists;
      }
      if (filters.genres) {
        return filterGraph.genres.byId[filters.genres]!.artists.all;
      }
      return filterGraph.artists.allIds;
    }
  }
};

const FilterLists = ({ filterGraph }: FilterListsProps) => {
  const [filters, setFilter] = useState<Filters>(initFilters);

  return Object.entries(filterGraph).map(([category, graph]) => (
    <div
      className="h-full w-full overflow-y-scroll bg-slate-800"
      key={category}
    >
      <ul className="list-none p-0">
        {getVisibleIds(category as Category, filters, filterGraph)!.map(
          (id) => (
            <CategoryFilter
              key={`${category}_${id}`}
              category={category as Category}
              filter={graph.byId[id]!}
              active={filters[category as Category] === id}
              setFilter={setFilter}
            />
          ),
        )}
      </ul>
    </div>
  ));
};

export default FilterLists;
