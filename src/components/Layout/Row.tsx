import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

interface RowProps {
  children: React.ReactNode;
  xs?: number;
  md?: number;
  spacing?: number;
  style?: React.CSSProperties;
  alignItems?: string;
  justifyContent?: string;
  flexWrap?: any;
}

export const Row = (props: RowProps) => {
  const { children, ...rest } = props;
  return (
    <Grid
      container
      xs={12}
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      flexWrap="wrap"
      direction="row"
      style={{ margin: "0px 0px" }}
      rowGap={3}
      {...rest}
    >
      {children}
    </Grid>
  );
};
