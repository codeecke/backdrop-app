import { handleClientCommand } from "@/classes/ClientCommands";
import { ICommunicationInterface } from "@/classes/CommunicationServices/ICommunicationService";
import { WebSocketCommunicationService } from "@/classes/CommunicationServices/WebSocketCommunicationService";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export function WebsocketProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const wsRef = useRef<ICommunicationInterface | null>(null);

  useEffect(() => {
    console.log("🔁 connecting...");
    const socket = new WebSocketCommunicationService("ws://192.168.178.48/ws");
    wsRef.current = socket;

    return socket.onCommandReceived((command) =>
      handleClientCommand(command, socket, dispatch)
    );
  }, [dispatch]);

  return <>{children}</>;
}
