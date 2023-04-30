import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

interface ItemProps {
  children?: React.ReactNode;
  xs?: number | "auto";
  style?: React.CSSProperties;
  sx?: React.CSSProperties;
  alignItems?: string;
  justifyContent?: string;
}

export const Item = (props: ItemProps) => {
  const { children, ...rest } = props;
  return (
    <Grid
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      {...rest}
    >
      {children}
    </Grid>
  );
};
