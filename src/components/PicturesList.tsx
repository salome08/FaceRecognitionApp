import React from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { AddPictureToListProps, FacePictureProps } from "../shared/types";
import * as colors from "../shared/colors";
import { orientations } from "../shared/constants";
import { captureCanvas } from "../utils/functions";
import { Item } from "./Layout/Item";
import { Row } from "./Layout/Row";
import "../App.css";

export const addPictureToList = (props: AddPictureToListProps) => {
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
          setFacePictures((prevState: FacePictureProps[]) => [
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

const PicturesList: React.FC<{ facePictures: FacePictureProps[] }> = ({
  facePictures,
}) => {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {facePictures.map((item) => (
        <ImageListItem
          key={item.orientation}
          sx={{ justifyContent: "center", background: colors.white }}
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
              <Item className="PicTitle">
                Turn your head {item.orientation}
              </Item>
              <PhotoCameraIcon sx={{ color: colors.secondaryColor }} />
            </Row>
          )}
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default PicturesList;
