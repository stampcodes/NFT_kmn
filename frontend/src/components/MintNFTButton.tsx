import axios from "axios";

const MintNFTButton = () => {
  async function mintNFT() {
    const url = "http://localhost:3000/api/mint";

    try {
      const response = await axios.post(url, {});
      console.log("Mint result:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        alert(
          "Error during mint: " +
            (error.response?.data?.error || "Network error")
        );
      } else if (error instanceof Error) {
        console.error("Generic Error:", error.message);
        alert("Error during mint: " + error.message);
      } else {
        console.error("Unknown Error:", error);
        alert("Unknown error occurred during mint.");
      }
    }
  }
  return (
    <div className="mt-10 flex justify-center">
      <button className="customButton" onClick={mintNFT}>
        Mint NFT of the first contract
      </button>
    </div>
  );
};

export default MintNFTButton;
