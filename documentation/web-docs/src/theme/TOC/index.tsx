import React from "react";
import { useLocation } from "@docusaurus/router";
import TOC from "@theme-original/TOC";
import type TOCType from "@theme/TOC";
import type { WrapperProps } from "@docusaurus/types";
import ExampleSidebar from "../../components/ExampleSidebar";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

type Props = WrapperProps<typeof TOCType>;

import { useState, useEffect } from "react";

function getWindowDimensions() {
  if (!ExecutionEnvironment.canUseDOM) {
    // Return default dimensions for server-side rendering
    return {
      width: 1200,
      height: 800,
    };
  }

  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export default function TOCWrapper(props: Props): JSX.Element {
  const location = useLocation();

  // Check if we're on an examples page
  const isExamplePage = location.pathname.includes("/docs/examples/");
  //get current page width
  const { width } = useWindowDimensions();
  if (isExamplePage && width > 1250) {
    return <ExampleSidebar />;
  }

  return (
    <>
      <TOC {...props} />
    </>
  );
}
