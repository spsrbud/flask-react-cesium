import React, { useState, useEffect, useRef } from "react";
import { Viewer } from "cesium";
import { io } from "socket.io-client";
import "cesium/Widgets/widgets.css";

const App = () => {
  const cesiumContainer = useRef(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

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

    // Initialize Socket.IO connection
    const socketConnection = io();
    setSocket(socketConnection);
     
    socketConnection.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socketConnection.on("server_message", (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message.data]);
    });

    return () => {
      // Cleanup Cesium Viewer
      viewer.destroy();
      socketConnection.disconnect();
      console.log("Socket.IO disconnected");
    };
  }, []);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("client_message", { data: message });
      console.log("Sent message:", message);
    } else {
      console.error("Socket.IO not connected");
    }
  };

  return (
    <div>
      <h1>Cesium Globe</h1>
      <button onClick={() => sendMessage("Hello from client!")}>
        Send Message
      </button>
      <div>
	  {messages.map((msg, idx) => (
		  <div key={idx}>{msg}</div>
	  ))}
      </div>
      <div
        ref={cesiumContainer}
        style={{ width: "100%", height: "90vh" }}
      />
    </div>
  );
};

export default App;
