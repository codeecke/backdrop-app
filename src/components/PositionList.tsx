import { TPosition } from "@/classes/ClientCommands/PositionListCommand";
import { Motor } from "@/classes/socketClients/Motor";
import { RootState } from "@/store";
import { Pencil, Trash2 } from "lucide-react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface PositionListParams {
  motor: Motor;
}

export const PositionList: FC<PositionListParams> = ({ motor }) => {
  const allPositions: TPosition[] =
    useSelector((state: RootState) => state.positionListReducer.positions) ||
    [];
    
  // Filtere nur die Positionen, die zum aktuellen Motor gehören
  const positionList = allPositions.filter(
    (position) => position.motorId === motor.motorId
  );

  const edit = (position: TPosition) => {
    // TODO: Implementieren der Edit-Funktionalität
    prompt("Name", position.name);
  };

  const remove = (_position: TPosition) => {
    // TODO: Implementieren der Lösch-Funktionalität
  };
  return (
    <ul>
      {positionList.map((position: TPosition, index: number) => (
        <li
          key={index}
          className="flex bg-white px-4 cursor-pointer justify-between"
        >
          <div
            onClick={() => motor.moveTo(position.position)}
            className="flex py-4 w-full"
          >
            {position.name}
          </div>
          <div className="flex  py-4 gap-4">
            <Pencil size={16} onClick={() => edit(position)} />
            <Trash2 size={16} onClick={() => remove(position)} />
          </div>
        </li>
      ))}
    </ul>
  );
};
