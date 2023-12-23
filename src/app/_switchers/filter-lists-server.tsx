import type { Category, FilterListsProps } from "~/types";
import { CategoryFilterBody } from "../_components/filter-lists";

const FilterListsServer = ({ filterGraph }: FilterListsProps) =>
  Object.entries(filterGraph).map(([category, graph]) => (
    <div className="h-full w-full overflow-y-scroll">
      <ul className="list-none p-0">
        {graph.allIds.map((id) => (
          <CategoryFilterBody
            category={category as Category}
            filter={graph.byId[id]!}
          />
        ))}
      </ul>
    </div>
  ));

export default FilterListsServer;
