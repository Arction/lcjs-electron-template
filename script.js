function intro(){    
    document.getElementById("desc").innerHTML = "";
    document.getElementById('target').style.cssText = "";
    document.getElementById("target").innerHTML='<object  style = "width:1100px; height:900px;" data="Intro_page.html" ></object>';
}

function Heatmapseries(){
    document.getElementById("desc").innerHTML = "";
    document.getElementById("target").innerHTML = "";
    document.getElementById('target').style.cssText = 'height: 500px;';
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
      } = lcjs
      
      const { createSpectrumDataGenerator } = xydata
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
          container: 'target'
        })
        .setTitle("Scrolling Heatmap Spectrogram");
      chart
        .getDefaultAxisX()
        .setTitle("Time")
        // Setup progressive scrolling Axis.
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setInterval(-10001, 0)
        .setTickStrategy(AxisTickStrategies.Time);
      chart
        .getDefaultAxisY()
        .setTitle("Frequency (Hz)")
        .setInterval(0, dataSampleSize, false, true);
      
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
            type: 'max-width',
            maxWidth: 0.80,
        })
        .add(chart)
      
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

      document.getElementById("desc").innerHTML='<object  style = "width:80%; height:400px;" data="heatmap.html" ></object>';
}

function Surfaceseries(){
    document.getElementById("desc").innerHTML = "";
    document.getElementById("target").innerHTML = "";
    document.getElementById('target').style.cssText = 'height: 500px;';
const {
    lightningChart,
    SurfaceSeriesTypes3D,
    ColorHSV,
    ColorRGBA,
    IndividualPointFill,
    PalettedFill,
    SolidFill,
    LUT,
    UIOrigins,
    UIBackgrounds,
    UIElementBuilders,
    UILayoutBuilders,
    emptyFill,
    Themes
} = lcjs



const chart3D = lightningChart().Chart3D( {
    // theme: Themes.darkGold
    container: 'target'
} )
    .setTitle( 'Simple 3D Surface Grid' )

chart3D.getDefaultAxisY()
    .setScrollStrategy( undefined )
    .setInterval( 0, 200 )

// Create color Look-Up-Table for dynamic colouring.
const palette = new LUT( {
    steps: [
        { value: 0, color: ColorRGBA( 0, 0, 0 ) },
        { value: 66, color: ColorRGBA( 255, 0, 0 ) },
        { value: 133, color: ColorRGBA( 0, 255, 0 ) },
        { value: 200, color: ColorRGBA( 0, 0, 255 ) }
    ],
    interpolate: true
} )

const rows = 25
const columns = rows
const surface = chart3D.addSurfaceSeries( {
    type: SurfaceSeriesTypes3D.Grid,
    rows,
    columns,
    start: { x: 0, z: 0 },
    end: { x: 1000, z: 1000 },
    pixelate: true
} )
    // Set Wireframe style.
    .setWireframeStyle( new SolidFill( { color: ColorRGBA( 0, 0, 0, 50 ) } ) )



// Assign a Value to each coordinate of the Grid to be used when colouring by look up value.
surface.invalidateValuesOnly( ( row, column ) =>  row * ( 200 / rows ) )

// Assign a Color to each coordinate of the Grid to be used when colouring by individual color.
// Leave some blanks to showcase fall back color.
surface.invalidateColorsOnly( ( row, column ) => Math.random() >= 0.50 ? ColorHSV( Math.random() * 360 ) : undefined )

// Animate data point heights by a function of time, row and column: y = f( row, column, t )
const y = ( row, column ) => 100 + 4* Math.sin( Date.now() / 500 + (row / rows) * 5 ) * ( Math.cos( (column/columns) * 2.5 ) * 20 )
const update = () => {
    // By passing a function to a invalidation method, the function is called back for each coordinate in the Surface Grid.
    // With the invalidateYOnly variant, the Number returned by the function will be assigned to that data points Y coordinate.
    surface.invalidateYOnly( y )

    requestAnimationFrame( update )
}
update()

// Animate Camera movement from file.
;(async () => {
    const cameraAnimationData = await (
        fetch( document.head.baseURI + 'examples/assets/lcjs_example_0905_3dSimpleSurfaceGrid-camera.json' )
            .then( r => r.json() )
    )
    if ( ! cameraAnimationData ) {
        console.log(`No Camera animation data.`)
        return
    }
    console.log(`Loaded Camera animation data.`)
    let frame = 0
    const nextFrame = () => {
        if ( cameraAnimationEnabledCheckbox.getOn() ) {
            const { cameraLocation } = cameraAnimationData.frames[Math.floor(frame) % cameraAnimationData.frames.length]
            chart3D.setCameraLocation( cameraLocation )
            frame += 1.5
        }
        requestAnimationFrame( nextFrame )
    }
    requestAnimationFrame( nextFrame )
})()

// * UI controls *
const group = chart3D.addUIElement( UILayoutBuilders.Column
    .setBackground( UIBackgrounds.Rectangle )
)
group
    .setPosition( { x: 0, y: 100 } )
    .setOrigin( UIOrigins.LeftTop )
    .setMargin( 10 )
    .setPadding( 4 )
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
        type: 'max-height',
        maxHeight: 0.30,
    })


