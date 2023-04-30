import { IJeelizFaceFilterDetectState } from "../js/helpers/JeelizFaceFilterInterfaces";

export const computeSizing = () => {
  // compute  size of the canvas:
  const wWidth = window.innerWidth;
  const maxWidth = 300;
  const minWidth = 200;
  const width =
    wWidth / 3.5 > maxWidth
      ? maxWidth
      : wWidth / 3.5 < minWidth
      ? minWidth
      : wWidth / 3.5;
  const height = width;

  // compute position of the canvas:
  const top = 0;
  return { width, height, top };
};

type Sizing = {
  width: number;
  height: number;
  top: number;
};

const doResize = (
  setSizing: React.Dispatch<React.SetStateAction<Sizing>>,
  _timerResize: string | number | NodeJS.Timeout | null | undefined
) => {
  _timerResize = null;
  const newSizing = computeSizing();
  setSizing(newSizing);
};

export const handleResize = (
  setSizing: React.Dispatch<React.SetStateAction<Sizing>>,
  _timerResize: string | number | NodeJS.Timeout | null | undefined
) => {
  // do not resize too often:
  if (_timerResize) {
    clearTimeout(_timerResize);
  }
  _timerResize = setTimeout(() => doResize(setSizing, _timerResize), 200);
};

export const captureCanvas = (
  faceFilterCanvasRef: React.RefObject<HTMLCanvasElement>
): string => {
  const canvas = faceFilterCanvasRef.current;
  const image = canvas?.toDataURL("png") || "";
  return image;
};

export const getFaceOrientation = (
  detectState: IJeelizFaceFilterDetectState
) => {
  const { ry: horizontal, rx: vertical, detected } = detectState;
  if (detected >= 0.5)
    return horizontal <= -0.55 && vertical > -0.2 && vertical < 0.2
      ? "left"
      : horizontal >= 0.55 && vertical > -0.2 && vertical < 0.2
      ? "right"
      : vertical <= -0.55 && horizontal > -0.2 && horizontal < 0.2
      ? "up"
      : vertical >= 0.5 && horizontal > -0.2 && horizontal < 0.2
      ? "down"
      : "front";
  else return "NOT_DETECTED";
};
