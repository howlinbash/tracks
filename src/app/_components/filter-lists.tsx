"use client";

import type {
  Category,
  CategoryFilterProps,
  FilterGraph,
  FilterListProps,
  FilterListsProps,
  Filters,
} from "~/types";
import { api } from "~/trpc/react";
import { eraEnum } from "../enums";
import { type EraEnum } from "@prisma/client";
import { ERAS } from "~/constants";
import {
  type MouseEvent,
  type KeyboardEvent,
  useState,
  useEffect,
} from "react";
import { useDebouncedCallback } from "use-debounce";

const setFilterState =
  (category: Category, filterId: number) => (state: Filters) => {
    let nextState = state;

    switch (category) {
      case "eras": {
        nextState = {
          eras: state.eras === filterId ? null : filterId,
          genres: null,
          artists: null,
        };
        break;
      }
      case "genres": {
        nextState = {
          eras: state.eras,
          genres: state.genres === filterId ? null : filterId,
          artists: null,
        };
        break;
      }
      case "artists": {
        nextState = {
          eras: state.eras,
          genres: state.genres,
          artists: state.artists === filterId ? null : filterId,
        };
        break;
      }
    }

    return nextState;
  };

export const CategoryFilterBody = ({
  active,
  category,
  filter,
  handleClick,
}: CategoryFilterProps) => {
  return (
    <li key={filter.id}>
      <div
        className={`m-0 w-full py-1 pl-4 pr-0 text-left ${(active ?? filter.active) && "bg-blue-500"
          }`}
        onClick={(e) => handleClick && handleClick(e, filter.id)}
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
  handleClick,
}: CategoryFilterProps) => {
  return (
    <CategoryFilterBody
      active={active}
      category={category}
      filter={filter}
      handleClick={handleClick}
    />
  );
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

const FilterList = ({
  category,
  filterGraph,
  index,
  filters,
  setFilter,
}: FilterListProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [dir, setDir] = useState<string | null>(null);
  const debounced = useDebouncedCallback((filterId: number) => {
    setFilter(setFilterState(category, filterId));
  }, 200);

  const filterList = getVisibleIds(category, filters, filterGraph)!;

  const handleClick = (e: MouseEvent<HTMLDivElement>, filterId: number) => {
    e.preventDefault();
    setActiveId((currentId) => (currentId === filterId ? null : filterId));
    setFilter(setFilterState(category, filterId));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "j") {
      setActiveId((currentId) => {
        if (!currentId) return filterList[0]!;
        if (currentId === filterList[filterList.length - 1]!) return currentId;
        return filterList[filterList.indexOf(currentId) + 1]!;
      });
      setDir("down");
    }

    if (event.key === "ArrowUp" || event.key === "k") {
      setActiveId((currentId) => {
        if (!currentId) return filterList[filterList.length - 1]!;
        if (currentId === filterList[0]!) return currentId;
        return filterList[filterList.indexOf(currentId) - 1]!;
      });
      setDir("up");
    }
  };

  useEffect(() => {
    if (!activeId) return;

    switch (dir) {
      case "down": {
        activeId !== filterList[filterList.length - 1] && debounced(activeId);
      }
      case "up": {
        activeId !== filterList[0] && debounced(activeId);
      }
    }
  }, [activeId]);

  return (
    <div
      tabIndex={index + 2}
      className="h-full w-full overflow-y-scroll border-2 border-slate-800 bg-slate-800 focus:border-2"
      onKeyDown={handleKeyDown}
      autoFocus={!!activeId}
    >
      <ul className="list-none p-0">
        {filterList.map((id) => (
          <CategoryFilter
            key={`${category}_${id}`}
            category={category as Category}
            filter={filterGraph[category].byId[id]!}
            active={activeId === id}
            handleClick={handleClick}
          />
        ))}
      </ul>
    </div>
  );
};

const initFilters = {
  eras: null,
  genres: null,
  artists: null,
};

const FilterLists = ({ filterGraph }: FilterListsProps) => {
  const [filters, setFilter] = useState<Filters>(initFilters);
  const utils = api.useUtils();
  const postFilter = api.filter.postFilter.useMutation({
    onSuccess: () => {
      void utils.song.getSongs.invalidate();
    },
  });

  useEffect(() => {
    postFilter.mutate(filters);
  }, [filters]);

  return Object.keys(filterGraph).map((category, i) => (
    <FilterList
      key={category}
      category={category as Category}
      filterGraph={filterGraph}
      index={i}
      filters={filters}
      setFilter={setFilter}
    />
  ));
};

export default FilterLists;