// Add UI controls for changing surface style.
const options = []
const addOption = ( label, onEnabled, defaultSelection = false ) => {
    const checkBox = group.addElement( UIElementBuilders.CheckBox )
        .setText( label )

    if ( defaultSelection ) {
        checkBox.setOn( true )
        onEnabled()
    }

    checkBox.onSwitch( ( _, state ) => {
        if ( state ) {
            onEnabled()
            checkBox.setMouseInteractions( false )
            // Set all other check boxes off.
            options.forEach( option => option.checkBox !== checkBox && option.checkBox.setOn( false ).setMouseInteractions( true ) )
        }
    } )

    options.push( { checkBox } )
}

addOption( 'Color look up by Y', () =>
    // Look up data point color from LUT by Y coordinate
    surface.setFillStyle( new PalettedFill( { lut: palette, lookUpProperty: 'y' } ) )
    , true
)
addOption( 'Color look up by Value', () =>
    // Look up data point color from LUT by number Value associated with it (assigned by user)
    surface.setFillStyle( new PalettedFill( { lut: palette, lookUpProperty: 'value' } ) )
)
addOption( 'Individual Color', () =>
    // Color data points by Colors assigned to each data point.
    surface.setFillStyle( new IndividualPointFill()
        // Specify Color to be used for data points that haven't been assigned a Color.
        .setFallbackColor( ColorRGBA( 100, 0, 0 ) )
    )
)
addOption( 'Solid color', () =>
    // Single solid color.
    surface.setFillStyle( new SolidFill( { color: ColorHSV( Math.random() * 360 ) } ) )
)


// Add UI control for toggling wireframe.
const handleWireframeToggled = ( state ) => {
    // Set Wireframe style.
    surface.setWireframeStyle( state ?
        new SolidFill( { color: ColorRGBA( 0, 0, 0, 50 ) } ) :
        emptyFill
    )
    wireframeCheckbox.setText( state ? 'Hide wireframe' : 'Show wireframe' )
} 
const wireframeCheckbox = group.addElement( UIElementBuilders.CheckBox )
wireframeCheckbox.onSwitch((_, state) => handleWireframeToggled( state ))
wireframeCheckbox.setOn( true )


// Add UI control for toggling camera animation.
const handleCameraAnimationToggled = ( state ) => {
    cameraAnimationEnabledCheckbox.setText( state ? 'Disable camera animation' : 'Enable camera animation' )
    if ( cameraAnimationEnabledCheckbox.getOn() !== state ) {
        cameraAnimationEnabledCheckbox.setOn( state )
    }
}
const cameraAnimationEnabledCheckbox = group.addElement( UIElementBuilders.CheckBox )
cameraAnimationEnabledCheckbox.onSwitch((_, state) => handleCameraAnimationToggled( state ))
handleCameraAnimationToggled( true )
chart3D.onBackgroundMouseDrag(() => {
    handleCameraAnimationToggled( false )
})

// Add LegendBox to chart.
const legend = chart3D.addLegendBox()
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
        type: 'max-width',
        maxWidth: 0.30,
    })
    .add(chart3D)

    document.getElementById("desc").innerHTML='<object  style = "width:80%; height:400px;" data="surfaceseries.html" ></object>';
}

function Lineseries(chartcollection){
    const {
        lightningChart,
        AxisTickStrategies,
        DataPatterns,
        Themes
    } = lcjs
    document.getElementById("desc").innerHTML = "";
    document.getElementById("target").innerHTML = "";
    document.getElementById('target').style.cssText = 'height: 500px;';

    // Create a XY Chart.
    const dateOrigin = new Date(2008, 0, 1)
    const chart = lightningChart().ChartXY({
        // theme: Themes.darkGold
        container: 'target'
    })
    chart.getDefaultAxisX()
        .setTickStrategy(
            // Use DateTime TickStrategy for this Axis
            AxisTickStrategies.DateTime,
            // Modify the DateOrigin of the TickStrategy
            (tickStrategy) => tickStrategy.setDateOrigin(dateOrigin)
        )
    chart.setTitle('Customer Satisfaction')
    
    // Add a line series.
    const lineSeries = chart.addLineSeries()
        .setName('Customer Satisfaction')
    
    // Generate some points using for each month
    const dataFrequency = 30 * 24 * 60 * 60 * 1000
    
    // Setup view nicely.
    chart.getDefaultAxisY()
        .setScrollStrategy(undefined)
        .setInterval(0, 100)
        .setTitle('Satisfaction %')
    
    // Data for the plotting
    const satisfactionData = []

    for (i = 0; i < chartcollection.length; i++) {

        x_point = chartcollection[i].X;
        y_point = chartcollection[i].Y;
        satisfactionData.push({
            "x": Number(x_point),
            "y": Number(y_point),
        });
    }
    
    // Adding points to the series
    lineSeries.add(satisfactionData.map((point) => ({ x: point.x * dataFrequency, y: point.y })))
    
    // Show the customized result table for each point
    lineSeries.setCursorResultTableFormatter((builder, series, xValue, yValue) => {
        return builder
            .addRow('Customer Satisfaction')
            .addRow(series.axisX.formatValue(xValue))
            .addRow(yValue.toFixed(2) + "%")
    })
    
    document.getElementById("desc").innerHTML='<object  style = "width:80%; height:400px;" data="lineseries.html" ></object>';
}
