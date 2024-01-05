"use client";

import type {
  Category,
  FilterLiProps,
  FilterGraph,
  FilterListProps,
  FilterListsProps,
  Filters,
  ListEvent,
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
import { page } from "../_utils";

/*
 *  From the FilterList component any listEvent (click, keyboard triggered
 *  cursor movement), will trigger an update to the activeLi (which is just the
 *  filterList array index).
 *
 *  There is a useEffect listening for activeLi updates if its a legitimate
 *  event it will trigger the setFilters debouncer (selectNextLi).
 *
 *  The setFilters debouncer triggers the mutation in the FilterLists parent
 */

const CategoryFilterLi = ({
  active,
  category,
  listEvent,
  filter,
  handleClick,
  index,
  listContainerPos,
}: FilterLiProps) => {
  const liRef = useRef<HTMLLIElement>(null);

  // Keep li in shot as you scroll into overflow
  useEffect(() => {
    if (active) {
      const li = liRef?.current;
      if (listEvent === "down") {
        if (li && listContainerPos) {
          const overflowedBelow = (li.offsetTop + li.offsetHeight - listContainerPos[1]!) > listContainerPos[0]!;
          overflowedBelow && li.scrollIntoView({ block: "end" });
        }
      }
      if (listEvent === "up") {
        if (li && listContainerPos) {
          const overflowedAbove = li.offsetTop < (listContainerPos[1]! + listContainerPos[2]!);
          overflowedAbove && li.scrollIntoView({ block: "start" });
        }
      }
    }
  }, [active, listEvent]);

  return (
    <li key={filter?.id ?? 0} ref={liRef}>
      <div
        className={`m-0 w-full py-1 pl-4 pr-0 text-left ${(active ?? filter?.active) && "bg-blue-500"
          }`}
        onClick={(e) => handleClick(e, index)}
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

const setFiltersState =
  (category: Category, filterId: number | null) => (state: Filters) => {
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

const FilterList = memo(function FilterList({
  category,
  filterGraph,
  filters,
  setFilters,
}: FilterListProps) {
  const [activeLi, setActiveLi] = useState<number | null>(null);
  const [listEvent, setListEvent] = useState<ListEvent>(null);
  const [gee, setGee] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const dRc = divRef?.current
  const containerPos = useMemo<number[] | null>(() => {
    return !dRc ? null : [dRc.clientHeight, dRc.offsetTop, dRc.scrollTop];
  }, [dRc, dRc?.clientHeight, dRc?.offsetTop, dRc?.scrollTop]);

  const selectNextLi = useDebouncedCallback((index: number | null) => {
    setFilters(setFiltersState(category, index === null ? null : filterList[index]!));
  }, 300);

  const filterList = getVisibleIds(category, filters, filterGraph)!;

  // TODO: this function shouldn't need to be debounced
  const handleClick = (e: MouseEvent<HTMLDivElement>, index: number | undefined) => {
    e.preventDefault();
    setListEvent("click");
    if (index === undefined) {
      if (activeLi === null) return; // ignore redundant clicks on 'all' li

      // legitimate toggle to 'all' li (no filter)
      setActiveLi(null);
      return;
    }
    setActiveLi((currentIndex) => (currentIndex === index ? null : index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "j") {
      setActiveLi((currentLi) => {
        if (currentLi === null) return 0;
        if (currentLi === filterList.length - 1) return currentLi;
        return currentLi + 1;
      });
      setListEvent("down");
    }

    if (event.key === "ArrowUp" || event.key === "k") {
      setActiveLi((currentLi) => {
        if (currentLi === null) return currentLi;
        if (currentLi === 0) return null;
        return currentLi - 1;
      });
      setListEvent("up");
    }

    if (event.key === "g") {
      if (!gee) {
        setGee(true);
        setTimeout(() => setGee((g) => g && false), 190);
      } else {
        setActiveLi(null);
        setListEvent("jumpTop");
        setGee(false);
      }
    }

    if (event.key === "G") {
      setActiveLi(filterList.length - 1);
      setListEvent("jumpBottom");
    }

    if (event.key === "PageDown" || event.key === "d") {
      divRef.current && page(divRef.current, 1);
    }

    if (event.key === "PageUp" || event.key === "u") {
      divRef.current && page(divRef.current, 0);
    }
  };

  // listen for activeLi updates and update filtersState/mutate accordingly
  useEffect(() => {
    const ul = ulRef?.current;

    listEvent && selectNextLi(activeLi);
    if (listEvent === "jumpTop" || listEvent === "jumpBottom") {
      ul && ul.scrollIntoView({ block: listEvent === "jumpTop" ? "start" : "end", behavior: "smooth" });
    }
  }, [activeLi, listEvent]);

  // Reset child filters when changing parent
  useEffect(() => {
    if (activeLi !== null && !listEvent) {
      // TODO [Cosmetic] Fix lists of one reseting to all.
      !filters[category] && setActiveLi(null);
    }
  }, [activeLi, listEvent, filters[category]]);

  // Prepare to reset child filters when changing parent
  useEffect(() => {
    const handleBlur = () => setListEvent(null);
    const div = divRef?.current;
    div?.addEventListener('blur', handleBlur);
    return () => div?.removeEventListener('blur', handleBlur);
  }, [])

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
          active={activeLi === null}
          handleClick={handleClick}
          listContainerPos={containerPos}
          listEvent={listEvent}
        />
        {filterList.map((id, i) => (
          <CategoryFilterLi
            key={`${category}_${id}`}
            category={category as Category}
            filter={filterGraph[category].byId[id]}
            active={activeLi === i}
            handleClick={handleClick}
            listContainerPos={containerPos}
            listEvent={listEvent}
            index={i}
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
  const [filters, setFilters] = useState<Filters>(initFilters);
  const utils = api.useUtils();
  const postFilter = api.filter.postFilter.useMutation({
    onSuccess: () => {
      void utils.song.getSongs.invalidate();
    },
  });

  useEffect(() => {
    postFilter.mutate(filters);
  }, [filters]);

  return CategoryMap.map((category) => (
    <FilterList
      key={category}
      category={category as Category}
      filterGraph={filterGraph}
      filters={filters}
      setFilters={setFilters}
    />
  ));
};

export default FilterLists;
