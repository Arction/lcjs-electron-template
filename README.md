# Using LightningChart<sup>&#174; </sup> JS with Electron JS
This repository showcases the usage of LightningChart<sup>&#174;</sup> JS charting tools within a [Electron JS][0].

More information about LightningChart<sup>&#174;</sup> JS can be found from our website, https://www.arction.com/lightningchart-js/

## Getting Started
This project can be opened with code editor like [Visual Studio][1] with the html file. For further details and download links, please refer to the *Get Started* guide for ElectronJS [here][2]!

To run this project, run this project using visual studio code terminal
```
npm start
```
## Sending Data from your javascript Code to LightningChart<sup>&#174; </sup> JS
In order to send data to LightningChart®  JS , by creating javascript function json data will be passed to javascript in order to run line series using evaluatejavascript function.

```
// Using Evaluate function sent json data to javascript for line series.
      json = "[{ 'X': 0, 'Y': 0 },{ 'X': 1, 'Y': 8 },{ 'X': 2, 'Y': 12 },{ 'X': 3, 'Y': 18 },{ 'X': 4, 'Y': 22 },{ 'X': 5, 'Y': 32 },]";
      const JsonData = eval(json);
      window.data  = JsonData;
      Lineseries(data);
```
     OR
fetch data from json file and send to the javascript file 
```
// using getJson fetch data from json file
    $.getJSON("data.json", function(json) {
       window.scope = json;
    });
    Line_series(scope);
```
## Support
If you notice an error in the example code, please open an issue on [GitHub][3].
Official [API documentation][4] can be found on [Arction][5] website.
If the docs and other materials do not solve your problem as well as implementation help is needed, ask on [StackOverflow][6] (tagged lightningchart).
If you think you found a bug in the LightningChart JavaScript library, please contact support@arction.com.
Direct developer email support can be purchased through a [Support Plan][7] or by contacting sales@arction.com.

© Arction Ltd 2009-2020. All rights reserved.

[0]: https://www.electronjs.org/docs/latest/
[1]: https://visualstudio.microsoft.com/
[2]: https://www.electronjs.org/docs/latest/tutorial/quick-start
[3]: https://github.com/Arction/lcjs-html-example/issues
[4]: https://www.arction.com/lightningchart-js-api-documentation
[5]: https://www.arction.com
[6]: https://stackoverflow.com/questions/tagged/lightningchart
[7]: https://www.arction.com/support-services/
