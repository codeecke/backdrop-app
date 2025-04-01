import { directionValidator } from "@/validators/directionValidator";
import { motorIdValidator } from "@/validators/motorIdValidator";
import { z } from "zod";

export type TMotorId = z.infer<typeof motorIdValidator>;
export type TDirection = z.infer<typeof directionValidator>;
export type TMotorCommandPayload<T = object> = { motorId: TMotorId } & T;

type TMoveCommand = DeviceCommand<
  "move",
  TMotorCommandPayload<{ direction: TDirection }>
>;
type TStopCommand = DeviceCommand<"stop", TMotorCommandPayload>;
type TCalibrateCommand = DeviceCommand<"calibrate", TMotorCommandPayload>;
type TMoveToCommand = DeviceCommand<
  "moveTo",
  TMotorCommandPayload<{ position: number }>
>;
type TSavePositionCommand = DeviceCommand<
  "savePosition",
  TMotorCommandPayload<{ name: string }>
>;

type TConfigCommand = DeviceCommand<"config">;

export type TDeviceCommand =
  | TMoveCommand
  | TStopCommand
  | TCalibrateCommand
  | TMoveToCommand
  | TSavePositionCommand
  | TConfigCommand;

export type TDeviceCommandFactory = {
  config: () => TConfigCommand;
  move: (direction: TDirection) => TMoveCommand;
  stop: () => TStopCommand;
  calibrate: () => TCalibrateCommand;
  moveTo: (position: number) => TMoveToCommand;
  savePosition: (name: string) => TSavePositionCommand;
};

export class DeviceCommand<TCommand extends string, TPayload = undefined> {
  constructor(
    public readonly command: TCommand,
    public readonly payload: TPayload
  ) {}

  toString() {
    return JSON.stringify(this);
  }
}

export function createDeviceCommand(motorId: TMotorId): TDeviceCommandFactory {
  return {
    config: () => new DeviceCommand("config", undefined),
    move: (direction: TDirection) =>
      new DeviceCommand("move", { motorId, direction }),
    stop: () => new DeviceCommand("stop", { motorId }),
    calibrate: () => new DeviceCommand("calibrate", { motorId }),
    moveTo: (position: number) =>
      new DeviceCommand("moveTo", { motorId, position }),
    savePosition: (name: string) =>
      new DeviceCommand("savePosition", { motorId, name }),
  };
}
