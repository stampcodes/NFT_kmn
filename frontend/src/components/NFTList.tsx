import React, { useState, useEffect } from "react";
import NFTCard from "./NFTCard";
import { fetchMetadata } from "../utils/fetchMetadata";
import useGetNFTDetailsForOwner from "../hooks/getDetailsForOwner";

type NFTListProps = {
  ownerAddress: `0x${string}`;
};

type NFTData = {
  tokenId: string;
  name: string;
  description: string;
  image: string;
};

const NFTList: React.FC<NFTListProps> = ({ ownerAddress }) => {
  const { nftDetails, error, isPending } =
    useGetNFTDetailsForOwner(ownerAddress);
  const [nftData, setNftData] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("NFT Details updated:", nftDetails);
  }, [nftDetails]);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      if (!nftDetails || nftDetails.length === 0) {
        setNftData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const metadataPromises = nftDetails.map(async (nft) => {
          const metadata = await fetchMetadata(nft.uri);
          return {
            tokenId: nft.tokenId.toString(),
            name: metadata?.name || "N/A",
            description: metadata?.description || "No description",
            image:
              metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/") ||
              "",
          };
        });

        const results = await Promise.all(metadataPromises);
        setNftData(results);
      } catch (err) {
        console.error("Error during metadata fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    if (nftDetails) fetchNFTMetadata();
  }, [nftDetails]);

  if ((isPending && !nftData.length) || loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg animate-pulse">Loading NFTs...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 mb-10">
      {nftData.length > 0 ? (
        <div className="flex justify-center items-center">
          {nftData.map((nft) => (
            <NFTCard
              key={nft.tokenId}
              tokenId={nft.tokenId}
              name={nft.name}
              description={nft.description}
              image={nft.image}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">No NFTs found.</p>
        </div>
      )}
    </div>
  );
};

export default NFTList;
