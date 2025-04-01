import { TClientCommandData } from "../ClientCommands";
import { TDeviceCommand } from "../DeviceCommands";

export type TOnMessageEventHandler = (commandData: TClientCommandData) => void;
type TRemoveFunction = () => void;

export interface ICommunicationInterface {
  send(command: TDeviceCommand): void;
  reconnect(): void;
  onCommandReceived(cb: TOnMessageEventHandler): TRemoveFunction;
}
