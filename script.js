function intro() {
  document.getElementById("desc").innerHTML = "";
  document.getElementById("target").style.cssText = "";
  document.getElementById("target").innerHTML =
    '<object  style = "width:1100px; height:900px;" data="Intro_page.html" ></object>';
}

function Heatmapseries() {
  document.getElementById("desc").innerHTML = "";
  document.getElementById("target").innerHTML = "";
  document.getElementById("target").style.cssText = "height: 500px;";
  const {
    lightningChart,
    PalettedFill,
    LUT,
    ColorHSV,
    emptyLine,
    AxisScrollStrategies,
    AxisTickStrategies,
    LegendBoxBuilders,
    Themes,
  } = lcjs;

  const { createSpectrumDataGenerator } = xydata;
  // Length of single data sample.
  const dataSampleSize = 300;

  // Setup PalettedFill for dynamically coloring Heatmap by Intensity values.
  const lut = new LUT({
    steps: [
      { value: 0, label: "0", color: ColorHSV(0, 1, 0) },
      { value: 15, label: "15", color: ColorHSV(270, 0.84, 0.2) },
      { value: 30, label: "30", color: ColorHSV(289, 0.86, 0.35) },
      { value: 45, label: "45", color: ColorHSV(324, 0.97, 0.56) },
      { value: 60, label: "60", color: ColorHSV(1, 1, 1) },
      { value: 75, label: "75", color: ColorHSV(44, 0.64, 1) },
    ],
    units: "dB",
    interpolate: true,
  });
  const paletteFill = new PalettedFill({ lut, lookUpProperty: "value" });

  // Create ChartXY.
  const chart = lightningChart()
    .ChartXY({
      // theme: Themes.darkGold
      container: "target",
    })
    .setTitle("Scrolling Heatmap Spectrogram");
  document.getElementById("target").style.boxSizing = "border-box";
  chart
    .getDefaultAxisX()
    .setTitle("Time")
    // Setup progressive scrolling Axis.
    .setScrollStrategy(AxisScrollStrategies.progressive)
    .setInterval({ start: -10001, end: 0, stopAxisAfter: false })
    .setTickStrategy(AxisTickStrategies.Time);
  chart.getDefaultAxisY().setTitle("Frequency (Hz)").setInterval({
    start: 0,
    end: dataSampleSize,
    animate: true,
    stopAxisAfter: false,
  });

  // Create Scrolling Heatmap Grid Series.
  const heatmapSeries = chart
    .addHeatmapScrollingGridSeries({
      scrollDimension: "columns",
      resolution: dataSampleSize,
      start: { x: 0, y: 0 },
      // Heatmap X step is synced with incoming data interval (1 sample per 25 milliseconds).
      step: { x: 25, y: 1 },
    })
    .setFillStyle(paletteFill)
    .setWireframeStyle(emptyLine)
    .setMouseInteractions(false)
    // Configure automatic data cleaning.
    .setDataCleaning({
      // Out of view data can be lazily removed as long as total columns count remains over 1000.
      minDataPointCount: 1000,
    });

  // Add LegendBox to chart.
  const legend = chart
    .addLegendBox(LegendBoxBuilders.HorizontalLegendBox)
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
      type: "max-width",
      maxWidth: 0.8,
    })
    .add(chart);

  // Stream in continous data.
  let dataAmount = 0;
  createSpectrumDataGenerator()
    .setSampleSize(dataSampleSize)
    .setNumberOfSamples(1000)
    .generate()
    .setStreamRepeat(true)
    .setStreamInterval(25)
    .setStreamBatchSize(1)
    .toStream()
    // Scale Intensity values from [0.0, 1.0] to [0.0, 80]
    .map((sample) => sample.map((intensity) => intensity * 80))
    // Push Intensity values to Surface Grid as Columns.
    .forEach((sample) => {
      heatmapSeries.addIntensityValues([sample]);
      dataAmount += sample.length;
    });

  // Display incoming points amount in Chart title.
  const title = chart.getTitle();
  let tStart = Date.now();
  let lastReset = Date.now();
  const updateChartTitle = () => {
    // Calculate amount of incoming points / second.
    if (dataAmount > 0 && Date.now() - tStart > 0) {
      const pps = (1000 * dataAmount) / (Date.now() - tStart);
      chart.setTitle(`${title} (${Math.round(pps)} data points / s)`);
    }
    // Reset pps counter every once in a while in case page is frozen, etc.
    if (Date.now() - lastReset >= 5000) {
      tStart = lastReset = Date.now();
      dataAmount = 0;
    }
  };
  setInterval(updateChartTitle, 1000);

  document.getElementById("desc").innerHTML =
    '<object  style = "width:80%; height:400px;" data="heatmap.html" ></object>';
}

