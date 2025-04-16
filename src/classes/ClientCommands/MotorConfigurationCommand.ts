import { motorIdValidator } from "@/validators/motorIdValidator";
import { z } from "zod";
import { TClientCommand } from "./TClientCommand";
import { setAvailableColors, setSelectedColor } from "@/store/colorSlice";
import { setActiveMotorId, setMotors } from "@/store/motorSlice";
import { Motor } from "@/classes/socketClients/Motor";

// Hinweis: Die globale Variable wird über das window-Objekt verwaltet

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
    execute: ({ payload, dispatch, comService, getState }: { payload: TMotorConfigurationCommand['payload']; dispatch: any; comService: any; getState?: () => any }) => {
      if (payload.length < 1) return;
      
      // Hole den aktuellen Zustand
      const state = getState?.();
      
      // Versuche zuerst, die globale Variable aus dem Fenster-Objekt zu lesen
      const globalLastSelectedMotorId = typeof window !== 'undefined' ? (window as any).lastSelectedMotorId : undefined;
      
      // Dann versuche den State zu lesen (Fallback)
      const stateActiveMotorId = state?.motorReducer?.activeMotor?.motorId;
      
      // Kombiniere beide Quellen und nutze die letzte bekannte ID
      const currentActiveMotorId = globalLastSelectedMotorId || stateActiveMotorId || 0;
      const currentSelectedColor = state?.colorReducer?.selected;
      
      // Setze die verfügbaren Farben
      dispatch(setAvailableColors(payload));
      
      // Erstelle die neuen Motor-Objekte
      const newMotors = payload.map((config) => new Motor(comService, config));
      
      // Prüfe, ob der aktuell ausgewählte Motor noch existiert
      const activeMotorExists = payload.some(motor => motor.motorId === currentActiveMotorId);
      const activeMotorId = activeMotorExists ? currentActiveMotorId : payload[0].motorId;
      
      // Setze den ausgewählten Motor, behalte den aktuellen bei wenn möglich
      const selectedColor = activeMotorExists && currentSelectedColor 
        ? currentSelectedColor 
        : payload.find(motor => motor.motorId === activeMotorId) || payload[0];
      
      dispatch(setSelectedColor(selectedColor));
      dispatch(setMotors(newMotors));
      dispatch(setActiveMotorId(activeMotorId));
      
    },
  };
