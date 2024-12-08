import axios from "axios";

export const fetchMetadata = async (uri: string) => {
  try {
    const response = await axios.get(
      uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    );
    return response.data;
  } catch (error) {
    console.error(`Error in fetching metadata for URIs ${uri}:`, error);
    return null;
  }
};
