const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const WebSocket = require("ws");

// NOTE: Changes need to also be applied in preload.js
const WS_PORT = 8080;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("example/index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Open a WebSocket server in the Electron main process.
// This is used for performant bidirectional communication between the main process and renderer, which houses LightningChart JS.
// In Electron applications you can accomplish this with a variety of methods (not only WebSocket), but we have chosen to highlight this for a few reasons:
//      - WS is very well supported, robust and performant. Very good for streaming data transfer especially (key use case with LightningChart).
//      - We have good materials and existing documentation on using WS to the best results (https://lightningchart.com/js-charts/docs/basic-topics/real-time-data/websocket/)

const wsServer = new WebSocket.Server({ port: WS_PORT });
wsServer.on("listening", (ws) => {
  console.log(`WebSocket server live on port ${WS_PORT}`);
});
wsServer.on("connection", async (ws) => {
  // For example purposes, generate random measurements and send them over to the renderer.
  // This can simulate data spawning from A) real-time data base, B) data measurement peripheral connected via cable, C) BLE data measurement device, or other context.
  let prevY = 100;
  while (ws.readyState === WebSocket.OPEN) {
    const x = Date.now();
    const y = prevY + (Math.random() * 2 - 1);
    prevY = y;
    ws.send(JSON.stringify({ x, y }));
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
});
