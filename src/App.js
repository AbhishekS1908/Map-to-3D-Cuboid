import "./App.css";
import React, { useState } from "react";
import mapboxgl from "mapbox-gl";
import * as BABYLON from "babylonjs";

const App = () => {
  const [center, setCenter] = useState({ lng: 0, lat: 0 });
  const [zoom, setZoom] = useState(10);
  let scene = null;
  let canvas = null;

  const handleMapChange = (map) => {
    const newCenter = map.getCenter();
    setCenter({ lng: newCenter.lng, lat: newCenter.lat });
    setZoom(map.getZoom());
  };

  const handleCapture = () => {
    const map = document.querySelector(".mapboxgl-canvas");
    const image = new Image();
    const accessToken =
      "pk.eyJ1IjoiYWZuYW5uYXZheiIsImEiOiJjbGZkbTQ2bjEwdnNkM3FwZ2t4NmxvN3QzIn0.1Vu6w73vG25MjPt3d7D2Sw";

    image.src = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${center.lng},${center.lat},${zoom},0,0/971x400?access_token=${accessToken}`;
    const canvas = document.createElement("canvas");
    canvas.width = map.offsetWidth;
    canvas.height = map.offsetHeight;

    const context = canvas.getContext("2d");

    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const texture = new BABYLON.Texture(image.src, scene);
      const material = new BABYLON.StandardMaterial("texture", scene);
      material.diffuseTexture = texture;

      const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
      box.material = material;
    };
  };

  const onSceneMount = (e) => {
    const { scene, canvas } = e;
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      0,
      0,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
  };

  const setCanvas = (c) => {
    canvas = c;
  };

  const onResizeWindow = () => {
    if (scene) {
      scene.getEngine().resize();
    }
  };

  React.useEffect(() => {
    if (canvas) {
      const engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
      });
      scene = new BABYLON.Scene(engine);
      onSceneMount({ scene, canvas });
      engine.runRenderLoop(() => {
        if (typeof scene !== "undefined") {
          scene.render();
        }
      });

      window.addEventListener("resize", onResizeWindow);
    }

    return () => {
      window.removeEventListener("resize", onResizeWindow);
    };
  }, [canvas]);

  React.useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWZuYW5uYXZheiIsImEiOiJjbGZkbTQ2bjEwdnNkM3FwZ2t4NmxvN3QzIn0.1Vu6w73vG25MjPt3d7D2Sw";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [center.lng, center.lat],
      zoom,
    });
    map.on("move", handleMapChange);

    return () => {
      map.off("move", handleMapChange);
    };
  }, [center, zoom]);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <div id="map" style={{ height: "100%", width: "100%" }} />
      <button onClick={handleCapture}>Capture and Apply</button>
      <canvas
        id="renderCanvas"
        style={{ width: "100%", height: "400px" }}
        ref={(c) => setCanvas(c)}
      />
    </div>
  );
};

export default App;
