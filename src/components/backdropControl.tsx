"use client";

import { TMotorConfigurationItem } from "@/classes/ClientCommands/MotorConfigurationCommand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActiveMotor } from "@/store/motorSlice";
import { useEffect, useState } from "react";

type TParams = {
  onUpPressed: () => void;
  onDownPressed: () => void;
  onStopPressed: () => void;
};

export default function BackdropControl({
  onDownPressed,
  onStopPressed,
  onUpPressed,
}: TParams) {
  const motor = useActiveMotor();
  const [isMoving, setIsMoving] = useState<boolean>(
    motor?.isRunning() || false
  );
  const [isMovingHandler, setIsMovingHandler] = useState<number>(-1);
  const [direction, setDirection] = useState<
    TMotorConfigurationItem["direction"]
  >(motor?.getDirection() || "up");

  const handleCalibration = () => {
    if (!motor) return;
    const result = confirm("Aktuelle Position als Nullpunkt speichern?");
    if (result) {
      motor.calibrate();
    }
  };

  const handleSavePosition = () => {
    if (!motor) return;
    const name = prompt("Name der Position");
    if (!name) return;
    motor.savePosition(name);
  };

  useEffect(() => {
    if (!motor) return;
    const handler = motor?.onRunningChanged.subscribe(() => {
      setIsMoving(motor.isRunning());
      setDirection(motor.getDirection());
    });
    setIsMovingHandler(handler);
    return () => motor.onRunningChanged.unsubscribe(isMovingHandler);
  }, [motor]);

  return (
    <div className="p-4 flex justify-center items-center">
      <Card className="max-w-md mx-auto p-6 relative screen-100">
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button
            className="w-24 h-24 p-0"
            variant={direction === "up" && isMoving ? "default" : "secondary"}
            onClick={() => onUpPressed()}
          >
            <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-current" />
          </Button>

          <Button
            className="w-24 h-24 p-0"
            variant="secondary"
            onClick={() => onStopPressed()}
          >
            <div className="w-20 h-20 bg-current" />
          </Button>

          <Button
            className="w-24 h-24 p-0"
            variant={direction === "down" && isMoving ? "default" : "secondary"}
            onClick={() => onDownPressed()}
          >
            <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-t-[60px] border-t-current" />
          </Button>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <Button onClick={() => handleCalibration()} disabled={!motor}>
            Als Nullpunkt definieren
          </Button>
          <Button disabled={!motor} onClick={() => handleSavePosition()}>
            Position speichern
          </Button>
        </div>
      </Card>
    </div>
  );
}
