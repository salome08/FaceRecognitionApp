import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Row } from "./Layout/Row";
import { Item } from "./Layout/Item";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { captureCanvas } from "../utils/functions";

interface FacePictures {
  orientation: string;
  img: string;
}

interface addPictureToListProps {
  facePictures: FacePictures[];
  faceOrientation: string;
  faceFilterCanvasRef: React.RefObject<HTMLCanvasElement>;
  setFacePictures: React.Dispatch<React.SetStateAction<FacePictures[]>>;
}
const orientations = ["front", "left", "right", "up", "down"];

export const addPictureToList = (props: addPictureToListProps) => {
  const {
    facePictures,
    faceOrientation,
    faceFilterCanvasRef,
    setFacePictures,
  } = props;

  orientations.forEach((orientation) => {
    if (faceOrientation === orientation) {
      if (
        facePictures.find((pic) => pic.orientation === orientation)?.img ===
          "" &&
        faceOrientation === orientation
      )
        setTimeout(() => {
          setFacePictures((prevState: FacePictures[]) => [
            ...prevState.filter((pic) => pic.orientation !== orientation),
            {
              orientation: orientation,
              img: captureCanvas(faceFilterCanvasRef),
            },
          ]);
        }, 500);
    }
  });
};

const PicturesList: React.FC<{ facePictures: FacePictures[] }> = ({
  facePictures,
}) => {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {facePictures.map((item) => (
        <ImageListItem
          key={item.orientation}
          sx={{ justifyContent: "center", background: "white" }}
        >
          {item.img ? (
            <img
              src={item.img}
              srcSet={item.img}
              alt={item.orientation}
              loading="lazy"
            />
          ) : (
            <Row>
              <Item
                sx={{
                  textAlign: "center",
                  color: "gray",
                  fontWeight: "lighter",
                }}
              >
                Turn your head {item.orientation}
              </Item>
              <PhotoCameraIcon sx={{ color: "gray" }} />
            </Row>
          )}
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default PicturesList;
