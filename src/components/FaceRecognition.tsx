import React, { useState, useEffect, useRef } from "react";
import { Canvas, RootState, useFrame, useThree } from "@react-three/fiber";
import { JEELIZFACEFILTER, NN_DEFAULT } from "facefilter";
import * as THREE from "three";
import { JeelizThreeFiberHelper } from "../js/helpers/JeelizThreeFiberHelper.js";
import { IJeelizFaceFilterInitParams } from "../js/helpers/JeelizFaceFilterInterfaces";
import { Container } from "./Layout/Container";
import { Row } from "./Layout/Row";
import { Item } from "./Layout/Item";
import PicturesList, { addPictureToList } from "./PicturesList";
import {
  handleResize,
  computeSizing,
  getFaceOrientation,
} from "../utils/functions";
import CanvasDirections from "./CanvasDirections";
import FaceFollower3D from "./FaceFollower3D";

const orientations = ["front", "left", "right", "up", "down"];

type Sizing = {
  width: number;
  height: number;
};

interface FaceCanvasProps {
  sizing: Sizing;
  faceFilterCanvasRef: React.RefObject<HTMLCanvasElement>;
  faceOrientation: string;
  facePictures: FacePictures[];
}

interface FacePictures {
  orientation: string;
  img: string;
}

const _maxFacesDetected: number = 1;
const _faceFollowers = new Array<THREE.Object3D>(_maxFacesDetected);
let _threeFiber: RootState;

// fake component, display nothing
// just used to get the Camera and the renderer used by React-fiber:
const ThreeGrabber = ({ sizing }: { sizing: Sizing }) => {
  _threeFiber = useThree();
  useFrame(
    JeelizThreeFiberHelper.update_camera.bind(null, sizing, _threeFiber.camera)
  );
  return null;
};

const FaceCanvas = (props: FaceCanvasProps) => {
  const { sizing, faceFilterCanvasRef, faceOrientation, facePictures } = props;
  return (
    <CanvasDirections
      sizing={sizing}
      faceOrientation={faceOrientation}
      facePictures={facePictures}
    >
      <Item
        xs={10}
        style={{
          position: "relative",
          width: sizing.width,
          height: sizing.height,
        }}
      >
        <Canvas
          className="mirrorX"
          style={{
            position: "absolute",
            borderRadius: "10em",
            zIndex: 2,
            ...sizing,
          }}
          gl={{
            preserveDrawingBuffer: true, // allow image capture
          }}
        >
          <ThreeGrabber sizing={sizing} />
          <FaceFollower3D faceIndex={0} faceFollowers={_faceFollowers} />
        </Canvas>
        {/* Canvas managed by FaceFilter, just displaying the video (and used for WebGL computations) */}
        <canvas
          className="mirrorX"
          ref={faceFilterCanvasRef}
          style={{
            borderRadius: "10em",
            zIndex: 1,
            boxShadow: `0 0 21px 2px ${
              faceOrientation === "NOT_DETECTED" ? "#1976d2" : "black"
            }`,
            ...sizing,
          }}
          width={sizing.width}
          height={sizing.height}
        />
      </Item>
    </CanvasDirections>
  );
};

export default function FaceRecognition() {
  const [sizing, setSizing] = useState(computeSizing());
  const [isInitialized] = useState(false);
  const [faceOrientation, setFaceOrientation] = useState("Neutral");
  const [indicationToPerform, setIndicationToPerform] = useState(
    "Start to look at the camera"
  );
  const [facePictures, setFacePictures] = useState<FacePictures[]>(
    orientations.map((orientation) => {
      return { orientation, img: "" };
    })
  );
  const faceFilterCanvasRef = useRef<HTMLCanvasElement>(null);
  let _timerResize: string | number | NodeJS.Timeout | null | undefined = null;

  // adjusting the canvas resolution to the good size, balance between performance and quality
  useEffect(() => {
    if (!_timerResize) {
      JEELIZFACEFILTER.resize();
    }
  }, [sizing]);

  const userIndicationToPerform = () => {
    if (facePictures.every((pic) => pic.img === ""))
      return "Start to look at the camera";
    for (const pic of facePictures) {
      if (pic.img === "") return `Then, look ${pic.orientation}`;
    }
  };

  // Take pictures for different positions
  useEffect(() => {
    if (facePictures.some((pic) => pic.img === "")) {
      const indication = userIndicationToPerform();
      setIndicationToPerform(indication as string);
      addPictureToList({
        facePictures,
        faceOrientation,
        faceFilterCanvasRef,
        setFacePictures,
      });
    } else setIndicationToPerform("Thank you");
  }, [faceOrientation, facePictures]);

  // FaceFilter Init
  useEffect(() => {
    window.addEventListener("resize", () =>
      handleResize(setSizing, _timerResize)
    );
    window.addEventListener("orientationchange", () =>
      handleResize(setSizing, _timerResize)
    );

    JEELIZFACEFILTER.init({
      canvas: faceFilterCanvasRef.current,
      NNC: NN_DEFAULT,
      maxFacesDetected: 1,
      followZRot: true,
      videoSettings: {
        flipX: true,
      },
      callbackReady: (errCode, spec) => {
        if (errCode) {
          console.log("AN ERROR HAPPENS. ERR =", errCode);
          return;
        }
        console.log("INFO: JEELIZFACEFILTER IS READY");
        // there is only 1 face to track, so 1 face follower:
        JeelizThreeFiberHelper.init(spec, _faceFollowers);
      },
      callbackTrack: (detectStatesArg) => {
        // if 1 face detection, wrap in an array:
        setFaceOrientation(getFaceOrientation(detectStatesArg));

        // update video and THREE faceFollowers poses:
        JeelizThreeFiberHelper.update([detectStatesArg], _threeFiber.camera);

        // render the video texture on the faceFilter canvas:
        JEELIZFACEFILTER.render_video();
      },
    } as IJeelizFaceFilterInitParams);
    return JEELIZFACEFILTER.destroy;
  }, [isInitialized]);

  return (
    <Container>
      <Row
        style={{
          fontSize: "x-large",
          fontWeight: "bold",
          color: "#1976d285",
        }}
      >
        Scanning...
      </Row>

      <FaceCanvas
        faceFilterCanvasRef={faceFilterCanvasRef}
        sizing={sizing}
        faceOrientation={faceOrientation}
        facePictures={facePictures}
      />
      <Row
        style={{
          fontSize: "x-large",
          fontWeight: "bold",
          color: "#1976d285",
        }}
      >
        {indicationToPerform}
      </Row>
      <Row
        style={{
          fontSize: "large",
          color: "gray",
        }}
      >
        Wait for the picture to be taken automatially
      </Row>
      <Row>
        <PicturesList facePictures={facePictures} />
      </Row>
    </Container>
  );
}
