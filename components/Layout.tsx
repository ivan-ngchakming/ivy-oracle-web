import * as React from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import backgroundImage from "../assets/img/background.jpg";
import classNames from "classnames";
import { CHAIN } from "../lib/constants";

const Layout = ({
  title,
  children,
  content,
  contentHeight = "66px",
  bannerTitle,
}: {
  title?: string;
  children?: React.ReactNode;
  content?: React.ReactNode;
  contentHeight?: string;
  bannerTitle?: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>
          {title
            ? `Ivy Oracle • ${CHAIN.toUpperCase()} | ${title}`
            : `Ivy Oracle • ${CHAIN.toUpperCase()}`}
        </title>
        <meta
          name="description"
          content="Ivy oracle FTSO data provider on Flare and Songbird"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Navbar transparent={true} />
      </header>

      <main className="grow">
        <div
          className="relative pt-16 pb-32 flex content-center items-center justify-center"
          style={{
            minHeight: contentHeight,
          }}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${backgroundImage.src})`,
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>

          <div className={classNames("container relative mx-auto")}>
            {bannerTitle ? (
              <div className="flex justify-center mt-10 text-center">
                <h1 className="text-white font-semibold text-5xl">
                  {bannerTitle}
                </h1>
              </div>
            ) : (
              content
            )}
          </div>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
          style={{ height: "70px" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-gray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
        <div className="relative">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
