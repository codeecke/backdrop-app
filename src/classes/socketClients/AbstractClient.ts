import { ICommunicationInterface } from "../CommunicationServices/ICommunicationService";
import { TDeviceCommand } from "../DeviceCommands";

export abstract class AbstractClient {
  constructor(protected comService: ICommunicationInterface) {
    /*
    socket.addEventListener("message", (event: MessageEvent) => {
      if (event.data === "PONG") return;
      this.onMessage(event);
    });
    */
  }

  send(command: TDeviceCommand) {
    this.comService.send(command);
  }
  abstract onMessage(event: MessageEvent): void;
}
