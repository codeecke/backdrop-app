import { TClientCommandData, TCommandKey } from "../ClientCommands";

export type TCommandListener = (commandData: TClientCommandData) => void;
type TRemoveFunction = () => void;

export interface IClientCommandDispatcher {
  on(commandName: TCommandKey, listener: TCommandListener): TRemoveFunction;
}
