import React from "react";
import { CrowdCard } from "../CrowdCard";
import { useSelector } from 'react-redux';

//* ------------ SIMPLE VIEW COMPONENT -----------------

interface SimpleRoomViewProps {
    isCallerSpeaking: boolean; // If the user is speaking, this will be true
  }

export function CircleSegmentRoomView(props: SimpleRoomViewProps) {
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
        crowdJSX.push(<p key="_0">Nobody has joined yet...</p>);
      }

      return crowdJSX;      
  }

  //React was bugging me abt this being an Empty arrow fn... fml
  React.useEffect(() => {console.log("")}, [Crowd]);

// ---------------------------

//Fixed 13x13 circle


const N_C = 9;
  const rows = 50;


  // Discretely checking if X,Y element is on the circumference of the Circle (in discrete manner)
  // Utilizing x^2 + y^2 = r^2 formula for circle graphing

  const isOnCircleCircumference = (rowIndex : any, columnIndex : any) => {

    const Radius = N_C/2 -1;
    const XY_Midpoint = Math.ceil(N_C/2)-1; //Account for X and Y circle midpoint

    const dx = columnIndex - XY_Midpoint;
    const dy = rowIndex - XY_Midpoint;

    const distance = Math.sqrt(dx * dx + dy * dy);


    if(Math.abs(distance - Radius) < 0.55){
        rotCircleApproach(rowIndex, columnIndex);
    }

  return Math.abs(distance - Radius) < 0.55;

  };

  const rotCircleApproach = (rowIndex : any, columnIndex : any) => {

    const XY_Midpoint = Math.ceil(N_C/2)-1; //Account for X and Y circle midpoint

    const col_pt = Math.pow((Math.abs(columnIndex - XY_Midpoint)),2) * 3.5;

    if (rowIndex === XY_Midpoint) {
        // Calculate the absolute difference between the columnIndex and the midpoint
        const diff = Math.abs(columnIndex - XY_Midpoint);
    
        // Scale the difference to an angle. Assuming the maximum distance equals an angle of 60 degrees.
        // Adjust the scaling factor based on the maximum expected difference to reach up to 60 degrees.
        const maxDiff = N_C / 2; // Maximum difference from the midpoint to the edge of the array
        const angle = diff / maxDiff * 90; // Scale the difference to an angle
    
        if (columnIndex === XY_Midpoint) {
          return ["0", col_pt];
        }
    
        if (columnIndex > XY_Midpoint) {
          return [`${angle.toFixed(0)}`, col_pt]; // Keep it negative for columnIndex greater than midpoint
        }
    
        return [`-${angle.toFixed(0)}`,col_pt]; // Positive for columnIndex less than midpoint
      }

}

  


const halfCircBuilder = () => {

  let tableRows = [];




  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const rowCells = [];
    for (let columnIndex = 0; columnIndex < N_C; columnIndex++) {

        let isActive = rotCircleApproach(rowIndex, columnIndex);

        if(isActive){
        console.log(isActive[1] + "ROT C");
        }

        rowCells.push(
        <td
          key={columnIndex}
          className={`px-4 ${isActive ? 'text-lg font-semibold' : 'text-sm font-normal'}`}
          style={{
            height: isActive ? '100px' : 'auto', 
          }}
        >
          {isActive ? <CrowdCard
          displayName={"Testington Test"}
          displayOccupation={"test"}
          key={1}
          clientUUID={"test"}
          isCallerSpeaking={isCallerSpeaking}
          avatarIndex={1} 
          VISUAL_rotation={isActive[0]}
          VISUAL_top_margin={isActive[1]}
          /> : `___`
          }
          
        </td>
      );
    }
    tableRows.push(<tr key={rowIndex} className="border-b border-transparent">{rowCells}</tr>);
  }

  return tableRows;

}

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full px-4">
      {simpleCrowdBuilder()}
    </div>


    <div className="overflow-x-auto">
      <table className="table-auto w-full">
            {halfCircBuilder()}
      </table>
    </div>

  
    </>
  )
}