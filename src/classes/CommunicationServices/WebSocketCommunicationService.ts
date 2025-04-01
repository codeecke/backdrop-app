import { TClientCommandData } from "../ClientCommands";
import { TDeviceCommand } from "../DeviceCommands";
import { AbstractCommunicationService } from "./AbstractCommunicationService";

export class WebSocketCommunicationService extends AbstractCommunicationService {
  private socket: WebSocket | null = null;
  private url: string;
  private pingIntervalHandler: NodeJS.Timeout | null = null;

  constructor(wsUrl: string) {
    super();
    this.url = wsUrl;
    this.reconnect();
  }

  reconnect(): void {
    this.disconnect();
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", () => {
      console.log("✅ connected");
      if (this.pingIntervalHandler) {
        clearInterval(this.pingIntervalHandler);
      }
      this.pingIntervalHandler = setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send("PING");
        }
      }, 1000);
    });

    this.socket.addEventListener("close", () => this.disconnect());

    this.socket.addEventListener("message", (ev: MessageEvent<string>) => {
      if (ev.data === "PONG") return;
      const commandData: TClientCommandData = JSON.parse(ev.data);
      this.dispatchCommandHandler(commandData);
    });
  }

  disconnect(): void {
    if (this.pingIntervalHandler) {
      clearInterval(this.pingIntervalHandler);
    }
    this.socket?.close();
  }

  send(command: TDeviceCommand): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }
    this.socket.send(JSON.stringify(command));
  }
}
