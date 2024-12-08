import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contractAbi from "../abi/ExcKatametronNFT.json";

const useMintNFT = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function handleMintNFT(quantity: bigint, value: bigint) {
    writeContract({
      address: "0x309066Bdd05C29bC497f51ccB009D6F09D5d30fB",
      abi: contractAbi.abi,
      functionName: "mint",
      args: [quantity],
      value: value,
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    handleMintNFT,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
};

export default useMintNFT;
