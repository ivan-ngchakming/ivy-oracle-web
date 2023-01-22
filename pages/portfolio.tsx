import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import Layout from "../components/Layout";
import { useWeb3API } from "../lib/api";
import { useERC20API } from "../lib/api/ContractAPI";
import { useWeb3 } from "../lib/providers/Web3Provider";
import { minimalTokenToTokenBigNumber } from "../utils";

const ftsoRewardManagerABI = [
  "function getStateOfRewards(address _beneficiary, uint256 _rewardEpoch) external view returns (address[] memory _dataProviders, uint256[] memory _rewardAmounts, bool[] memory _claimed, bool _claimable)",
];

const PortfolioPage = () => {
  const { web3 } = useWeb3();
  const { address } = useWeb3API();
  const { getBalance: getWNatBalance } = useERC20API(
    "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED"
  );

  const [balance, setBalance] = useState<BigNumber>(new BigNumber(0));
  const [wNat, setWNat] = useState<BigNumber>(new BigNumber(0));
  const [reward, setReward] = useState<BigNumber>(new BigNumber(0));

  const fetchBalances = useCallback(async () => {
    if (!address) {
      return;
    }
    const _balance = await web3?.getBalance(address);
    if (_balance) {
      setBalance(
        minimalTokenToTokenBigNumber(new BigNumber(_balance.toString()))
      );
    }

    setWNat(await getWNatBalance(address));

    const ftsoRewardManager = new ethers.Contract(
      "0xc5738334b972745067fFa666040fdeADc66Cb925",
      ftsoRewardManagerABI,
      web3
    );
    const _reward = await ftsoRewardManager.functions.getStateOfRewards(
      address,
      57
    );
    setReward(minimalTokenToTokenBigNumber(_reward._rewardAmounts[0]));
  }, [address, getWNatBalance, web3]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return (
    <Layout title="Portfolio" bannerTitle="Portfolio">
      <div className="m-5 lg:m-28 mb-40">
        <Button onClick={fetchBalances}>Fetch</Button>
        <div className="mt-2">
          <p>Balance: {balance.toNumber().toLocaleString()}</p>
          <p>WNat: {wNat.toNumber().toLocaleString()}</p>
          <p>Rewards: {reward.toNumber().toLocaleString()}</p>
          <p>
            Total:{" "}
            {balance
              .plus(new BigNumber(wNat.toString()))
              .plus(reward)
              .toNumber()
              .toLocaleString()}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioPage;
