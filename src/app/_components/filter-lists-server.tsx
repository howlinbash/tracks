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

const FilterListsServer = ({ filterGraph }: FilterListsProps) => (
  <div className="relative h-full w-full">
    <div className="absolute grid h-full w-full cursor-default grid-cols-[1fr_1fr_1fr] gap-4">
      {Object.entries(filterGraph).map(([category, graph]) => (
        <div className="h-full w-full overflow-y-scroll">
          <ul className="list-none p-0">
            <FilterLi category={category as Category} />
            {graph.allIds.map((id) => (
              <FilterLi
                category={category as Category}
                filter={graph.byId[id]}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default FilterListsServer;
