import { CrowdCard } from "../CrowdCard";

interface SimpleRoomViewProps {
    isCallerSpeaking: boolean; // If the user is speaking, this will be true
  }

//* ------------ COMPLEX VIEW COMPONENT -----------------

export function SimpleRoomView(props: SimpleRoomViewProps) {
  const { isCallerSpeaking } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full px-4">
    {/* Placeholder cards */}
    <CrowdCard isCallerSpeaking={isCallerSpeaking} />
    <CrowdCard isCallerSpeaking={isCallerSpeaking} />
    <CrowdCard isCallerSpeaking={isCallerSpeaking} />
    <CrowdCard isCallerSpeaking={isCallerSpeaking} />
    <CrowdCard isCallerSpeaking={isCallerSpeaking} />
    <CrowdCard isCallerSpeaking={isCallerSpeaking} />

    {/* Add more placeholder cards as needed */}
    </div>
  )
}