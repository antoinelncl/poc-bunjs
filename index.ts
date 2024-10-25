import { serve } from "bun";
import { readFileSync } from "fs";

serve({
  websocket: {
    open: (ws) => {
      console.log("Client connected");
      ws.subscribe('chat-group');
    },
    message: (ws, message) => {
      console.log("Client sent message", message);
      ws.publish('chat-group', `${message}`);
    },
    close: (ws) => {
      console.log("Client disconnected");
      ws.unsubscribe('chat-group');
    },
  },
  fetch(req, server) {
    if (req.url === "http://localhost:3000/") {
      return new Response(readFileSync("index.html"), {
        headers: { "Content-Type": "text/html" },
      });
    } else if (req.url === "http://localhost:3000/ws" && server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 400 });
  },
});