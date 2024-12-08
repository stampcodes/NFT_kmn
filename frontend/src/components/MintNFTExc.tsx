import React, { useState } from "react";
import useMintNFT from "../hooks/useMintNFT";

const MintNFTExc: React.FC = () => {
  const { handleMintNFT, hash, error, isPending, isConfirming, isConfirmed } =
    useMintNFT();
  const [quantity, setQuantity] = useState<number>(1);
  const INITIAL_PRICE_WEI = BigInt(50_000_000_000);
  const totalCost = INITIAL_PRICE_WEI * BigInt(quantity);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleMintNFT(BigInt(quantity), totalCost);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-8 space-y-4"
    >
      <div className="flex flex-col space-y-2">
        <label htmlFor="quantity" className="text-gray-700 font-semibold">
          Quantity:
        </label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          max={5} // Supponendo MAX_PER_TX = 5
          disabled={isPending || isConfirming}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <p className="text-gray-700 font-medium">
        Total Cost:{" "}
        <strong className="text-gray-900">
          {(Number(totalCost) / 1e18).toFixed(8)} ETH
        </strong>
      </p>
      <button
        type="submit"
        className="customButton items-center w-full"
        disabled={isPending || isConfirming}
      >
        {isPending ? "Minting..." : "Mint NFT of the second contract"}
      </button>
      {hash && (
        <p className="text-sm text-blue-600">
          Transaction Hash:{" "}
          <a
            href={`https://etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {hash}
          </a>
        </p>
      )}
      {error && <p className="text-sm text-red-500">Error: {error.message}</p>}
      {isConfirming && (
        <p className="text-sm text-yellow-500">Transaction Confirming...</p>
      )}
      {isConfirmed && (
        <p className="text-sm text-green-500">Mint Successful!</p>
      )}
    </form>
  );
};

export default MintNFTExc;