function Surfaceseries() {
  document.getElementById("desc").innerHTML = "";
  document.getElementById("target").innerHTML = "";
  document.getElementById("target").style.cssText = "height: 500px;";
  const {
    lightningChart,
    LUT,
    PalettedFill,
    ColorShadingStyles,
    LegendBoxBuilders,
    UIElementBuilders,
    UIOrigins,
    UIDraggingModes,
    emptyFill,
    UILayoutBuilders,
    regularColorSteps,
    Themes,
  } = lcjs;
  const { createWaterDropDataGenerator } = xydata;

  const COLUMNS = 100;
  const ROWS = 100;

  const chart = lightningChart()
    .Chart3D({
      container: "target",
    })
    .setTitle("Generating example data ...");
  document.getElementById("target").style.boxSizing = "border-box";

  Promise.all([
    // Generate Height map data set.
    createWaterDropDataGenerator()
      .setColumns(COLUMNS)
      .setRows(ROWS)
      .setWaterDrops([
        {
          rowNormalized: 0.5,
          columnNormalized: 0.5,
          amplitude: 20,
        },
      ])
      .generate(),
    // Generate intensity data set.
    createWaterDropDataGenerator()
      .setColumns(COLUMNS)
      .setRows(ROWS)
      .setVolatility(10)
      .setWaterDrops([
        {
          columnNormalized: 0.22,
          rowNormalized: 0.2,
          amplitude: 80,
        },
        {
          columnNormalized: 0.4,
          rowNormalized: 0.7,
          amplitude: 70,
        },
        {
          columnNormalized: 0.8,
          rowNormalized: 0.3,
          amplitude: 100,
        },
      ])
      .generate(),
  ]).then((dataSets) => {
    chart.setTitle("Rendering data ...");
    requestAnimationFrame(() => {
      const tStart = performance.now();
      const heightDataSet = dataSets[0];
      const intensityDataSet = dataSets[1];

      const surfaceGrid = chart
        .addSurfaceGridSeries({
          dataOrder: "rows",
          columns: COLUMNS,
          rows: ROWS,
        })
        .setIntensityInterpolation("bilinear")
        .invalidateHeightMap(heightDataSet)
        .invalidateIntensityValues(intensityDataSet);

      requestAnimationFrame(() => {
        const tNow = performance.now();
        const tLoadupMs = tNow - tStart;
        chart.setTitle(
          `Intensity Surface Grid ${COLUMNS}x${ROWS} (${(
            (COLUMNS * ROWS) /
            10 ** 3
          ).toFixed(1)} thousand data points) | Ready in ${(
            tLoadupMs / 1000
          ).toFixed(2)} s`
        );

        // Add selector to see difference between Simple and Phong 3D color shading style in Surface grid series.
        const layout = chart
          .addUIElement(UILayoutBuilders.Column)
          .setPosition({ x: 100, y: 100 })
          .setOrigin(UIOrigins.RightTop)
          .setMargin({ top: 40, right: 8 })
          .setDraggingMode(UIDraggingModes.notDraggable);

        const toggleColorShadingStyle = (state) => {
          surfaceGrid.setColorShadingStyle(
            state
              ? new ColorShadingStyles.Phong()
              : new ColorShadingStyles.Simple()
          );
          selectorColorShadingStyle.setText(
            `Color shading style: ${state ? "Phong" : "Simple"}`
          );
        };
        const selectorColorShadingStyle = layout.addElement(
          UIElementBuilders.CheckBox
        );
        selectorColorShadingStyle.onSwitch((_, state) =>
          toggleColorShadingStyle(state)
        );
        toggleColorShadingStyle(false);

        // Add selector for wireframe only style.
        const defaultWireframeStyle = surfaceGrid.getWireframeStyle();
        const toggleWireframeStyle = (state) => {
          if (state) {
            surfaceGrid
              .setFillStyle(emptyFill)
              .setWireframeStyle(defaultStrokeStyle.setThickness(0.1));
          } else {
            const theme = chart.getTheme();
            surfaceGrid
              .setFillStyle(
                new PalettedFill({
                  lookUpProperty: "value",
                  lut: new LUT({
                    interpolate: true,
                    steps: regularColorSteps(
                      0,
                      100,
                      theme.examples.intensityColorPalette
                    ),
                  }),
                })
              )
              .setWireframeStyle(defaultWireframeStyle);
          }
          selectorWireframe.setText(
            state ? `Wireframe only` : "Fill + Wireframe"
          );
        };
        const selectorWireframe = layout.addElement(UIElementBuilders.CheckBox);
        selectorWireframe.onSwitch((_, state) => toggleWireframeStyle(state));
        toggleWireframeStyle(false);

        // Add legend.
        const legend = chart
          .addLegendBox(LegendBoxBuilders.HorizontalLegendBox)
          .add(chart);
      });
    });
  });

  document.getElementById("desc").innerHTML =
    '<object  style = "width:80%; height:400px;" data="surfaceseries.html" ></object>';
}

