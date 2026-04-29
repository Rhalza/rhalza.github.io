const initDigitalTwin = () => {
    const esriImagery = new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 19,
        hasAlphaChannel: false
    });

    const viewer = new Cesium.Viewer('cesiumContainer', {
        baseLayer: new Cesium.ImageryLayer(esriImagery),
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

    viewer.scene.highDynamicRange = false;
    viewer.scene.postProcessStages.fxaa.enabled = false;
    
    viewer.scene.globe.enableLighting = false;
    viewer.scene.globe.showWaterEffect = false;
    viewer.scene.globe.depthTestAgainstTerrain = false;
    
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a1423');

    viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2024-05-21T12:00:00Z");

    viewer.scene.skyAtmosphere.brightnessShift = 0.4;
    viewer.scene.skyAtmosphere.saturationShift = 0.3;
    viewer.scene.skyAtmosphere.hueShift = 0.05;

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

    try {
        const lensFlare = Cesium.PostProcessStageLibrary.createLensFlareStage();
        viewer.scene.postProcessStages.add(lensFlare);
        lensFlare.enabled = true;
        lensFlare.uniforms.intensity = 3.0;
        lensFlare.uniforms.distortion = 10.0;
        lensFlare.uniforms.ghostDispersal = 0.4;
        lensFlare.uniforms.haloWidth = 0.6;
        lensFlare.uniforms.dirtAmount = 0.5;
    } catch(e) {}

    const startLocation = Cesium.Cartesian3.fromDegrees(-40.0, 20.0, 28000000);
    viewer.camera.setView({
        destination: startLocation,
        orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-80.0),
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