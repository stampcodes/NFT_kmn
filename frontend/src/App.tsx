import { useAccount } from "wagmi";
import MintNFTButton from "./components/MintNFTButton";
import Navbar from "./components/Navbar";
import NFTList from "./components/NFTList";
import MintNFTExc from "./components/MintNFTExc";

function App() {
  const { address } = useAccount();

  return (
    <>
      <div>
        <Navbar />
        <MintNFTButton />
        {address ? (
          <NFTList ownerAddress={address} />
        ) : (
          <p className="text-center mt-10">
            Connect with your wallet to see your NFTs.
          </p>
        )}
        <MintNFTExc />
      </div>
    </>
  );
}

export default App;
