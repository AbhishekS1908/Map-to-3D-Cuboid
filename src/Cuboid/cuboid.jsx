import React, { useRef } from "react";
import { Engine, Scene } from "react-babylonjs";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";

const Cuboid = ({ imageSrc }) => {
  const boxRef = useRef(null);

  return (
    <Engine canvasId="babylon-js-canvas">
      <Scene clearColor={new Color3(0.1, 0.1, 0.1)}>
        <arcRotateCamera
          name="camera"
          target={Vector3.Zero()}
          alpha={-Math.PI / 2}
          beta={Math.PI / 2}
          radius={10}
        />
        <hemisphericLight
          name="light"
          intensity={0.7}
          direction={Vector3.Up()}
        />
        <box name="box" position={new Vector3(0, 0, 0)} size={2} ref={boxRef}>
          <cubeTexture url={imageSrc} rootUrl={imageSrc} />
        </box>
      </Scene>
    </Engine>
  );
};

export default Cuboid;
