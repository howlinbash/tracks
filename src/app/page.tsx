// import Link from "next/link";
import { api } from "~/trpc/server";
import { type FilterListProps } from "./types";
import { eraEnum } from "./enums";
import { type EraEnum } from "@prisma/client";
import { ERAS, GENRES, ARTISTS } from "~/constants";
import { type RouterOutputs } from "~/trpc/shared";

const FilterList = async ({ category }: FilterListProps) => {
  const filters = await api.filter.getFilters.query({
    category,
  });
  return (
    <div className="h-full w-full overflow-y-scroll">
      <ul className="list-none p-0">
        {!filters
          ? "..."
          : filters.map((filter) => (
            <li key={filter.id}>
              <div className="m-0 w-full py-4 pl-6 pr-0 text-left text-lg">
                <span>
                  {category === ERAS
                    ? eraEnum[filter.label as EraEnum]
                    : filter.label}
                </span>
              </div>
              <hr className="m-0 ml-6 h-px bg-stone-200" />
            </li>
          ))}
      </ul>
    </div>
  );
};

type Song = RouterOutputs["song"]["getSongs"][number];

const SongRow = ({ song }: { song?: Song }) => (
  <tr className="flex w-full py-1 pl-6 text-left" key={song?.id}>
    <td className="w-full">{song ? eraEnum[song.era as EraEnum] : ""}</td>
    <td className="w-full">{song?.genre}</td>
    <td className="w-full">{song?.artist}</td>
    <td className="w-full">{song?.song}</td>
  </tr>
);

const SongList = async () => {
  const songs = await api.song.getSongs.query();
  return (
    <div className="h-full w-full overflow-y-scroll">
      <table className="w-full">
        <tbody>
          {!songs ? (
            <SongRow />
          ) : (
            songs?.map((song) => <SongRow song={song} />)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default async function Home() {
  return (
    <main className="grid h-screen w-full grid-rows-[auto_1fr_1fr] gap-2.5">
      <div className="grid w-full grid-cols-[1fr_1fr_1fr] items-center pt-4">
        <h2 className="pl-5">Howlin Tracks</h2>
        <p className="justify-self-center">?? Songs</p>
        <div />
      </div>
      <div className="grid h-[45vh] w-full grid-cols-[1fr_1fr_1fr] gap-px">
        <FilterList category={ERAS} />
        <FilterList category={GENRES} />
        <FilterList category={ARTISTS} />
      </div>
      <SongList />
    </main>
  );
}
