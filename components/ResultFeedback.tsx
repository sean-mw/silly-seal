import { GameFeedback } from "@/types/minigames/common";
import { CircleCheck, CircleX } from "lucide-react";

function GuessFeedback({ result }: { result: GameFeedback }) {
  if (result === "pending") return;

  return (
    <div className="absolute left-1/2 top-[calc(50%+28px)] -translate-x-1/2 -translate-y-1/2 z-999 animate-[ping_2s]">
      <div
        className={` rounded-full border-5 border-black ${
          result == "correct" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {result === "correct" ? (
          <CircleCheck color="black" size={72} />
        ) : (
          <CircleX color="black" size={72} />
        )}
      </div>
    </div>
  );
}

export default GuessFeedback;
