import type { MouseEvent, ReactNode } from "react";
import type { Song } from "~/types";

type LightBoxProps = {
  children: ReactNode;
  twClasses: string;
  onClose: () => void;
};

const Lightbox = ({ children, onClose, twClasses }: LightBoxProps) => {
  const handleClick = (e: MouseEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      <div className="absolute top-0 z-10 h-full w-full bg-black opacity-50" />
      <div
        className="absolute top-0 z-20 flex h-full w-full items-center justify-center"
        onClick={handleClick}
      >
        <div className={twClasses}>{children}</div>
      </div>
    </>
  );
};

type PromptProps = {
  setIsPrompting: (is: boolean) => void;
  song: Song;
};

const Prompt = ({ setIsPrompting, song }: PromptProps) => {
  return (
    <Lightbox twClasses="h-52 w-96" onClose={() => setIsPrompting(false)}>
      <div className="grid h-full w-full grid-cols-2 grid-rows-3 rounded-lg bg-gray-200">
        <div className="col-span-2 row-span-2 flex flex-col items-center justify-center border-b-2 border-gray-300 text-gray-800">
          <p className="py-2">Sorry, I've not built this feature yet!</p>
          <h4 className="pb-2">{song.song}</h4>
          <p>{song.artist}</p>
        </div>
        <button
          className="col-span-1 flex flex-col items-center justify-center border-r-2 border-gray-300 text-blue-700"
          onClick={() => setIsPrompting(false)}
        >
          Cancel
        </button>
        <button
          className="col-span-1 flex flex-col items-center justify-center font-semibold text-blue-700"
          onClick={() => setIsPrompting(false)}
        >
          Request
        </button>
      </div>
    </Lightbox>
  );
};

export default Prompt;
