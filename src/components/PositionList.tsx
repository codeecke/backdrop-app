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
  const positionList: TPosition[] =
    useSelector((state: RootState) => state.positionListReducer.positions) ||
    [];

  const edit = (position: TPosition) => {
    const newName = prompt("Name", position.name) || position.name;
    console.log("Neuer Name:", newName);
  };

  const remove = (position: TPosition) => {
    console.log("zu löschende Position:", position);
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
