import type { FilterListProps } from "~/types";
import { CategoryFilterBody } from "../_components/filter-list";

const FilterListServer = ({ category, filters }: FilterListProps) => {
  return (
    <div className="h-full w-full overflow-y-scroll">
      <ul className="list-none p-0">
        {filters.map((filter) => (
          <CategoryFilterBody category={category} filter={filter} />
        ))}
      </ul>
    </div>
  );
};

export default FilterListServer;
