# Using LightningChart<sup>&#174; </sup> JS with Electron JS

This repository showcases the usage of LightningChart<sup>&#174;</sup> JS charting tools with [Electron JS][0].

More information about LightningChart<sup>&#174;</sup> JS can be found from the official documentation, https://lightningchart.com/js-charts/docs/

## Getting Started

This project was initialized according to the [official Electron tutorial](https://www.electronjs.org/docs/latest/), November 2023.

It shows how to place LightningChart JS in an Electron renderer, and how to stream real-time data into it from the main process. The result, is a simple chart like below:

![TODO]

Here are steps need to run the application locally:

1. Clone the repository.
2. Input your LCJS license key to `example/index.js`
   - If you don't have one, you can get one from https://lightningchart.com/js-charts/#license-key
3. `npm i`
4. `npm start`

The application can also be exported to a distributable application with `npm run make`.

## Integrating LightningChart JS into an existing Electron application

Here you will find a description of the steps done to create this template project.

1. Install LightningChart JS from NPM
   - `npm i @arction/lcjs`
2. Import the library in your Electron renderer HTML file
   - `<script src="../node_modules/@arction/lcjs/dist/lcjs.iife.js"></script>`
3. Allow connections from renderer to LCJS licensing server
   - Optional, only required for using developer licenses.
   - See example in `example/index.html`
4. Create a container DIV element for the chart.
5. In your renderer JavaScript code, use LightningChart JS completely normally (plain HTML/JS), attaching the chart to the HTML container.

## Transferring data to LightningChart JS

Electron applications are separated to two distinct processes, [_main_ and _renderer_](https://www.electronjs.org/docs/latest/tutorial/process-model). LightningChart JS is a frontend component, so it will usually reside in a renderer process.

Real Electron applications may have data coming in from a variety of different sources - a data base, remote server, a local peripheral, Bluetooth, etc. In most cases, it is unlikely that you are able to directly connect your data source to the Electron renderer. Instead, you probably have to route the data from the data source to the main process, and from there to the renderer.

This project shows you one example how you can transfer data from the main process to the renderer, using WebSockets.
WebSockets are well supported, robust and perform very well with high data rates.

In this example application, the Electron project is bundled together with a WebSocket server, which the main process uses to send rapidly spawning time-series data points over to the renderer process. See relevant code in `index.js` and `example/index.js`. This example is kept very small, for more materials please see [general materials](https://lightningchart.com/js-charts/docs/basic-topics/real-time-data/) (not tied to Electron).

Some other feasible alternatives to using WebSocket:

- Electron [ipcMain](https://www.electronjs.org/docs/latest/api/ipc-main)
  - Built-in async communication. Presumably slower than WebSocket but should be more secure and possibly easier to use.
- [Shared Array Buffers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
  - Directly share data memory range from the main process to the renderer. Possibly very effective when dealing with large data sets.

## Support

If you notice an error in the example code, please open an issue on [GitHub][3].
Official [API documentation][4] can be found on [Arction][5] website.
If the docs and other materials do not solve your problem as well as implementation help is needed, ask on [StackOverflow][6] (tagged lightningchart).
If you think you found a bug in the LightningChart JavaScript library, please contact support@arction.com.
Direct developer email support can be purchased through a [Support Plan][7] or by contacting sales@arction.com.

© Arction Ltd 2009-2023. All rights reserved.

[0]: https://www.electronjs.org/docs/latest/
[1]: https://visualstudio.microsoft.com/
[2]: https://www.electronjs.org/docs/latest/tutorial/quick-start
[3]: https://github.com/Arction/lcjs-html-example/issues
[4]: https://www.arction.com/lightningchart-js-api-documentation
[5]: https://www.arction.com
[6]: https://stackoverflow.com/questions/tagged/lightningchart
[7]: https://www.arction.com/support-services/
