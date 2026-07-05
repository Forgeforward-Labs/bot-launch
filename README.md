# Sominia Indexer

A HyperIndex-powered blockchain indexer for the Forgeforward protocol, providing real-time indexing and GraphQL API access to token factory, lock factory, and airdrop distribution events.

## 🚀 Project Overview

The Sominia Indexer is built using [Envio's HyperIndex](https://docs.envio.dev/docs/HyperIndex-LLM/hyperindex-complete), a high-performance blockchain indexing solution. It monitors and indexes events from the Sominia smart contracts, providing a GraphQL API for efficient data querying and real-time updates.

## 🏗️ Project Structure

```
indexer/
├── src/
│   └── EventHandlers.ts        # Event processing logic
├── abis/                       # Contract ABIs
│   ├── LockFactory.json        # Lock factory contract ABI
│   └── TokenFactory.json       # Token factory contract ABI
├── generated/                  # Auto-generated files
├── test/                       # Test files
├── config.yaml                 # Indexer configuration
├── schema.graphql              # GraphQL schema definition
└── package.json               # Dependencies and scripts
```

## 🎯 Indexed Contracts

### TokenFactory Contract
- **Address**: `0x2284Cff73d2384fDF91E84060d40A41581E642Ac`
- **Network**: Somnia Testnet (Chain ID: 50312)
- **Events**:
  - `FeeTokenCreated`: Tracks creation of fee-based tokens
  - `StandardTokenCreated`: Tracks creation of standard ERC20 tokens

### LockFactory Contract
- **Address**: `0xbB94C147309e5af3Db8B8fdA7dC61a9C1a0e398f`
- **Network**: Somnia Testnet (Chain ID: 50312)
- **Events**:
  - `LockCreated`: Tracks creation of token locks

## 📊 Data Schema

### Token Entities
```graphql
type Tokens {
  id: ID!
  token: String!           # Token contract address
  name: String!            # Token name
  symbol: String!          # Token symbol
  totalSupply: BigInt!     # Total token supply
  decimalPlaces: BigInt!   # Token decimals
  owner: String!           # Token owner address
  tokenType: TokenType!    # FEE or STANDARD
  createdAt: BigInt!       # Creation timestamp
  fee: BigInt              # Fee amount (for fee tokens)
  transferTax: BigInt      # Transfer tax percentage
}

enum TokenType {
  FEE
  STANDARD
}
```

### Lock Entities
```graphql
type Lock {
  id: ID!
  token: String!           # Locked token address
  owner: String!           # Lock owner address
  lockingAmount: BigInt!   # Amount locked
  lockTimeEnd: BigInt!     # Lock end timestamp
  projectImageUrl: String! # Project image URL
  createdAt: BigInt!       # Lock creation timestamp
  lockAddress: String!     # Lock contract address
}
```

### Platform Statistics
```graphql
type PlatformStats {
  id: ID!                  # Always "1" for global stats
  totalTokens: BigInt      # Total tokens created
  totalTokenLockers: BigInt # Total token lockers
  totalLPLockers: BigInt   # Total LP lockers
  totalSales: BigInt       # Total sales volume
}
```

## 🛠️ Technology Stack

- **Envio HyperIndex**: `2.28.0` - Blockchain indexing engine
- **Node.js**: `>=18.0.0` - Runtime environment
- **TypeScript**: `5.2.2` - Type safety
- **GraphQL**: Schema-based API
- **pnpm**: Package manager

## 📋 Prerequisites

- **Node.js v20** (exactly v20, no higher or lower versions)
- **pnpm** (v8 or newer)
- **Docker Desktop** (for local development)

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the indexer in development mode
pnpm dev
```

The GraphQL Playground will be available at `http://localhost:8080`
- **Password**: `testing`

### Code Generation

After modifying `schema.graphql` or `config.yaml`:

```bash
# Generate TypeScript types and handlers
pnpm codegen
```

### Type Checking

After modifying TypeScript files:

```bash
# Check TypeScript compilation
pnpm tsc --noEmit
```

### Testing

```bash
# Run tests
pnpm test
```

## 🔧 Configuration

### Network Configuration
- **Network**: Somnia Testnet
- **Chain ID**: 50312
- **RPC URL**: `https://dream-rpc.somnia.network/`
- **Start Block**: 179115894

### Indexer Features
- **Unordered Multichain Mode**: Enabled for flexible event processing
- **Preload Handlers**: Enabled for optimization
- **Real-time Indexing**: Continuous blockchain monitoring

## 📝 Event Handlers

The indexer processes the following events:

### TokenFactory Events
```typescript
// FeeTokenCreated event
FeeTokenCreated(address token, string name, string symbol, uint256 totalSupply, uint8 decimalPlaces, uint8 transferTax, address owner)

// StandardTokenCreated event
StandardTokenCreated(address token, string name, string symbol, uint256 totalSupply, uint8 decimalPlaces, address owner)
```

### LockFactory Events
```typescript
// LockCreated event
LockCreated(address indexed lock, address indexed token, address indexed owner, uint256 lockingAmount, uint256 lockTimeEnd, string projectImageUrl)
```

## 🔍 GraphQL Queries

### Get All Tokens
```graphql
query GetAllTokens {
  tokens {
    id
    token
    name
    symbol
    totalSupply
    decimalPlaces
    owner
    tokenType
    createdAt
    fee
    transferTax
  }
}
```

### Get User Locks
```graphql
query GetUserLocks($owner: String!) {
  locks(where: { owner: $owner }) {
    id
    token
    owner
    lockingAmount
    lockTimeEnd
    projectImageUrl
    createdAt
    lockAddress
  }
}
```

### Get Platform Statistics
```graphql
query GetPlatformStats {
  platformStats(id: "1") {
    id
    totalTokens
    totalTokenLockers
    totalLPLockers
    totalSales
  }
}
```

## 🚀 Deployment

### Local Development
```bash
# Start with TUI disabled for CI/CD
TUI_OFF=true pnpm dev
```

### Production Deployment
```bash
# Build the indexer
pnpm build

# Start in production mode
pnpm start
```

## 🔧 Development Guidelines

### Code Generation Rules
1. **Always run `pnpm codegen`** after modifying `schema.graphql` or `config.yaml`
2. **Always run `pnpm tsc --noEmit`** after modifying TypeScript files
3. **Use `TUI_OFF=true pnpm dev`** for CI/CD environments

### Entity Updates
When updating existing entities, always use the spread operator:

```typescript
let token = await context.Tokens.get(tokenId);

if (token) {
  const updatedToken: Tokens = {
    ...token,
    totalSupply: newTotalSupply,
    updatedAt: BigInt(Date.now()),
  };

  context.Tokens.set(updatedToken);
}
```

### External API Calls
For external API calls, use the Effect API:

```typescript
import { S, experimental_createEffect } from "envio";

export const getTokenMetadata = experimental_createEffect(
  {
    name: "getTokenMetadata",
    input: {
      tokenAddress: S.string,
      blockNumber: S.number,
    },
    output: S.union([S.string, null]),
  },
  async ({ input, context }) => {
    const metadata = await fetch(
      `https://api.example.com/metadata?address=${input.tokenAddress}&block=${input.blockNumber}`
    );
    return metadata.json();
  }
);
```

## 📊 Performance Optimization

- **Preload Handlers**: Enabled for faster processing
- **Unordered Multichain Mode**: Flexible event processing
- **Efficient Queries**: Optimized GraphQL schema
- **Real-time Updates**: Live blockchain monitoring

## 🔒 Security Considerations

- **Input Validation**: All inputs are validated
- **Type Safety**: Full TypeScript coverage
- **Access Control**: Secure API endpoints
- **Data Integrity**: Immutable entity updates

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm mocha test/specific-test.ts
```

## 📚 Documentation

- [Envio HyperIndex Documentation](https://docs.envio.dev/docs/HyperIndex-LLM/hyperindex-complete)
- [Example Indexers](https://github.com/enviodev/uniswap-v4-indexer)
- [GraphQL Schema Reference](https://graphql.org/learn/)

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the [Envio documentation](https://docs.envio.dev)
- Join the Envio community

---

**Note**: This indexer is configured for Somnia Testnet. Update the configuration for production deployment.