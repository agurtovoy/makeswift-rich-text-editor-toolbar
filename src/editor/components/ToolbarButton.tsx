import React, { FC } from "react";
import { IconButton, IconButtonProps, } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  button: {
    padding: 8,
  },
  active: {
    color: "#34e79a",
  },
  inactive: {
    color: theme.palette.common.white,
  },
}));

export interface ToolbarButtonProps extends IconButtonProps {
  active?: boolean;
}

const ToolbarButton: FC<ToolbarButtonProps> = ({ active, children, ...props }) => {
  const s = useStyles();
  return (
    <IconButton classes={{ root: s.button, colorPrimary: active ? s.active : s.inactive }} size="small" {...props}>
      {children}
    </IconButton >
  );
};

export default ToolbarButton;
