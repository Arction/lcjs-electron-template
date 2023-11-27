/// <reference path="../node_modules/@arction/lcjs/dist/lcjs.iife.d.ts" />

const { lightningChart, AxisScrollStrategies, AxisTickStrategies, SolidFill } =
  lcjs;

const lc = lcjs.lightningChart({
  // Get your license key here: https://lightningchart.com/js-charts/#license-key
  license: undefined,
});

const a = new SolidFill({ color });

const container = document.getElementById("chart");
const chart = lc
  .ChartXY({ container, defaultAxisX: { type: "linear-highPrecision" } })
  .setTitle("LightningChart JS in Electron");
const axisX = chart
  .getDefaultAxisX()
  .setScrollStrategy(AxisScrollStrategies.progressive)
  .setInterval({ start: -15_000, end: 0, stopAxisAfter: false })
  .setTickStrategy(AxisTickStrategies.DateTime)
  .setAnimationScroll(false);
const axisY = chart.getDefaultAxisY();
const lineSeries = chart
  .addLineSeries({
    dataPattern: { pattern: "ProgressiveX" },
  })
  .setDataCleaning({ minDataPointCount: 1 });

// Connect to WebSocket server hosted on Electron main process (main.js)
// This is used as a powerful medium to stream data into the LightningChart, wherever it may need to come from.
const ws = new WebSocket(`ws://localhost:${WS_PORT}`);
ws.onmessage = (event) => {
  const { x, y } = JSON.parse(event.data);
  lineSeries.add([{ x, y }]);
  // NOTE: This example is a minimal reproduction of transferring and visualizing real-time data in Electron.
  // For more details, please refer to general materials (not tied to Electron).
  // https://lightningchart.com/js-charts/docs/basic-topics/real-time-data/
};
