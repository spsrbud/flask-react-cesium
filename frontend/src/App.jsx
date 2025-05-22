import React, { useEffect, useRef } from "react";
import { Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const App = () => {
  const cesiumContainer = useRef(null);

  useEffect(() => {
    // Initialize Cesium Viewer
    const viewer = new Viewer(cesiumContainer.current, {
      terrainProvider: undefined, // Disable terrain for simplicity
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
    });

    // Fetch API data (example)
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
