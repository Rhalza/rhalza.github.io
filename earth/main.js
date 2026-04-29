const initDigitalTwin = () => {
    // Unfailing Google Satellite imagery for perfect Z=0 outer space down to streets
    const satelliteImagery = new Cesium.UrlTemplateImageryProvider({
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        maximumLevel: 20
    });

    const viewer = new Cesium.Viewer('cesiumContainer', {
        baseLayer: new Cesium.ImageryLayer(satelliteImagery),
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        contextOptions: {
            webgl: {
                alpha: false,
                antialias: false,
                preserveDrawingBuffer: true,
                powerPreference: "high-performance"
            }
        }
    });

    // Mobile-safe performance settings
    viewer.scene.highDynamicRange = false;
    viewer.scene.postProcessStages.fxaa.enabled = false;
    
    // Disable real-time globe shadows so Earth is ALWAYS beautifully visible
    viewer.scene.globe.enableLighting = false;
    viewer.scene.globe.showWaterEffect = false;
    viewer.scene.globe.depthTestAgainstTerrain = false;

    // Force time of day to position the Sun perfectly for the lens flare
    viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2024-05-21T12:00:00Z");

    // Enhance atmosphere for a glowing cinematic look
    viewer.scene.skyAtmosphere.brightnessShift = 0.4;
    viewer.scene.skyAtmosphere.saturationShift = 0.3;
    viewer.scene.skyAtmosphere.hueShift = 0.05;

    // Cinematic Bloom
    try {
        const bloom = viewer.scene.postProcessStages.bloom;
        bloom.enabled = true;
        bloom.uniforms.contrast = 1.1;
        bloom.uniforms.brightness = -0.05;
        bloom.uniforms.glowOnly = false;
        bloom.uniforms.delta = 1.0;
        bloom.uniforms.sigma = 2.0;
        bloom.uniforms.stepSize = 1.0;
    } catch(e) {}

    // Anamorphic Lens Flare / Movie Poster Light Warping
    try {
        const lensFlare = Cesium.PostProcessStageLibrary.createLensFlareStage();
        viewer.scene.postProcessStages.add(lensFlare);
        lensFlare.enabled = true;
        lensFlare.uniforms.intensity = 3.5; // Massive glare
        lensFlare.uniforms.distortion = 12.0; // Stretches light horizontally like a movie poster
        lensFlare.uniforms.ghostDispersal = 0.4;
        lensFlare.uniforms.haloWidth = 0.6;
        lensFlare.uniforms.dirtAmount = 0.5;
    } catch(e) {}

    // Cinematic start view: Looking at Earth with the sun glaring from the top edge
    const startLocation = Cesium.Cartesian3.fromDegrees(-40.0, 20.0, 28000000);
    viewer.camera.setView({
        destination: startLocation,
        orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-80.0), // Tilted up slightly to catch the sun flare
            roll: 0.0
        }
    });

    document.getElementById('btn-space').addEventListener('click', () => {
        viewer.camera.flyTo({
            destination: startLocation,
            duration: 3.5,
            orientation: {
                heading: 0.0,
                pitch: Cesium.Math.toRadians(-80.0),
                roll: 0.0
            }
        });
    });

    document.getElementById('btn-ny').addEventListener('click', () => {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(-74.0134, 40.7054, 1500),
            orientation: {
                heading: Cesium.Math.toRadians(25.0),
                pitch: Cesium.Math.toRadians(-35.0),
                roll: 0.0
            },
            duration: 4.0
        });
    });

    document.getElementById('btn-tokyo').addEventListener('click', () => {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(139.7670, 35.6812, 1500),
            orientation: {
                heading: Cesium.Math.toRadians(-45.0),
                pitch: Cesium.Math.toRadians(-35.0),
                roll: 0.0
            },
            duration: 4.0
        });
    });
};

initDigitalTwin();