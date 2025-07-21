import Modal from "@/components/Modal";
import { GAME_CONFIG } from "@/lib/minigames/depth/config";
import { ArrowDown, ArrowUp, CircleCheck, CircleX } from "lucide-react";
import InstructionIcon from "@/components/InstructionIcon";
import InstructionRow from "@/components/InstructionRow";
import { GameModalProps } from "@/types/minigames/common";

const DepthModal: React.FC<GameModalProps> = ({ open, onClose }) => (
  <Modal
    storageKey="depth-modal"
    open={open}
    onClose={onClose}
    title="How to Play"
  >
    <InstructionRow
      icon={
        <span className="flex flex-col gap-2">
          <InstructionIcon content={<ArrowUp />} />
          <InstructionIcon content={<ArrowDown />} />
        </span>
      }
      text="Guess whether the next species is found at a deeper or shallower average depth than the current one, based on real-world data."
    />
    <InstructionRow
      icon={
        <InstructionIcon
          content={<CircleCheck className="bg-green-500 rounded-full" />}
        />
      }
      text="If you guess correctly, you move to the next species."
    />
    <InstructionRow
      icon={
        <InstructionIcon
          content={<CircleX className="bg-red-500 rounded-full" />}
        />
      }
      text="If you guess incorrectly, you lose a life."
    />
    <InstructionRow
      icon={
        <InstructionIcon src="/heart-full.png" alt="Heart" className={"p-1"} />
      }
      text={`You start with ${GAME_CONFIG.LIVES} lives. Your remaining lives are shown in the top right.`}
    />
  </Modal>
);

export default DepthModal;
