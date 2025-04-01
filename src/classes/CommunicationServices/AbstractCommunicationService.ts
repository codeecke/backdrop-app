import { TClientCommandData, TCommandKey } from "../ClientCommands";
import { TDeviceCommand } from "../DeviceCommands";
import {
  IClientCommandDispatcher,
  TCommandListener,
} from "./IClientCommandDispatcher";
import {
  ICommunicationInterface,
  TOnMessageEventHandler,
} from "./ICommunicationService";

export abstract class AbstractCommunicationService
  implements ICommunicationInterface, IClientCommandDispatcher
{
  private messageHandler: TOnMessageEventHandler[] = [];
  private clientCommandListeners: Partial<
    Record<TCommandKey, TCommandListener[]>
  > = {};

  abstract reconnect(): void;
  abstract send(command: TDeviceCommand): void;

  onCommandReceived(cb: (message: TClientCommandData) => void): () => void {
    this.messageHandler.push(cb);
    return () => {
      this.messageHandler = this.messageHandler.filter(
        (handler) => handler !== cb
      );
    };
  }

  on(commandName: TCommandKey, listener: TCommandListener): () => void {
    this.clientCommandListeners[commandName] =
      this.clientCommandListeners[commandName] || [];

    this.clientCommandListeners[commandName].push(listener);

    return () => {
      this.clientCommandListeners[commandName] = this.clientCommandListeners[
        commandName
      ]?.filter((handler) => handler !== listener);
    };
  }

  protected dispatchCommandHandler(command: TClientCommandData) {
    this.messageHandler.forEach((handler) => handler(command));
    this.clientCommandListeners[command.command]?.forEach((handler) =>
      handler(command)
    );
  }
}
