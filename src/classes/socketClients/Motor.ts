import {
  createDeviceCommand,
  TDeviceCommand,
  TDirection,
  TMotorId,
} from "@/classes/DeviceCommands";
import { AbstractClient } from "./AbstractClient";
import { TClientCommandData } from "../ClientCommands";
import {
  TMotorConfigurationCommand,
  TMotorConfigurationItem,
} from "../ClientCommands/MotorConfigurationCommand";
import { Observable } from "../Observable";
import { ICommunicationInterface } from "../CommunicationServices/ICommunicationService";

export enum MotorEvents {
  opened = "MOTOR_EVENT_OPENED",
  closed = "MOTOR_EVENT_CLOSED",
  running = "MOTOR_EVENT_RUNNING",
  positionUpdate = "MOTOR_EVENT_POSITION_UPDATE",
}

export class Motor extends AbstractClient {
  private position: number = 0;
  private running: TMotorConfigurationItem["isRunning"];
  private direction: TMotorConfigurationItem["direction"];
  public onRunningChanged: Observable = new Observable();
  public readonly motorId: TMotorId;

  constructor(
    comService: ICommunicationInterface,
    config: TMotorConfigurationItem
  ) {
    super(comService);
    this.motorId = config.motorId;
    this.running = config.isRunning;
    this.direction = config.direction;
  }

  send(command: TDeviceCommand) {
    try {
      this.comService.send(command);
    } catch (error) {
      // Fehler wird in der Kommunikationsklasse bereits behandelt
    }
  }

  getPosition() {
    return this.position;
  }

  isRunning() {
    return this.running;
  }

  getDirection(): TMotorConfigurationItem["direction"] {
    return this.direction;
  }

  private createDeviceCommand() {
    return createDeviceCommand(this.motorId);
  }

  move(direction: TDirection) {
    const command = this.createDeviceCommand().move(direction);
    this.send(command);
  }

  moveUp() {
    this.move("up");
  }

  moveDown() {
    this.move("down");
  }

  stop() {
    const command = this.createDeviceCommand().stop();
    this.send(command);
  }

  moveTo(position: number) {
    const command = this.createDeviceCommand().moveTo(position);
    this.send(command);
  }

  calibrate() {
    const command = this.createDeviceCommand().calibrate();
    this.send(command);
  }

  savePosition(name: string) {
    const command = this.createDeviceCommand().savePosition(name);
    this.send(command);
  }

  private isMotorConfigurationCommand(
    command: TClientCommandData
  ): command is TMotorConfigurationCommand {
    return command.command === "motorConfiguration";
  }

  onMessage(event: MessageEvent): void {
    const data: TClientCommandData = JSON.parse(event.data);
    if (!this.isMotorConfigurationCommand(data)) {
      return;
    }
    const config = data.payload.find((motor) => motor.motorId === this.motorId);
    if (!config) return;
    this.running = config.isRunning;
    this.direction = config.direction;
    this.onRunningChanged.notify();
  }
}
