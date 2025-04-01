import { TMotorConfigurationItem } from "@/classes/ClientCommands/MotorConfigurationCommand";
import { RootState } from "@/store";

import { CSSProperties } from "react";
import { useSelector } from "react-redux";

type TParams = {
  colors: TMotorConfigurationItem[];
  defaultValue?: TMotorConfigurationItem;
  onChange?: (value: TMotorConfigurationItem) => void;
};

type StyleGenerator = (color: string, active: boolean) => CSSProperties;

type Styles = {
  container: CSSProperties;
  item: StyleGenerator;
};

const styles: Styles = {
  container: {
    display: "flex",
    gap: "2rem",
    width: "100%",
    justifyContent: "center",
  },
  item: (color: string, active: boolean) => ({
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: active ? "var(--highlight-color)" : "#000",
    backgroundColor: color,
  }),
};

export default function ColorSelector({ colors, onChange }: TParams) {
  const activeValue = useSelector(
    (state: RootState) => state.colorReducer.selected
  );

  return (
    <>
      <ul style={styles.container}>
        {colors.map((color) => (
          <li
            style={styles.item(
              color.name,
              activeValue?.motorId === color.motorId
            )}
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
