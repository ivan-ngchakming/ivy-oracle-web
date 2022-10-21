import { useCallback, useMemo } from "react";
import { useWeb3 } from "../providers/Web3Provider";

const useWeb3API = () => {
  const { web3, setAddress, address } = useWeb3();

  const connect = useCallback(async () => {
    if (web3) {
      const accounts = await web3.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
    }
  }, [setAddress, web3]);

  const disconnect = useCallback(async () => {
    if (web3) {
      setAddress("");
    }
  }, [setAddress, web3]);

  const isConnected = useMemo(() => address !== "", [address]);

  return useMemo(
    () => ({
      address: address ?? "",
      isConnected,
      connect,
      disconnect,
    }),
    [address, connect, disconnect, isConnected]
  );
};

export default useWeb3API;
