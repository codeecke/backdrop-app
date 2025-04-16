import { TMotorConfigurationItem } from "@/classes/ClientCommands/MotorConfigurationCommand";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

type TParams = {
  colors: TMotorConfigurationItem[];
  defaultValue?: TMotorConfigurationItem;
  onChange?: (value: TMotorConfigurationItem) => void;
};

// Stile werden jetzt direkt in JSX mit Tailwind verwendet

export default function ColorSelector({ colors, onChange }: TParams) {
  const activeValue = useSelector(
    (state: RootState) => state.colorReducer.selected
  );

  return (
    <>
      <ul className="flex gap-8 w-full justify-center mt-4">
        {colors.map((color) => (
          <li
            className={`w-8 h-8 rounded-full border-2  border-solid`}
            style={{
              backgroundColor: color.colorCode,
              borderColor:
                activeValue?.motorId === color.motorId
                  ? "var(--highlight-color)"
                  : "#000",
            }}
            key={color.motorId}
            onClick={() => {
              if (onChange) {
                onChange(color);
              }
            }}
          ></li>
        ))}
      </ul>
    </>
  );
}
