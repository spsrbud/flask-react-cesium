import React, { useEffect, useRef } from "react";
import { Viewer } from "cesium";
import "cesium/Widgets/widgets.css";

const App = () => {
  const cesiumContainer = useRef(null);

  useEffect(() => {
    // Log CESIUM_BASE_URL for debugging
    console.log("CESIUM_BASE_URL:", typeof CESIUM_BASE_URL === "undefined" ? "undefined" : CESIUM_BASE_URL);

    // Initialize Cesium Viewer
    const viewer = new Viewer(cesiumContainer.current, {
      terrainProvider: undefined,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
    });

    // Fetch API data with /firefly prefix
    fetch("/api/globe")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error fetching API:", error));

    return () => {
      // Cleanup Cesium Viewer
      viewer.destroy();
    };
  }, []);

  return (
    <div>
      <h1>Cesium Globe</h1>
      <div
        ref={cesiumContainer}
        style={{ width: "100%", height: "90vh" }}
      />
    </div>
  );
};

export default App;
