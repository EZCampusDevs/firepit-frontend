import React from "react";
import { CrowdCard } from "../CrowdCard";
import { useSelector } from 'react-redux';

//* ------------ SIMPLE VIEW COMPONENT -----------------

interface SimpleRoomViewProps {
    isCallerSpeaking: boolean; // If the user is speaking, this will be true
  }

export function SimpleRoomView(props: SimpleRoomViewProps) {
  const { isCallerSpeaking } = props;

  const [crowdJSX, setCrowdJSX] = React.useState([]);

  const Crowd = useSelector((state : any) => state.room.crowd); //Only the Crowd (Non-Speakers)

  const simpleCrowdBuilder = () => {

      let crowdJSX = [];
      for(const participant of Crowd){

        crowdJSX.push(<CrowdCard 
          displayName={participant.client_name}
          displayOccupation={participant.client_occupation}
          key={participant.client_id}
          clientUUID={participant.client_id}
          isCallerSpeaking={isCallerSpeaking} 
          avatarIndex={1} />
          );    
      }

      if(crowdJSX.length == 0){
        crowdJSX.push(<p>Nobody has joined yet...</p>);
      }

      return crowdJSX;      
  }

  //React was bugging me abt this being an Empty arrow fn... fml
  React.useEffect(() => {console.log("")}, [Crowd]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full px-4">
      {simpleCrowdBuilder()}
    </div>
  )
}