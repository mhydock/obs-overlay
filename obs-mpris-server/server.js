import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import dbus from "@jellybrick/dbus-next";
import fs from "node:fs/promises";
import url from "url";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const PORT = process.env.PORT || 3000;

const MPRIS_IFACE = "org.mpris.MediaPlayer2.Player";
const MPRIS_PATH = "/org/mpris/MediaPlayer2";
const PROPERTIES_IFACE = "org.freedesktop.DBus.Properties";
const PLAYER_NAME = "audacious";

const playerName = `org.mpris.MediaPlayer2.${PLAYER_NAME}`;

const app = express();
const server = createServer(app);

class ConnectionManager {
  constructor() {
    this.clients = new Set();
  }

  addClient(ws) {
    this.clients.add(ws);
    console.log(`Client added. Total clients: ${this.clients.size}`);
  }

  removeClient(ws) {
    this.clients.delete(ws);
    console.log(`Client removed. Total clients: ${this.clients.size}`);
  }

  broadcast(message, sender = null) {
    this.clients.forEach((client) => {
      if (client !== sender && client.readyState === client.OPEN) {
        try {
          client.send(message);
        } catch (error) {
          console.error("Error broadcasting to client:", error);
          this.removeClient(client);
        }
      }
    });
  }

  getClientCount() {
    return this.clients.size;
  }
}

const connectionManager = new ConnectionManager();
let currentMetadata;
let player;
let props;

app.use(express.static("public"));

const wss = new WebSocketServer({
  server,
  clientTracking: true,
});

wss.on("connection", async (ws, request) => {
  const clientIP = request.socket.remoteAddress;
  console.log(`New client connected from ${clientIP}`);

  // Send welcome message
  ws.send("Welcome to the WebSocket server!");

  connectionManager.addClient(ws);

  ws.send(JSON.stringify(currentMetadata || {}));

  ws.on("close", (code, reason) => {
    console.log(`Client disconnected - Code: ${code}, Reason: ${reason}`);
    connectionManager.removeClient(ws);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("message", async (data, isBinary) => {
    const message = data.toString();
    if (message === "ping") {
      //   console.log("is alive");
      ws.isAlive = true;
      if (props) {
        const { value: position } = await props.Get(MPRIS_IFACE, "Position");
        ws.send(JSON.stringify({ position: position / 1000n }));
      } else {
        ws.send("pong");
      }
      return;
    }
  });

  // Handle connection ping/pong for keep-alive
  ws.on("ping", () => {
    ws.isAlive = true;
    ws.pong();
  });

  ws.isAlive = true;
});

// Ping clients periodically to detect broken connections
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.pong();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(interval);
});

const createPropsListenerDBusNext = async () => {
  let bus = dbus.sessionBus();

  console.log("DBus connection established");
  let obj = await bus.getProxyObject("org.freedesktop.DBus", "/org/freedesktop/DBus");
  let iface = obj.getInterface("org.freedesktop.DBus");
  let names = await iface.ListNames();
  let result = names.filter((n) => n.startsWith("org.mpris.MediaPlayer2"));

  console.log("Players: ", result);

  obj = await bus.getProxyObject(playerName, MPRIS_PATH);
  player = obj.getInterface(MPRIS_IFACE);
  props = obj.getInterface(PROPERTIES_IFACE);

  // console.log(props);
  // console.log(player);

  const getMetadata = async (metadata) => {
    if (!metadata) {
      metadata = await props.Get(MPRIS_IFACE, "Metadata");
    }
    const { value: position } = await props.Get(MPRIS_IFACE, "Position");
    const {
      value: {
        "mpris:artUrl": { value: artUrl },
        "mpris:length": { value: length },
        "mpris:trackid": { value: trackid },
        "xesam:album": { value: album },
        "xesam:artist": { value: artist },
        "xesam:title": { value: title },
      },
    } = metadata;

    let albumArt;
    try {
      const file = await fs.readFile(url.fileURLToPath(artUrl));
      albumArt = Buffer.from(file).toString("base64");
      // console.log(albumArt);
    } catch (err) {
      console.error(err);
    }

    return {
      metadata: { albumArt, length: length / 1000n, trackid, album, artist, title },
      position: position / 1000n,
    };
  };

  currentMetadata = await getMetadata();
  // console.log(currentMetadata);

  props.on("PropertiesChanged", async (iface, changed, invalidated) => {
    if (changed.hasOwnProperty("Metadata")) {
      // console.log(changed["Metadata"]);
      currentMetadata = await getMetadata(changed["Metadata"]);
      connectionManager.broadcast(JSON.stringify(currentMetadata));
    }
  });
};

server.listen(PORT, async () => {
  await createPropsListenerDBusNext();

  console.log(`Server running on http://localhost:${PORT}`);
});
