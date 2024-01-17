import type { Category, FilterLiServerProps, FilterListsProps } from "~/types";
import { eraEnum } from "../enums";
import { ERAS } from "~/constants";
import { type EraEnum } from "@prisma/client";

const FilterLi = ({ category, filter }: FilterLiServerProps) => {
  return (
    <li key={filter?.id ?? 0}>
      <div className="m-0 w-full py-1 pl-4 pr-0 text-left">
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

const FilterListsServer = ({ filterGraph }: FilterListsProps) =>
  Object.entries(filterGraph).map(([category, graph]) => (
    <div className="h-full w-full overflow-y-scroll">
      <ul className="list-none p-0">
        <FilterLi category={category as Category} />
        {graph.allIds.map((id) => (
          <FilterLi category={category as Category} filter={graph.byId[id]} />
        ))}
      </ul>
    </div>
  ));

export default FilterListsServer;
