# Sominia Smart Contracts

This directory contains the smart contracts for the Forgeforward protocol, a comprehensive platform that provides token creation, locking, and airdrop distribution services.

## 🏗️ Project Structure

```
smart-contracts/
├── contracts/                    # Solidity smart contracts
│   ├── Airdrop/                 # Airdrop distribution contracts
│   │   └── Distributor.sol      # Main airdrop distributor contract
│   ├── lockFactory/             # Token locking system
│   │   ├── Factory.sol          # Factory for creating token locks
│   │   └── TokenLock.sol        # Individual token lock contract
│   └── tokenFactory/            # Token creation system
│       ├── Factory.sol          # Factory for creating tokens
│       └── tokens/              # Token implementations
│           ├── FeeToken.sol     # Token with transfer fees
│           └── Standard.sol     # Standard ERC20 token
├── ignition/                    # Hardhat Ignition deployment modules
│   └── modules/                 # Deployment scripts
│       ├── AirdropDistributor.ts
│       ├── LockFactory.ts
│       ├── TokenFactory.ts
│       └── Counter.ts
├── scripts/                     # Utility scripts
├── test/                        # Test files
└── hardhat.config.ts           # Hardhat configuration
```

## 🚀 Features

### Token Factory
- **Standard Tokens**: Create basic ERC20 tokens with customizable parameters
- **Fee Tokens**: Create tokens with configurable transfer fees
- **Factory Pattern**: Efficient deployment of multiple token instances

### Lock Factory
- **Token Locking**: Lock tokens for specified time periods
- **Project Integration**: Associate locks with project metadata and images
- **Flexible Locking**: Support for various lock durations and amounts

### Airdrop System
- **Batch Distribution**: Efficiently distribute tokens to multiple recipients
- **Gas Optimization**: Optimized for large-scale airdrop operations

## 🛠️ Technology Stack

- **Solidity**: `^0.8.28`
- **Hardhat**: `^3.0.4` - Development framework
- **OpenZeppelin**: `^5.4.0` - Security-focused contract library
- **Viem**: `^2.37.3` - TypeScript interface for Ethereum
- **Hardhat Ignition**: `^3.0.2` - Deployment management

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Sepolia Testnet
SEPOLIA_RPC_URL=your_sepolia_rpc_url
SEPOLIA_PRIVATE_KEY=your_private_key

# Somnia Testnet
SOMNIA_TESTNET_RPC_URL=your_somnia_testnet_rpc_url
SOMNIA_TESTNET_PRIVATE_KEY=your_private_key
```

### Compilation

```bash
# Compile contracts
npx hardhat compile
```

### Testing

```bash
# Run all tests
npx hardhat test

# Run Solidity tests only
npx hardhat test solidity

# Run TypeScript tests only
npx hardhat test nodejs
```

## 🚀 Deployment

### Local Development

```bash
# Deploy to local Hardhat network
npx hardhat ignition deploy ignition/modules/TokenFactory.ts
npx hardhat ignition deploy ignition/modules/LockFactory.ts
npx hardhat ignition deploy ignition/modules/AirdropDistributor.ts
```

### Testnet Deployment

#### Sepolia Testnet

```bash
# Set up private key (first time only)
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

# Deploy to Sepolia
npx hardhat ignition deploy --network sepolia ignition/modules/TokenFactory.ts
npx hardhat ignition deploy --network sepolia ignition/modules/LockFactory.ts
npx hardhat ignition deploy --network sepolia ignition/modules/AirdropDistributor.ts
```

#### Somnia Testnet

```bash
# Deploy to Somnia Testnet
npx hardhat ignition deploy --network somniaTestnet ignition/modules/TokenFactory.ts
npx hardhat ignition deploy --network somniaTestnet ignition/modules/LockFactory.ts
npx hardhat ignition deploy --network somniaTestnet ignition/modules/AirdropDistributor.ts
```

## 🔧 Configuration

The project supports multiple networks:

- **hardhatMainnet**: Local simulation of L1 mainnet
- **hardhatOp**: Local simulation of Optimism
- **sepolia**: Sepolia testnet
- **somniaTestnet**: Somnia testnet

## 📝 Contract Details

### TokenFactory
- **Address**: Deployed via Ignition modules
- **Events**: 
  - `FeeTokenCreated`: Emitted when a fee token is created
  - `StandardTokenCreated`: Emitted when a standard token is created

### LockFactory
- **Address**: Deployed via Ignition modules
- **Events**:
  - `LockCreated`: Emitted when a token lock is created

### AirdropDistributor
- **Address**: Deployed via Ignition modules
- **Features**: Batch token distribution with gas optimization

## 🧪 Testing

The project includes comprehensive tests covering:

- Contract deployment and initialization
- Token creation (both standard and fee tokens)
- Token locking functionality
- Airdrop distribution
- Access control and permissions
- Edge cases and error handling

## 🔒 Security

- Uses OpenZeppelin's audited contracts
- Implements proper access controls
- Follows Solidity best practices
- Comprehensive test coverage

## 📚 Documentation

For detailed contract documentation, refer to:

- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Viem Documentation](https://viem.sh/)

