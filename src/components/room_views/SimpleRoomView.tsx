import { CrowdCard } from "../CrowdCard";

//* ------------ SIMPLE VIEW COMPONENT -----------------

interface SimpleRoomViewProps {
    Crowd: React.ReactNode[];
  }

export function SimpleRoomView(props: SimpleRoomViewProps) {
  const { Crowd } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full px-4">
          {Crowd ? 
        Crowd.map((element, index) => <div key={index}>{element}</div>) : 
        "No one is here"}
    </div>
  )
}