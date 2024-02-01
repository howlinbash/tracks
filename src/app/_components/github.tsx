"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function Github() {
  return (
    <Button
      className="ml-2"
      variant="outline"
      size="icon"
      onClick={() =>
        window.open("https://www.github.com/howlinbash/tracks", "_blank")
      }
    >
      <Icons.gitHub className="h-6 w-6" />
    </Button>
  );
}
