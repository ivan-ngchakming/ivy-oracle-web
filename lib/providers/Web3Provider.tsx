import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import { RPC_ENDPOINT } from "../constants";

type Web3ContextValue = {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  web3?: ethers.providers.Web3Provider;
  jsonRpc?: ethers.providers.JsonRpcProvider;
};

const Web3Context = createContext<Web3ContextValue>(null as any);

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string>("");
  const [web3, setWeb3] = useState<ethers.providers.Web3Provider>();
  const [jsonRpc, setJsonRpc] = useState<ethers.providers.JsonRpcProvider>();

  useEffect(() => {
    if ((window as any).ethereum) {
      setWeb3(new ethers.providers.Web3Provider((window as any).ethereum));
    }
    setJsonRpc(new ethers.providers.JsonRpcProvider(RPC_ENDPOINT));
  }, []);

  const value = useMemo(
    () => ({
      address,
      setAddress,
      web3,
      jsonRpc,
    }),
    [address, jsonRpc, web3]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  return useContext(Web3Context);
};

export default Web3Provider;
