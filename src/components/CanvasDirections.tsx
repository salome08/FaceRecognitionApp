import React from "react";
import { Container } from "./Layout/Container";
import { Row } from "./Layout/Row";
import { Item } from "./Layout/Item";
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from "@mui/icons-material";

interface FacePictures {
  orientation: string;
  img: string;
}

interface FaceCanvasProps {
  sizing: { height: number; width: number };
  faceOrientation: string;
  children: React.ReactNode;
  facePictures: { orientation: string; img: string }[];
}

interface CurrentFacePositionProps {
  icon: React.ReactElement;
  faceOrientation: string;
  position: string;
  facePictures: FacePictures[];
}

const CurrentFacePosition = (props: CurrentFacePositionProps) => {
  const { faceOrientation, position, facePictures, icon } = props;
  const pictureTaken = facePictures.find(
    (pic) => pic.orientation === position && pic.img !== ""
  );

  const alignItems = position === "up" ? "flex-start" : "flex-end";
  const minHeight = position === "up" || position === "down" ? "35px" : 0;
  const margin =
    position === "right"
      ? "0 0 0 22px"
      : position === "left"
      ? "0 22px 0 0"
      : 0;

  return (
    <Container>
      <Row
        xs={12}
        alignItems={alignItems}
        style={{
          minHeight: minHeight,
          margin: margin,
        }}
      >
        {React.cloneElement(icon, {
          fontSize: faceOrientation === position ? "large" : "medium",
          style: {
            color: pictureTaken ? "#1976d2" : "gray",
          },
        })}
      </Row>
    </Container>
  );
};

const CanvasDirections = (props: FaceCanvasProps) => {
  const { sizing, faceOrientation, children, facePictures } = props;

  return (
    <Container rowGap={0}>
      <Row>
        <Item xs={12}>
          <CurrentFacePosition
            icon={<KeyboardArrowUp />}
            position="up"
            faceOrientation={faceOrientation}
            facePictures={facePictures}
          />
        </Item>
      </Row>
      <Row flexWrap="nowrap">
        <Item xs={1}>
          <CurrentFacePosition
            icon={<KeyboardArrowLeft />}
            position="left"
            faceOrientation={faceOrientation}
            facePictures={facePictures}
          />
        </Item>
        <Item
          xs={10}
          style={{
            position: "relative",
            width: sizing.width,
            height: sizing.height,
          }}
        >
          {children}
        </Item>
        <Item xs={1}>
          <CurrentFacePosition
            icon={<KeyboardArrowRight />}
            position="right"
            faceOrientation={faceOrientation}
            facePictures={facePictures}
          />
        </Item>
      </Row>
      <Row>
        <Item xs={12}>
          <CurrentFacePosition
            icon={<KeyboardArrowDown />}
            position="down"
            faceOrientation={faceOrientation}
            facePictures={facePictures}
          />
        </Item>
      </Row>
    </Container>
  );
};

export default CanvasDirections;
