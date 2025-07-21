import Modal from "@/components/Modal";
import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { ArrowRight } from "lucide-react";
import InstructionIcon from "@/components/InstructionIcon";
import InstructionRow from "@/components/InstructionRow";
import { GameModalProps } from "@/types/minigames/common";

const CleanModal: React.FC<GameModalProps> = ({ open, onClose }) => (
  <Modal
    storageKey="clean-modal"
    open={open}
    onClose={onClose}
    title="How to Play"
  >
    <InstructionRow
      icon={
        <span className="flex items-center gap-1">
          <InstructionIcon src="/dirty.png" alt="Dirty cell" />
          <ArrowRight />
          <InstructionIcon src="/clean.png" alt="Clean cell" />
        </span>
      }
      text="Clean all the dirty water cells to win!"
    />
    <InstructionRow
      icon={<InstructionIcon src="/clean.png" alt="Clean cell" content={"3"} />}
      text="Click a cell to reveal it. The number in the cell shows how many rocks are next to it."
    />

    <InstructionRow
      icon={<InstructionIcon src="/rock.png" alt="Rock" />}
      text="Avoid rocks! Hitting one costs a life."
    />
    <InstructionRow
      icon={<InstructionIcon src="/flag.png" alt="Flag" />}
      text="Right-click (or touch and hold on mobile) to flag suspected rocks."
    />
    <InstructionRow
      icon={
        <InstructionIcon src="/heart-full.png" alt="Heart" className={"p-1"} />
      }
      text={`You start with ${GAME_CONFIG.LIVES} lives. Your remaining lives are shown in the top right.`}
    />
  </Modal>
);

export default CleanModal;
