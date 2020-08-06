import React, { ReactChildren, forwardRef } from "react";

export interface LinkElementProps {
  url: string;
  children: ReactChildren;
  [key: string]: any;
}

export const LinkElement = forwardRef<HTMLAnchorElement, LinkElementProps>(({ url, children, ...other }, ref) =>
  <a ref={ref} href={url} {...other}>
    {children}
  </a>
);
