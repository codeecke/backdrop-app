import { motorIdValidator } from "@/validators/motorIdValidator";
import { z } from "zod";
import { TClientCommand } from "./TClientCommand";
import { setAvailableColors, setSelectedColor } from "@/store/colorSlice";
import { setActiveMotorId, setMotors } from "@/store/motorSlice";
import { Motor } from "@/classes/socketClients/Motor";

export const MOTOR_CONFIGURATION_COMMAND_KEY = "motorConfiguration";
export const motorConfigurationCommandPayloadItem = z.object({
  motorId: motorIdValidator,
  name: z.string(),
  colorCode: z.string().regex(/#[0-9a-fA-F]{6}/),
  isRunning: z.boolean(),
  direction: z.literal("up").or(z.literal("down")),
});

export const motorConfigurationCommandValidator = z.object({
  command: z.literal(MOTOR_CONFIGURATION_COMMAND_KEY),
  payload: z.array(motorConfigurationCommandPayloadItem),
});

export type TMotorConfigurationItem = z.infer<
  typeof motorConfigurationCommandPayloadItem
>;

export type TMotorConfigurationCommand = z.infer<
  typeof motorConfigurationCommandValidator
>;

export const motorConfigurationCommand: TClientCommand<TMotorConfigurationCommand> =
  {
    execute: ({ payload, dispatch, comService }) => {
      if (payload.length < 1) return;
      dispatch(setAvailableColors(payload));
      dispatch(setSelectedColor(payload[0]));
      dispatch(
        setMotors(payload.map((config) => new Motor(comService, config)))
      );
      dispatch(setActiveMotorId(payload[0].motorId));
    },
  };
