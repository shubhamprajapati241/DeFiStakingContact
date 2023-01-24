import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import StakingAbi from "../constants/Staking.json";
import TokenAbi from "../constants/RewardToken.json";

function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis();
  const [rtBalance, setRtBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [earnedBalance, setEarnedBalance] = useState("0");

  const stakingAddress = "0xD5D310c68DDbA09B0Cab0Ad7396cCe39761CFD3D";
  const rewardTokenAddress = "0x66B2b85D6430AD40dCC50B77a6b56317004d1d94";

  //  Getting the balance of user
  const { runContractFunction: getRTBalance } = useWeb3Contract({
    abi: TokenAbi.abi, // contact abi
    contractAddress: rewardTokenAddress, // contact Address
    functionName: "balanceOf", // contact function
    params: {
      account, // metamask account
    },
  });

  //  Getting the stacked balance
  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "getStaked",
    params: {
      account,
    },
  });

  //  Getting the earned balance
  const { runContractFunction: getEarnedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "earned",
    params: {
      account,
    },
  });

  useEffect(() => {
    async function updateUiValues() {
      // geting the Reward token and setting it
      const rtBalance = (
        await getRTBalance({ onError: (error) => console.log(error) })
      ).toString();

      // rtBalance will be in the wei to have to convert into ether
      const formattedRtBalance = parseFloat(rtBalance) / 1e18;
      const formattedRtBalaceRounded = formattedRtBalance.toFixed(2);
      setRtBalance(formattedRtBalaceRounded);

      // geting the staked token and setting it
      const stakedBalace = (
        await getStakedBalance({ onError: (error) => console.log(error) })
      ).toString();
      const formattedStakedBalance = parseFloat(stakedBalace) / 1e18;
      const formattedStakedBalanceRounded = formattedStakedBalance.toFixed(2);
      setStakedBalance(formattedStakedBalanceRounded);

      // geting the earnedBalance and setting it
      const earnedBalance = (
        await getEarnedBalance({ onError: (error) => console.log(error) })
      ).toString();
      const formattedEarnedBalance = parseFloat(earnedBalance) / 1e18;
      const formattedEarnedBalanceRounded = formattedEarnedBalance.toFixed(18);
      console.log(
        "formattedEarnedBalanceRounded : " + formattedEarnedBalanceRounded
      );
      setEarnedBalance(earnedBalance);
    }

    // isWeb3enable or metamask is connected then set these values
    if (isWeb3Enabled) updateUiValues();
  }, [
    account,
    getEarnedBalance,
    getRTBalance,
    getStakedBalance,
    isWeb3Enabled,
  ]);
  return (
    <div>
      <div className="p-3">
        <div className="font-bold m-2">
          Reward Token Balance is: {rtBalance}
        </div>
        <div className="font-bold m-2">Earned Balance is: {earnedBalance}</div>
        <div className="font-bold m-2">Staked Balance is: {stakedBalance}</div>
      </div>
    </div>
  );
}

export default StakeDetails;
