import React from "react";

type NFTCardProps = {
  tokenId: string;
  name: string;
  description: string;
  image: string;
};

const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  name,
  description,
  image,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-xs mx-auto border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="h-64 bg-gray-100 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-auto h-full object-contain transition-transform duration-300 hover:scale-110 rounded-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {name || `Token ID: ${tokenId}`}
        </h3>
        <p className="text-sm text-gray-600 mt-2 truncate">
          {description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default NFTCard;
