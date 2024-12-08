import { useReadContract } from "wagmi";
import { useMemo } from "react";
import contractAbi from "../abi/ExcKatametronNFT.json";

type NFTDetails = {
  tokenId: bigint;
  name: string;
  uri: string;
  owner: string;
  hasCustomName: boolean;
};

const useGetNFTDetailsForOwner = (ownerAddress: string | null) => {
  const {
    data: nftDetails,
    error,
    isFetching: isPending,
    refetch,
  } = useReadContract({
    address: "0x309066Bdd05C29bC497f51ccB009D6F09D5d30fB",
    abi: contractAbi.abi,
    functionName: "getDetailsForOwner",
    args: ownerAddress ? [ownerAddress] : undefined,
  });

  const parsedData = useMemo(() => {
    return nftDetails
      ? (nftDetails as NFTDetails[]).map((nft) => ({
          tokenId: nft.tokenId,
          name: nft.name,
          uri: nft.uri,
          owner: nft.owner,
          hasCustomName: nft.hasCustomName,
        }))
      : null;
  }, [nftDetails]);

  return {
    nftDetails: parsedData,
    error,
    isPending,
    refetch,
  };
};

export default useGetNFTDetailsForOwner;
