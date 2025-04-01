import { Dispatch } from "@reduxjs/toolkit";
import { TClientCommandData } from ".";
import { ICommunicationInterface } from "../CommunicationServices/ICommunicationService";

type TClientCommandExecuteParam<T extends TClientCommandData> = {
  payload: T["payload"];
  comService: ICommunicationInterface;
  dispatch: Dispatch;
};

export type TClientCommand<T extends TClientCommandData> = {
  execute(data: TClientCommandExecuteParam<T>): void;
};
