import React from "react";
import { useWeb3Contract } from "react-moralis";
import StakingAbi from "../constants/Staking.json";
import TokenAbi from "../constants/RewardToken.json";
import { Button, Form } from "web3uikit";
import { ethers } from "ethers";

function StakeForm() {
  const stakingAddress = "0xD5D310c68DDbA09B0Cab0Ad7396cCe39761CFD3D";
  const tesTokenAddress = "0x66B2b85D6430AD40dCC50B77a6b56317004d1d94";

  const { runContractFunction } = useWeb3Contract();

  let approveOptions = {
    abi: TokenAbi.abi,
    contractAddress: tesTokenAddress,
    functionName: "approve",
  };

  let stakeOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "stake",
  };

  //  Handing Stake form
  async function handleStakeSubmit(data) {
    const amountToApprove = data.data[0].inputResult;
    // adding parameters into approveOptions
    approveOptions.params = {
      amount: ethers.utils.parseEther(amountToApprove, "ether"),
      spender: stakingAddress, // user approving the SC to transfer
    };

    console.log(approveOptions);

    const tx = await runContractFunction({
      params: approveOptions,
      onError: (error) => console.log(error), // error loging
      onSuccess: () => {
        handleApproveSuccess(approveOptions.params.amount);
      },
    });
  }

  async function handleApproveSuccess(amountToStakeFormatted) {
    stakeOptions.params = {
      amount: amountToStakeFormatted,
    };

    const tx = await runContractFunction({
      params: stakeOptions,
      onError: (error) => console.log(error),
    });

    await tx.wait();
    console.log("Stake transaction complete");
  }

  let withdrawOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "withdraw",
  };

  async function handleWithdrawSubmit(data) {
    let withdrawAmount = data.data[0].inputResult;
    withdrawAmount = ethers.utils.parseEther(withdrawAmount, "ether");
    withdrawOptions.params = {
      amount: withdrawAmount,
    };

    console.log(withdrawOptions);

    const tx = await runContractFunction({
      params: withdrawOptions,
      onError: (error) => console.log(error),
    });

    await tx.wait();
    console.log("Withdraw transaction completed");
  }

  let claimedOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "claimReward",
  };

  async function handleClaimedReward() {
    const tx = await runContractFunction({
      params: claimedOptions,
      onError: (error) => console.log(error),
    });

    await tx.wait();
    console.log("Claimed Reward transaction completed");
  }

  return (
    <>
      <div className="mb-3">
        <Button
          color="green"
          onClick={handleClaimedReward}
          text="Claim the Rewards"
          theme="colored"
        />
      </div>

      <div className="flex flex-wrap">
        <div className="text-black  w-1/3">
          <Form
            onSubmit={handleStakeSubmit}
            data={[
              {
                inputWidth: "50%",
                name: "Amount to stake ",
                type: "number",
                value: "",
                key: "amountToStake",
              },
            ]}
            title="Stake Now!"
          ></Form>
        </div>

        <div className="ml-10 w-1/3">
          <Form
            onSubmit={handleWithdrawSubmit}
            data={[
              {
                inputWidth: "50%",
                name: "Amount to withdraw ",
                type: "number",
                value: "",
                key: "amountToWithdraw",
              },
            ]}
            title="Withdraw Now!"
          ></Form>
        </div>
      </div>
    </>
  );
}

export default StakeForm;
