import { ZodObject, ZodRawShape } from "zod";
import { TClientCommand } from "./TClientCommand";
import { Dispatch } from "@reduxjs/toolkit";
import {
  MOTOR_CONFIGURATION_COMMAND_KEY,
  motorConfigurationCommand,
  motorConfigurationCommandValidator,
  TMotorConfigurationCommand,
} from "./MotorConfigurationCommand";
import {
  POSITION_LIST_COMMAND_KEY,
  positionListCommand,
  positionListCommandValidator,
  TPositionListCommand,
} from "./PositionListCommand";
import { ICommunicationInterface } from "../CommunicationServices/ICommunicationService";

export type TClientCommandData =
  | TMotorConfigurationCommand
  | TPositionListCommand;

export type TCommandKey =
  | typeof MOTOR_CONFIGURATION_COMMAND_KEY
  | typeof POSITION_LIST_COMMAND_KEY;

export const CommandKeys = [
  MOTOR_CONFIGURATION_COMMAND_KEY,
  POSITION_LIST_COMMAND_KEY,
];

const clientCommands: Record<
  TCommandKey,
  {
    validator: ZodObject<ZodRawShape>;
    command: TClientCommand<TClientCommandData>;
  }
> = {
  [MOTOR_CONFIGURATION_COMMAND_KEY]: {
    validator: motorConfigurationCommandValidator,
    command: motorConfigurationCommand,
  },
  [POSITION_LIST_COMMAND_KEY]: {
    validator: positionListCommandValidator,
    command: positionListCommand,
  },
};

export function handleClientCommand(
  commandData: TClientCommandData,
  comService: ICommunicationInterface,
  dispatch: Dispatch
) {
  const commandConfig = clientCommands[commandData.command];
  const parsed = commandConfig?.validator.safeParse(commandData);

  if (!parsed?.success) {
    console.error("Command validation failed:", parsed?.error);
    return;
  }

  commandConfig.command.execute({
    payload: (parsed.data as TClientCommandData).payload,
    comService,
    dispatch,
  });
}
