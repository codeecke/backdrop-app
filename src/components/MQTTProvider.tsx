import { handleClientCommand } from "@/classes/ClientCommands";
import { ICommunicationInterface } from "@/classes/CommunicationServices/ICommunicationService";
import { MQTTCommunicationService } from "@/classes/CommunicationServices/MQTTCommunicationService";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MQTTCredentialsForm from "./MQTTCredentials";

export function MQTTProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const wsRef = useRef<ICommunicationInterface | null>(null);
  const [mqttUrl, setMQTTUrl] = useState<string | null>(
    localStorage.getItem("MQTT_URL")
  );
  const [mqttUser, setMQTTUser] = useState<string | null>(
    localStorage.getItem("MQTT_USER")
  );
  const [mqttPassword, setMQTTPassword] = useState<string | null>(
    localStorage.getItem("MQTT_PASSWORD")
  );
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);

  useEffect(() => {
    if (!mqttUrl || !mqttUser || !mqttPassword) return;
    console.log("🔁 connecting...");
    setConnectionFailed(false);

    const socket = new MQTTCommunicationService(
      mqttUrl,
      mqttUser,
      mqttPassword
    );
    socket.events.error.subscribe(() => setConnectionFailed(true));
    socket.events.connected.subscribe(() => {
      setConnectionFailed(false);
      localStorage.setItem("MQTT_URL", mqttUrl);
      localStorage.setItem("MQTT_USER", mqttUser);
      localStorage.setItem("MQTT_PASSWORD", mqttPassword);
    });
    wsRef.current = socket;

    return socket.onCommandReceived((command) =>
      handleClientCommand(command, socket, dispatch)
    );
  }, [dispatch, mqttUser, mqttPassword, mqttUrl]);

  if (!mqttUrl || !mqttUser || !mqttPassword || connectionFailed)
    return (
      <MQTTCredentialsForm
        onSubmit={({ url, username, password }) => {
          setMQTTUrl(url);
          setMQTTUser(username);
          setMQTTPassword(password);
        }}
      />
    );
  return <>{children}</>;
}
