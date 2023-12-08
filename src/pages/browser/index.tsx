import { api } from "~/utils/api";
import type { FilterListProps } from "./types";
import { eraEnum } from "./enums";
import type { EraEnum } from "@prisma/client";
import { ERAS, GENRES, ARTISTS } from "~/constants";

const FilterList = ({ category }: FilterListProps) => {
  const { data: filters, isLoading } = api.filter.getFilters.useQuery({ category });
  return (
    <div className="h-full w-full overflow-y-scroll">
      <ul className="p-0 list-none">
        {isLoading ? "..." : filters?.map((filter) => (
          <li key={filter.id}>
            <div className="w-full py-4 pr-0 pl-6 text-lg text-left m-0">
              <span>{category === ERAS ? eraEnum[filter.label as EraEnum] : filter.label}</span>
            </div>
            <hr className="h-px m-0 ml-6 bg-stone-200" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Browser() {
  const { data: songs, isLoading } = api.song.getSongs.useQuery();

  return (
    <main className="grid w-full h-screen gap-2.5 grid-rows-[auto_1fr_1fr]">
      <div className="grid grid-cols-[1fr_1fr_1fr] w-full pt-4 items-center">
        <h2 className="pl-5">Howlin Tracks</h2>
        <p className="justify-self-center">?? Songs</p>
        <div />
      </div>
      <div className="grid w-full h-[45vh] gap-px grid-cols-[1fr_1fr_1fr]">
        {isLoading ? "..." : (
          <>
            <FilterList category={ERAS} />
            <FilterList category={GENRES} />
            <FilterList category={ARTISTS} />
          </>
        )}
      </div>
      <div className="h-full w-full overflow-y-scroll">
        <ul className="">
          {isLoading ? "..." : songs?.map((song) => (
            <li className="py-1 pl-6" key={song.id}>{song.label}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
