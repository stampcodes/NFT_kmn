# KMN NFT Project

## Overview

The KMN project is a comprehensive application for managing NFTs (Non-Fungible Tokens) on the Ethereum blockchain. It includes a backend for NFT management, a frontend for user interaction, and a Hardhat development environment for smart contract management.

## Features

- **NFT Minting**: Users can mint new NFTs through the frontend interface.
- **NFT Visualization**: Users can view their owned NFTs and their details.
- **Metadata Updates**: Blockchain events automatically update the NFT metadata.
- **Wallet Interaction**: Users can connect their Ethereum wallets to interact with the system.
- **Error Handling**: The system manages errors during minting and blockchain interactions, providing useful feedback to users.

## Smart Contract Addresses (Sepolia)

- **ExcKatametronNFT**: `0x309066Bdd05C29bC497f51ccB009D6F09D5d30fB`
- **KatametronNFT**: `0xb01CF4E40C6a2FB347977801981d0A3514956261`

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express**: Framework for building web applications.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **Axios**: Library for making HTTP requests.
- **Pinata**: Service for hosting files on IPFS (InterPlanetary File System).
- **dotenv**: For managing environment variables.

### Frontend

- **React**: Library for building user interfaces.
- **Wagmi**: Library for managing interactions with Ethereum.
- **Tailwind CSS**: CSS framework for interface design.
- **Axios**: For making HTTP requests.

### Hardhat

- **Hardhat**: Framework for developing smart contracts on Ethereum.
- **Solidity**: Programming language for smart contracts.

## How to Use

- Clone the repository:

```bash
git clone https://github.com/stampcodes/test_kmn.git
```

### Backend Setup

1. Navigate to the folder:

```bash
   cd backend-nodejs
```

2. Install the dependencies:

```bash
yarn
```

3. Create a `.env` file in the root of the backend project and add the following variables:

```plaintext
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address
CONTRACT_2_ADDRESS=your_second_contract_address
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
PREVIOUS_CID=your_previous_cid
PORT=3000
```

4. Start the development server:

```bash
yarn dev
```

### Frontend Setup

1. Navigate to the folder:

```bash
   cd frontend
```

2. Install the dependencies:

```bash
yarn
```

3. Create a `.env` file in the root of the frontend project and add the following variables:

```plaintext
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

4. Start the development server:

```bash
yarn dev
```

5. Open the app in your browser at http://localhost:5173/

### Hardhat Setup

1. Navigate to the folder:

```bash
   cd backend-hardhat
```

2. Install the dependencies:

```bash
yarn
```

3. Set up the .env file with your private key and the Sepolia network endpoint.

```plaintext
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
BASE_URI_CONTRACT_1=your_base_uri_contract_1
PARENT_NFT=your_parent_nft
BASE_URI_CONTRACT_2=your_base_uri_contract_2
```

4. Compile the contract:

```bash
yarn hardhat compile
```

5. Run tests to verify that everything works correctly:

```bash
yarn hardhat test
```

6. Deploy the contract on Sepolia using Ignition:

```bash
yarn hardhat ignition deploy ignition/modules/module_name.ts --network sepolia
```

## License

Distributed under the MIT License.

## Contact

Project created by Andrea Fragnelli.
