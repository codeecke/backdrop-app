import "./App.css";
import BackdropControl from "./components/backdropControl";
import ColorSelector from "./components/colorSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { RootState } from "./store";
import { setSelectedColor } from "./store/colorSlice";

import { useDispatch, useSelector } from "react-redux";
import { useActiveMotor } from "./store/motorSlice";
import { PositionList } from "./components/PositionList";
import { TMotorConfigurationItem } from "./classes/ClientCommands/MotorConfigurationCommand";

function App() {
  const availableColors = useSelector(
    (state: RootState) => state.colorReducer.available
  );
  const motor = useActiveMotor();
  const dispatch = useDispatch();

  return (
    <>
      <h1>Backdrop RC</h1>
      {availableColors.length > 1 && (
        <ColorSelector
          colors={availableColors}
          onChange={(selected: TMotorConfigurationItem) => {
            dispatch(setSelectedColor(selected));
          }}
        />
      )}

      <Tabs defaultValue="automatic" className="w-screen">
        <TabsList className="bg-transparent text-white mt-1 w-screen">
          <TabsTrigger value="manuel">Manuell</TabsTrigger>
          <TabsTrigger value="automatic">Automatisch</TabsTrigger>
        </TabsList>
        <TabsContent value="manuel">
          {!motor && <p>Bitte wähle eine Farbe</p>}
          {motor && (
            <BackdropControl
              onDownPressed={() => motor.moveDown()}
              onUpPressed={() => motor.moveUp()}
              onStopPressed={() => motor.stop()}
            />
          )}
        </TabsContent>
        <TabsContent value="automatic">
          {motor && <PositionList motor={motor} />}
        </TabsContent>
      </Tabs>
    </>
  );
}

export default App;
