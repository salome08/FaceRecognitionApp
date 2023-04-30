export interface Sizing {
  width: number;
  height: number;
}

export interface FacePictureProps {
  orientation: string;
  img: string;
}

export interface CanvasDirectionsProps {
  sizing: { height: number; width: number };
  faceOrientation: string;
  children: React.ReactNode;
  facePictures: { orientation: string; img: string }[];
}

export interface CurrentFacePositionProps {
  icon: React.ReactElement;
  faceOrientation: string;
  position: string;
  facePictures: FacePictureProps[];
}

export interface FaceCanvasProps {
  sizing: Sizing;
  faceFilterCanvasRef: React.RefObject<HTMLCanvasElement>;
  faceOrientation: string;
  facePictures: FacePictureProps[];
}

export interface AddPictureToListProps {
  facePictures: FacePictureProps[];
  faceOrientation: string;
  faceFilterCanvasRef: React.RefObject<HTMLCanvasElement>;
  setFacePictures: React.Dispatch<React.SetStateAction<FacePictureProps[]>>;
}

export type Orientation = "front" | "left" | "right" | "up" | "down";
