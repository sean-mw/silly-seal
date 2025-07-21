import Modal from "@/components/Modal";
import InstructionIcon from "@/components/InstructionIcon";
import InstructionRow from "@/components/InstructionRow";
import { GameModalProps } from "@/types/minigames/common";

const FeedModal: React.FC<GameModalProps> = ({ open, onClose }) => (
  <Modal
    storageKey="feed-modal"
    open={open}
    onClose={onClose}
    title="How to Play"
  >
    <InstructionRow
      icon={
        <InstructionIcon
          src="/surgeonfish.png"
          alt="Surgeonfish"
          className="p-1"
        />
      }
      text="Guess the secret sequence of fish to feed your seal! Select a fish for each spot, then submit your guess."
    />
    <InstructionRow
      icon={
        <InstructionIcon
          src="/clownfish.png"
          alt="Clownfish"
          className="bg-green-500 p-1"
        />
      }
      text={"Green means the fish is in the correct spot."}
    />
    <InstructionRow
      icon={
        <InstructionIcon
          src="/anchovy.png"
          alt="Anchovy"
          className="bg-yellow-500 p-1"
        />
      }
      text={"Yellow means the fish is in the sequence, but in the wrong spot"}
    />
  </Modal>
);

export default FeedModal;
