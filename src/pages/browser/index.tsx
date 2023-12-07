import { api } from "~/utils/api";

type Song = {
  id: number
  label: string
}

type Category = "eras" | "genres" | "artists";

type FilterListProps = {
  data?: Song[],
  category: Category
}

const FilterList = ({ data, category }: FilterListProps) => {
  return (
    <div className="h-full w-full overflow-y-scroll">
      <ul className="p-0 list-none">
        {data?.map((song) => (
          <li key={song.id}>
            <div className="w-full py-4 pr-0 pl-6 text-lg text-left m-0">
              <span>{song.label}</span>
            </div>
          <hr className="h-px m-0 ml-6 bg-stone-200"/>
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
          <FilterList data={songs?.slice(0,10)} category="eras" />
          <FilterList data={songs?.slice(11,100)} category="genres" />
          <FilterList data={songs?.slice(101,1000)} category="artists" />
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
