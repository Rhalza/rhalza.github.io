const initDigitalTwin = async () => {
    const esriImagery = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        { enablePickFeatures: false }
    );

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
                powerPreference: "high-performance",
                failIfMajorPerformanceCaveat: false
            }
        }
    });

    viewer.scene.highDynamicRange = false;
    viewer.scene.postProcessStages.fxaa.enabled = false;
    viewer.scene.globe.enableLighting = false;
    viewer.scene.globe.showWaterEffect = false;
    viewer.scene.globe.depthTestAgainstTerrain = false;

    viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2024-05-21T14:30:00Z");

    viewer.scene.skyAtmosphere.brightnessShift = 0.3;
    viewer.scene.skyAtmosphere.saturationShift = 0.2;
    viewer.scene.skyAtmosphere.hueShift = -0.05;

    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = true;
    bloom.uniforms.glowOnly = false;
    bloom.uniforms.contrast = 1.1;
    bloom.uniforms.brightness = -0.1;
    bloom.uniforms.delta = 1.0;
    bloom.uniforms.sigma = 2.5;
    bloom.uniforms.stepSize = 1.5;

    const lensFlare = Cesium.PostProcessStageLibrary.createLensFlareStage();
    viewer.scene.postProcessStages.add(lensFlare);
    lensFlare.enabled = true;
    lensFlare.uniforms.intensity = 2.5;
    lensFlare.uniforms.distortion = 8.0;
    lensFlare.uniforms.ghostDispersal = 0.45;
    lensFlare.uniforms.haloWidth = 0.4;
    lensFlare.uniforms.dirtAmount = 0.5;

    const startLocation = Cesium.Cartesian3.fromDegrees(-74.006, 40.7128, 25000000);
    viewer.camera.setView({
        destination: startLocation,
        orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0.0
        }
    });

    document.getElementById('btn-space').addEventListener('click', () => {
        const currentLon = viewer.camera.positionCartographic.longitude * (180 / Math.PI);
        const currentLat = viewer.camera.positionCartographic.latitude * (180 / Math.PI);
        
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(currentLon, currentLat, 25000000),
            duration: 3.0,
            orientation: {
                heading: 0.0,
                pitch: Cesium.Math.toRadians(-90.0),
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