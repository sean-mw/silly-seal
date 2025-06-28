import { GAME_CONFIG } from "@/lib/minigames/feed/config";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function ActionButton({ onClick, disabled, children }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${GAME_CONFIG.CELL_SIZE} ${GAME_CONFIG.BUTTON_STYLE}`}
    >
      {children}
    </button>
  );
}

export default ActionButton;
