import React from "react";

type LayoutProps = React.PropsWithChildren & {};

export const Layout = (props: LayoutProps) => {
  const { children } = props;
  return <div>{children}</div>;
};
