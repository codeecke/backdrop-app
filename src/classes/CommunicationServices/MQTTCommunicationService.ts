import mqtt from "mqtt";
import { TDeviceCommand } from "../DeviceCommands";
import { AbstractCommunicationService } from "./AbstractCommunicationService";
import { CommandKeys, TCommandKey } from "../ClientCommands";
import { Observable } from "../Observable";

const TOPIC_PREFIX = "STUDIO/BACKDROP/";

export class MQTTCommunicationService extends AbstractCommunicationService {
  private client?: mqtt.MqttClient;
  public readonly events = {
    error: new Observable(),
    connected: new Observable(),
  };

  constructor(
    private url: string,
    private username: string,
    private password: string
  ) {
    super();
    this.reconnect();
  }

  send(command: TDeviceCommand): void {
    const topic = "STUDIO/BACKDROP/" + command.command;
    const payload = command.payload;
    this.client?.publish(topic, JSON.stringify(payload));
  }

  private isValidCommandKey(commandKey: string): commandKey is TCommandKey {
    return CommandKeys.includes(commandKey);
  }

  async reconnect(): Promise<void> {
    this.client = mqtt.connect(this.url, {
      clientId: "backdrop-webapp",
      username: this.username,
      password: this.password,
      clean: true,
      reconnectPeriod: 1000,
    });

    this.client.subscribe("STUDIO/BACKDROP/#", (err) => {
      if (err) {
        console.error("❌ Subscribe failed", err);
      } else {
        console.log("📡 Subscribed to STUDIO/BACKDROP/#");
      }
    });

    this.client.on("message", (topic: string, message: Buffer) => {
      const commandName: string = topic.substring(TOPIC_PREFIX.length);

      console.log("📨 MQTT Message received:");
      console.log("📍 Topic:", topic);
      console.log("🧾 Payload:", message.toString());

      console.log({ commandName, message });
      if (this.isValidCommandKey(commandName)) {
        this.dispatchCommandHandler({
          command: commandName,
          payload: JSON.parse(message.toString()),
        });
      }
    });

    this.client.once("error", () => this.events.error.notify());
    this.client.once("connect", () => this.events.connected.notify());

    this.send({
      command: "config",
      payload: undefined,
    });
  }
}