function Lineseries(chartcollection) {
  const { lightningChart, AxisTickStrategies, DataPatterns, Themes } = lcjs;
  document.getElementById("desc").innerHTML = "";
  document.getElementById("target").innerHTML = "";
  document.getElementById("target").style.cssText = "height: 500px;";

  // Create a XY Chart.
  const dateOrigin = new Date(2008, 0, 1);
  const chart = lightningChart().ChartXY({
    // theme: Themes.darkGold
    container: "target",
  });
  document.getElementById("target").style.boxSizing = "border-box";
  chart.getDefaultAxisX().setTickStrategy(
    // Use DateTime TickStrategy for this Axis
    AxisTickStrategies.DateTime,
    // Modify the DateOrigin of the TickStrategy
    (tickStrategy) => tickStrategy.setDateOrigin(dateOrigin)
  );
  chart.setTitle("Customer Satisfaction");

  // Add a line series.
  const lineSeries = chart.addLineSeries().setName("Customer Satisfaction");

  // Generate some points using for each month
  const dataFrequency = 30 * 24 * 60 * 60 * 1000;

  // Setup view nicely.
  chart
    .getDefaultAxisY()
    .setScrollStrategy(undefined)
    .setInterval({ start: 0, end: 100 })
    .setTitle("Satisfaction %");

  // Data for the plotting
  const satisfactionData = [];

  for (i = 0; i < chartcollection.length; i++) {
    x_point = chartcollection[i].X;
    y_point = chartcollection[i].Y;
    satisfactionData.push({
      x: Number(x_point),
      y: Number(y_point),
    });
  }

  // Adding points to the series
  lineSeries.add(
    satisfactionData.map((point) => ({
      x: point.x * dataFrequency,
      y: point.y,
    }))
  );

  // Show the customized result table for each point
  lineSeries.setCursorResultTableFormatter(
    (builder, series, xValue, yValue) => {
      return builder
        .addRow("Customer Satisfaction")
        .addRow(series.axisX.formatValue(xValue))
        .addRow(yValue.toFixed(2) + "%");
    }
  );

  document.getElementById("desc").innerHTML =
    '<object  style = "width:80%; height:400px;" data="lineseries.html" ></object>';
}
