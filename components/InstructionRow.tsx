interface InstructionRowProps {
  icon: React.ReactNode;
  text: string;
}

const InstructionRow = ({ icon, text }: InstructionRowProps) => (
  <div className="flex items-center gap-3 text-left">
    <span className="flex-shrink-0">{icon}</span>
    <span className="flex-1">{text}</span>
  </div>
);

export default InstructionRow;
