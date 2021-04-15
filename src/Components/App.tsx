import React, { useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { RoomUser } from "../Interfaces/RoomUser";
import { emitEvent } from "../helpers";
import { Window } from "../Interfaces/Window";

export const App = (): JSX.Element => {
  const [isHosting, setHosting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [lastError, setLastError] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const [roomName, setRoomName] = useState("");
  const [roomState, setRoomState] = useState<RoomUser[]>([]);
  const [hostUser, setHostUser] = useState<RoomUser | null>(null);
  const [connection, setConnection] = useState<Socket | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [selectedWindow, setSelectedWindow] = useState(0);

  const selectedWindowRef = useRef<number>();

  selectedWindowRef.current = selectedWindow;

  const onStartHosting = () => {
    setLoading(true);

    const username = usernameInput.trim();
    const connection = io("wss://vnsync-server-33vh3.ondigitalocean.app");

    connection.on("connect", async () => {
      const result = await emitEvent<string>(
        connection,
        "createRoom",
        username
      );

      if (result.status !== "ok") {
        setLastError(result.failMessage);
        connection.disconnect();
        return;
      }

      setHosting(true);
      setLoading(false);
      setRoomName(result.data);
      setLastError("");
      setWindows(await vnSync.getOpenedWindows());
    });

    connection.on("disconnect", () => {
      setHosting(false);
      setLoading(false);
      setRoomName("");
      setRoomState([]);
      setHostUser(null);
      setConnection(null);
      setWindows([]);
      setSelectedWindow(0);
    });

    connection.on("roomStateChange", (roomState: RoomUser[]) => {
      setRoomState(roomState);
      setHostUser(roomState.find((roomUser) => roomUser.username === username));
    });

    connection.on("roomReady", async () => {
      const handle = selectedWindowRef.current;
      const exists = await vnSync.windowExists(handle);

      if (!exists) {
        alert("Window no longer exists!");
        return;
      }

      setLoading(true);
      await vnSync.initiateClickOnWindow(handle);
      setLoading(false);
    });

    setConnection(connection);
  };

  const onToggleReady = async () => {
    setLoading(true);

    const handle = selectedWindowRef.current;
    const windowExists = await vnSync.windowExists(handle);

    if (windowExists) {
      await vnSync.activateWindow(handle);
    }

    const result = await emitEvent<undefined>(connection, "toggleReady");

    if (result.status !== "ok") {
      setLastError(result.failMessage);
      connection.disconnect();
      return;
    }

    setLoading(false);
  };

  return (
    <>
      <h2>VNSync</h2>
      {lastError !== "" && <h3>Error: {lastError}</h3>}
      <div>
        {!isHosting && (
          <>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={isLoading}
            />
            <br />
            <button onClick={onStartHosting} disabled={isLoading}>
              Start Hosting!
            </button>
          </>
        )}
        {isHosting && (
          <>
            <h3>Room name: {roomName}</h3>
            <ul>
              {roomState.map((roomUser) => (
                <li key={roomUser.username}>
                  {roomUser.username} - {!roomUser.isReady && "not"} ready
                </li>
              ))}
            </ul>
            <button onClick={onToggleReady} disabled={isLoading}>
              {hostUser.isReady ? "Unready" : "Ready"}
            </button>
            <hr />
            <select
              disabled={isLoading}
              onChange={(e) => {
                setSelectedWindow(Number.parseInt(e.target.value));
              }}
              defaultValue={selectedWindow}
            >
              <option value="0">-</option>
              {windows.map((window) => (
                <option value={window.handle}>{window.title}</option>
              ))}
            </select>
            <br />
            <button
              disabled={isLoading}
              onClick={async () => {
                setWindows(await vnSync.getOpenedWindows());
              }}
            >
              Refresh windows
            </button>
          </>
        )}
      </div>
    </>
  );
};
