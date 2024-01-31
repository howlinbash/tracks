import type { MouseEvent, ReactNode } from "react";
import type { Song } from "~/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type LightBoxProps = {
  children: ReactNode;
  twClasses: string;
  onClose: () => void;
};

const Lightbox = ({ children, onClose, twClasses }: LightBoxProps) => {
  const handleClick = (e: MouseEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <div className="absolute left-0 top-0 z-10 h-screen w-screen bg-black opacity-50" />
      <div
        className="absolute left-0 top-0 z-20 flex h-screen w-screen items-center justify-center"
        onClick={() => onClose()}
      >
        <div onClick={handleClick} className={twClasses}>
          {children}
        </div>
      </div>
    </>
  );
};

type PromptProps = {
  setIsPrompting: (is: boolean) => void;
  song: Song;
};

const Prompt = ({ setIsPrompting, song }: PromptProps) => {
  const handleClick = () => {
    setIsPrompting(false);
    if (song.tubes) {
      const url = song.tubes[0]?.url;
      url && window.open(url, "_blank");
    }
  };

  return (
    <Lightbox twClasses="h-52 w-96" onClose={() => setIsPrompting(false)}>
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
        )}
      >
        <div className="col-span-2 row-span-2 flex flex-col items-center justify-center">
          <h4 className="pb-2">{song.song}</h4>
          <p>{song.artist}</p>
        </div>
        <div />
        <div
          className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
          )}
        >
          <Button
            variant="outline"
            className="mt-2 sm:mt-0"
            onClick={() => setIsPrompting(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleClick}>Sing</Button>
        </div>
      </div>
    </Lightbox>
  );
};

export default Prompt;
