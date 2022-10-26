import { Contract, ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import erc20ABI from "../../abis/erc20";
import { minimalTokenToTokenBigNumber } from "../../utils";
import { useWeb3 } from "../providers/Web3Provider";

export const useERC20API = (address: string) => {
  const { web3 } = useWeb3();
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    const _contract = new ethers.Contract(address, erc20ABI, web3);
    setContract(_contract);
  }, [address, web3]);

  const getBalance = useCallback(
    async (address: string) => {
      if (!contract) {
        throw new Error(`ERC20 contract at ${address} not initialized`);
      }
      const wNatBalance = await contract.functions.balanceOf(address);
      return minimalTokenToTokenBigNumber(wNatBalance[0]);
    },
    [contract]
  );

  return useMemo(
    () => ({
      contract,
      getBalance,
    }),
    [contract, getBalance]
  );
};

const useContractAPI = () => {
  return useMemo(() => ({}), []);
};

export default useContractAPI;
