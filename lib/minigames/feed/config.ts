export const GAME_CONFIG = {
  FISH_TYPES: ["anchovy", "clownfish", "crab", "pufferfish", "surgeonfish"],
  SEQUENCE_LENGTH: 4,
  MAX_ATTEMPTS: 5,
  CELL_SIZE: "w-[min(14vw,14vh,64px)] h-[min(14vw,14vh,64px)]",
  BUTTON_STYLE:
    "border-3 rounded flex items-center justify-center disabled:opacity-50",
  SCORE_MULTIPLIER: 20,
};

export const FEEDBACK_COLORS = {
  correct: "bg-green-500",
  misplaced: "bg-yellow-500",
  wrong: "bg-gray-500",
  empty: "bg-white",
};
