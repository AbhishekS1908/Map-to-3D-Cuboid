// import "./App.css";
// import React, { useState, useRef } from "react";
// import mapboxgl from "mapbox-gl";
// import * as BABYLON from "babylonjs";
// import MapContainer from "./mapContainer/mapContainer";
// import Cuboid from "./Cuboid/cuboid";

// const App = () => {
// const [center, setCenter] = useState({ lng: 0, lat: 0 });
// const [zoom, setZoom] = useState(10);
// const scene = useRef(0);
// // let scene = null;
// let canvas = null;

// const handleMapChange = (event) => {
//   //const newCenter = e.getCenter()
//   //setCenter({ lng: newCenter.lng, lat: newCenter.lat });
//   const { latLng } = event;
//   const lat = latLng.lat();
//   const lng = latLng.lng();
//   setCenter({ lng, lat });
//   setZoom(event.getZoom());
// };

// const handleCapture = () => {
//   const map = document.querySelector(".mapboxgl-canvas");
//   const image = new Image();
//   const accessToken =
//     "pk.eyJ1IjoiYWZuYW5uYXZheiIsImEiOiJjbGZkbTQ2bjEwdnNkM3FwZ2t4NmxvN3QzIn0.1Vu6w73vG25MjPt3d7D2Sw";

//   image.src = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${center.lng},${center.lat},${zoom},0,0/971x400?access_token=${accessToken}`;
//   const canvas = document.createElement("canvas");
//   canvas.width = map.offsetWidth;
//   canvas.height = map.offsetHeight;

//   const context = canvas.getContext("2d");

//   image.onload = () => {
//     context.drawImage(image, 0, 0, canvas.width, canvas.height);

//     const texture = new BABYLON.Texture(image.src, scene.current);
//     const material = new BABYLON.StandardMaterial("texture", scene.current);
//     material.diffuseTexture = texture;

//     const box = BABYLON.MeshBuilder.CreateBox(
//       "box",
//       { size: 1 },
//       scene.current
//     );
//     box.material = material;
//   };
// };

// const onSceneMount = (e) => {
//   const { scene, canvas } = e;
//   const camera = new BABYLON.ArcRotateCamera(
//     "Camera",
//     0,
//     0,
//     10,
//     BABYLON.Vector3.Zero(),
//     scene
//   );
//   camera.attachControl(canvas, true);
// };

// const setCanvas = (c) => {
//   canvas = c;
// };

// const onResizeWindow = () => {
//   if (scene.current) {
//     scene.current.getEngine().resize();
//   }
// };

// React.useEffect(() => {
//   if (canvas) {
//     const engine = new BABYLON.Engine(canvas, true, {
//       preserveDrawingBuffer: true,
//       stencil: true,
//     });
//     // scene.current = new BABYLON.Scene(engine);
//     let sceneCurrent = new BABYLON.Scene(engine);
//     scene.current = sceneCurrent;
//     console.log(scene, scene.current);
//     onSceneMount({ sceneCurrent, canvas });
//     engine.runRenderLoop(() => {
//       if (typeof sceneCurrent !== "undefined") {
//         sceneCurrent.render();
//       }
//     });

//     window.addEventListener("resize", onResizeWindow);
//   }

//   return () => {
//     window.removeEventListener("resize", onResizeWindow);
//   };
// }, [canvas]);

// React.useEffect(() => {
//   mapboxgl.accessToken =
//     "pk.eyJ1IjoiYWZuYW5uYXZheiIsImEiOiJjbGZkbTQ2bjEwdnNkM3FwZ2t4NmxvN3QzIn0.1Vu6w73vG25MjPt3d7D2Sw";
//   const map = new mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/mapbox/streets-v11",
//     center: [center.lng, center.lat],
//     zoom,
//   });
//   map.on("move", handleMapChange);

//   return () => {
//     map.off("move", handleMapChange);
//   };
// }, [center, zoom]);

// return (
//   <div style={{ height: "400px", width: "100%" }}>
//     <div id="map" style={{ height: "100%", width: "100%" }} />
//     <button onClick={handleCapture}>Capture and Apply</button>
//     <canvas
//       id="renderCanvas"
//       style={{ width: "100%", height: "400px" }}
//       ref={(c) => setCanvas(c)}
//     />
//   </div>
// );

//   const [visibleRegion, setVisibleRegion] = useState(null);

//   const onCaptureImage = () => {
//     // TODO: Capture visible region as an image and apply it as a texture to the cuboid
//   };

//   return (
//     <div>
//       <MapContainer onVisibleRegionChange={setVisibleRegion} />
//       {visibleRegion && <Cuboid visibleRegion={visibleRegion} />}
//       <button onClick={onCaptureImage}>Capture Image</button>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, useRef } from "react";
// import MapContainer from "./mapContainer/mapContainer";
import Cuboid from "./Cuboid/cuboid";
//import html2canvas from "html2canvas";
import { ACCESS_TOKEN } from "./constants";
import mapboxgl from "mapbox-gl";

const App = () => {
  const [visibleRegion, setVisibleRegion] = useState(null);
  const [cuboidImage, setCuboidImage] = useState(null);
  const newMapRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    console.log('MAPREF:', mapRef)
  }, [mapRef])
  
  useEffect(() => {
  mapboxgl.accessToken = ACCESS_TOKEN;
  newMapRef.current = new mapboxgl.Map({
    container: mapRef.current,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-122.4194, 37.7749],
    zoom: 14,
  });

  newMapRef.current.on("click", (event) => {
    const visibleRegion = {
      lng: event.lngLat.lng,
      lat: event.lngLat.lat,
    };
    handleVisibleRegionChange(visibleRegion);
  });

    // return () => {
    //   map.remove();
    // };
  }, []);

  useEffect(() => {
    console.log("cuboidImage", cuboidImage);
  }, [cuboidImage]);

  const handleVisibleRegionChange = (region) => {
    setVisibleRegion(region);
  };

  const handleCapture = async (map) => {
    const canvas = newMapRef.current.getCanvas();
    const dataURL = canvas.toDataURL("image/png");
    setCuboidImage(dataURL);
  };

  return (
    <div>
      <div id='map-container' ref={mapRef} style={{ height: '50vh', width: '50vw' }} />
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        {visibleRegion && (
          <p>
            Visible region: {visibleRegion.lng.toFixed(4)},{" "}
            {visibleRegion.lat.toFixed(4)}
          </p>
        )}
        <button onClick={() => handleCapture()}>Capture</button>
      </div>
      <Cuboid imageSrc={cuboidImage} />
      <img src={cuboidImage} alt="Noimage" />
    </div>
  );
};

export default App;
