import { FaRunning } from "react-icons/fa";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <FaRunning className="text-blue-600 text-4xl" />
      <h5 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-montserrat">
        MotionLab
      </h5>
    </div>
  );
}
