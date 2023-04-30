import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

interface ContainerProps {
  children: React.ReactNode;
  minHeight?: string;
  justifyContent?: string;
  alignItems?: string;
  style?: React.CSSProperties;
  rowGap?: number;
  className?: string;
}

export const Container = (props: ContainerProps) => {
  const { children, ...rest } = props;
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      rowGap={3}
      {...rest}
    >
      {children}
    </Grid>
  );
};
