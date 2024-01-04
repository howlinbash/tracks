"use client";

import type {
  Category,
  FilterLiProps,
  FilterGraph,
  FilterListProps,
  FilterListsProps,
  Filters,
  ElemPos,
  Dir,
} from "~/types";
import { api } from "~/trpc/react";
import { eraEnum } from "../enums";
import type { EraEnum } from "@prisma/client";
import { CategoryMap, ERAS } from "~/constants";
import {
  type MouseEvent,
  type KeyboardEvent,
  useState,
  useEffect,
  useRef,
  useMemo,
  memo,
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

const CategoryFilterLi = ({
  active,
  category,
  dir,
  filter,
  handleClick,
  listContainerPos,
}: FilterLiProps) => {
  const liRef = useRef<HTMLLIElement>(null);

  // Keep li in shot as you scroll into overflow
  useEffect(() => {
    if (active) {
      if (dir === "down") {
        const li = liRef?.current;
        if (li && listContainerPos[0]) {
          // console.log({ offsetTop: li.offsetTop, offsetHeight: li.offsetHeight, clientHeight: listContainerPos[0], dOffsetTop: listContainerPos[1], scrollTop: listContainerPos[2] });
          const overflowedBelow = (li.offsetTop + li.offsetHeight - listContainerPos[1]!) > listContainerPos[0];
          overflowedBelow && li.scrollIntoView({ block: "end" });
        }
      }
      if (dir === "up") {
        const li = liRef?.current;
        if (li && listContainerPos[0]) {
          // console.log({ offsetTop: li.offsetTop, offsetHeight: li.offsetHeight, clientHeight: listContainerPos[0], dOffsetTop: listContainerPos[1], scrollTop: listContainerPos[2] });
          const overflowedAbove = li.offsetTop < (listContainerPos[1]! + listContainerPos[2]!);
          overflowedAbove && li.scrollIntoView({ block: "start" });
        }
      }
    }
  }, [active, dir]);

  return (
    <li key={filter?.id ?? 0} ref={liRef}>
      <div
        className={`m-0 w-full py-1 pl-4 pr-0 text-left ${
          (active ?? filter?.active) && "bg-blue-500"
        }`}
        onClick={(e) => handleClick(e, filter?.id ?? 0)}
      >
        <span>
          {!filter
            ? "All"
            : category === ERAS
              ? eraEnum[filter.label as EraEnum]
              : filter.label}
        </span>
      </div>
    </li>
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

const FilterList = memo(function FilterList({
  category,
  filterGraph,
  filters,
  setFilter,
}: FilterListProps) {
  const [activeId, setActiveId] = useState<number>(0);
  const [dir, setDir] = useState<Dir>(null);
  const [gee, setGee] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const dRc = divRef?.current
  const divPos = useMemo<ElemPos<number|undefined>>(() => [dRc?.clientHeight, dRc?.offsetTop, dRc?.scrollTop], [dRc?.clientHeight, dRc?.offsetTop, dRc?.scrollTop]);
          
  const selectNextLi = useDebouncedCallback((filterId: number) => {
    setFilter(setFilterState(category, filterId));
  }, 300);

  const filterList = getVisibleIds(category, filters, filterGraph)!;

  const handleClick = (e: MouseEvent<HTMLDivElement>, filterId: number) => {
    e.preventDefault();
    setActiveId((currentId) => (currentId === filterId ? 0 : filterId));
    filterId !== 0 && setFilter(setFilterState(category, filterId));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "j") {
      setActiveId((currentId) => {
        if (currentId === 0) return filterList[0]!;
        if (currentId === filterList[filterList.length - 1]!) return currentId;
        return filterList[filterList.indexOf(currentId) + 1]!;
      });
      setDir("down");
    }

    if (event.key === "ArrowUp" || event.key === "k") {
      setActiveId((currentId) => {
        if (currentId === filterList[0]!) return 0;
        if (currentId === 0) return 0;
        return filterList[filterList.indexOf(currentId) - 1]!;
      });
      setDir("up");
    }

    if (event.key === "g") {
      if (!gee) {
        setGee(true);
        setTimeout(() => setGee((g) => g && false), 190);
      } else {
        setActiveId(0);
        setDir("jumpTop");
        setGee(false);
      }
    }

    if (event.key === "G") {
      setActiveId(filterList[filterList.length - 1]!);
      setDir("jumpBottom");
    }
  };

  // Reset child filters when changing parent
  useEffect(() => {
    if (activeId && !dir) {
      // TODO [Cosmetic] Fix lists of one reseting to all.
      // console.log('filter clear', filters);
      console.log('reset child when changing parent');
      !filters[category] && setActiveId(0);
    }
  }, [activeId, dir, filters[category]]);

  useEffect(() => {
    console.log('select next li');
    if (activeId === null || undefined) return;
    const ul = ulRef?.current;

    switch (dir) {
      case "down": {
        activeId !== filterList[filterList.length - 1] &&
          selectNextLi(activeId);
        break;
      }
      case "up": {
        activeId !== filterList[0] && selectNextLi(activeId);
        break;
      }
      case "jumpTop": {
        selectNextLi(activeId);
        ul && ul.scrollIntoView({ block: "start", behavior: "smooth" });
        break;
      }
      case "jumpBottom": {
        selectNextLi(activeId);
        ul && ul.scrollIntoView({ block: "end", behavior: "smooth" });
        break;
      }
    }
  }, [activeId]);

  useEffect(() => {
    console.log('handleBlur');
    const handleBlur = () => setDir(null);
    const div = divRef?.current;
    div?.addEventListener('blur', handleBlur);
    return () => div?.removeEventListener('blur', handleBlur);
  }, [])

  // category === 'genres' && console.log('scrollTop', divRef?.current?.scrollTop);
  console.log(category, dir, gee, activeId, filters);
  return (
    <div
      tabIndex={0}
      className="h-full w-full overflow-y-scroll border-2 border-slate-800 bg-slate-800 focus:border-2"
      onKeyDown={handleKeyDown}
      ref={divRef}
    >
      <ul className="list-none p-0" ref={ulRef}>
        <CategoryFilterLi
          key={`${category}_0`}
          category={category as Category}
          active={activeId === 0}
          handleClick={handleClick}
          listContainerPos={divPos}
          dir={dir}
        />
        {filterList.map((id) => (
          <CategoryFilterLi
            key={`${category}_${id}`}
            category={category as Category}
            filter={filterGraph[category].byId[id]}
            active={activeId === id}
            handleClick={handleClick}
            listContainerPos={divPos}
            dir={dir}
          />
        ))}
      </ul>
    </div>
  );
});

const initFilters = {
  eras: null,
  genres: null,
  artists: null,
};

const FilterLists = ({ filterGraph }: FilterListsProps) => {
  const [filters, setFilter] = useState<Filters>(initFilters);
  const utils = api.useUtils();
  const postFilter = api.filter.postFilter.useMutation({
    onMutate: () => console.log('mutate'),
    onSettled: () => console.log('settled'),
    onSuccess: () => {
      console.log('success');
      void utils.song.getSongs.invalidate();
    },
  });

  useEffect(() => {
    console.log('useEffect');
    postFilter.mutate(filters);
  }, [filters]);

  console.log('filterlists');
  return CategoryMap.map((category) => (
    <FilterList
      key={category}
      category={category as Category}
      filterGraph={filterGraph}
      filters={filters}
      setFilter={setFilter}
    />
  ));
};

export default FilterLists;
