import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useWeb3 } from "../providers/Web3Provider";
import { getLoginMessageToSign } from "../queries/auth";
import Cookies from "js-cookie";

const useWeb3API = () => {
  const { web3, setAddress, address } = useWeb3();

  const isConnected = useMemo(() => address !== "", [address]);

  const connect = useCallback(async (): Promise<string | undefined> => {
    if (web3) {
      const accounts = await web3.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      return accounts[0];
    }
  }, [setAddress, web3]);

  const disconnect = useCallback(async () => {
    if (web3) {
      setAddress("");
    }
  }, [setAddress, web3]);

  const getAddress = useCallback(async () => {
    if (!address) {
      return connect();
    }
    return address;
  }, [address, connect]);

  const signMessage = useCallback(
    async (message: string) => {
      try {
        const signedMessage = await web3?.getSigner().signMessage(message);
        return signedMessage;
      } catch (error) {
        toast.error("Signing was rejected");
      }
      return null;
    },
    [web3]
  );

  const login = useCallback(async () => {
    const address = await getAddress();
    if (address) {
      const message = await getLoginMessageToSign(address);
      const signedMessage = await signMessage(message);
      if (signedMessage) {
        Cookies.set("ivy-auth-address", address);
        Cookies.set("ivy-auth-signature", signedMessage);
      }
    }
  }, [getAddress, signMessage]);

  return useMemo(
    () => ({
      address: address ?? "",
      isConnected,
      connect,
      disconnect,
      getAddress,
      login,
    }),
    [address, connect, disconnect, getAddress, isConnected, login]
  );
};

export default useWeb3API;
