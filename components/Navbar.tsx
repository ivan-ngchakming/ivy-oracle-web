import React, { useState } from "react";
import Link from "next/link";
import { useWeb3API } from "../lib/api";
import classNames from "classnames";
import { toast } from "react-toastify";
import { truncateEthAddress } from "../utils";
import { Route } from "../lib/constants/routes";
import { Chain, CHAIN } from "../lib/constants";
import Dropdown from "./Dropdown";

const MENU_ITEMS = [
  { path: Route.FTSODataProvider, label: "Providers", iconClass: "fa-compass" },
  { path: Route.Delegation, label: "Delegations", iconClass: "fa-user" },
];

if (CHAIN === Chain.Flare) {
  MENU_ITEMS.push({
    path: Route.Validator,
    label: "Validators",
    iconClass: "fa-check",
  });
}

function Navbar(props: { transparent: boolean }) {
  const { connect, disconnect, isConnected, address } = useWeb3API();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    if (!isConnected) {
      try {
        await connect();
        toast.success("Connected to wallet.", {
          toastId: "connected-to-wallet",
        });
      } catch (err) {
        toast.error("Failed to connect wallet.", {
          toastId: "failed-to-connect-to-wallet",
        });
      }
    } else {
      disconnect();
      toast.info("Disconnected from wallet.", {
        toastId: "disconnected-from-wallet",
      });
    }
    setIsConnecting(false);
  };

  return (
    <nav
      className={
        (props.transparent
          ? "top-0 absolute z-50 w-full"
          : "relative bg-white shadow-lg") +
        " flex flex-wrap items-center justify-between px-2 py-3 "
      }
    >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <div
            className={
              (props.transparent ? "text-white" : "text-gray-800") +
              " title-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            }
          >
            <Link href="/">Ivy Oracle</Link>
          </div>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i
              className={
                (props.transparent ? "text-white" : "text-gray-800") +
                " fas fa-bars"
              }
            ></i>
          </button>
        </div>
        <div
          className={
            "lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none" +
            (navbarOpen ? " block rounded shadow-lg" : " hidden")
          }
          id="example-navbar-warning"
        >
          <ul className="flex flex-col lg:flex-row list-none mr-auto">
            {MENU_ITEMS.map((menuItem) => (
              <li key={menuItem.path} className="flex items-center">
                <Link href={menuItem.path}>
                  <div
                    className={
                      (props.transparent
                        ? "lg:text-white lg:hover:text-gray-300 text-gray-800"
                        : "text-gray-800 hover:text-gray-600") +
                      " px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold hover:cursor-pointer w-full hover:bg-slate-100 sm:hover:bg-transparent"
                    }
                  >
                    <i
                      className={classNames(
                        props.transparent
                          ? "lg:text-gray-300 text-gray-500"
                          : "text-gray-500",
                        "fa text-lg leading-lg mr-2",
                        menuItem.iconClass
                      )}
                    />{" "}
                    {menuItem.label}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <ul>
            <li className="flex items-center">
              <Dropdown />
              {/* <button
                className={classNames(
                  props.transparent
                    ? "bg-white text-gray-800 active:bg-gray-100"
                    : "bg-pink-500 text-white active:bg-pink-600",
                  "text-xs font-bold uppercase px-4 py-2 rounded shadow-md hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 lg:m-0",
                  "disabled:bg-gray-400 w-full m-5",
                  "transition-all",
                  "min-w-[150px]"
                )}
                disabled={isConnecting}
                type="button"
                style={{ transition: "all .15s ease" }}
                onClick={handleConnectWallet}
              >
                <i className="fas fa-caret-square-o-right"></i>{" "}
                {isConnected ? truncateEthAddress(address) : "Connect Wallet"}
              </button> */}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
