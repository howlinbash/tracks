import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const playlists = [
  "Recently Added",
  "Recently Played",
  "Top Songs",
  "Top Albums",
  "Top Artists",
  "Bedtime Beats",
];

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Icons.library />
              All Tracks
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icons.cloud />
              Online
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icons.laptop />
              Offline
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icons.shoppingBag />
              Wishlist
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <div className="space-y-1 p-2">
            {playlists?.map((playlist, i) => (
              <Button
                key={`${playlist}-${i}`}
                variant="ghost"
                className="w-full justify-start font-normal"
              >
                <Icons.playlist />
                {playlist}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
