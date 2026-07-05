# Sominia UI

A modern, responsive React application for the Forgeforward protocol, providing an intuitive interface for token creation, locking, and airdrop distribution.

## 🎨 Project Overview

The Sominia UI is a comprehensive web application built with React, TypeScript, and modern web technologies. It provides users with a seamless experience for interacting with the Sominia smart contracts, including token factory operations, token locking, and airdrop management.

## 🏗️ Project Structure

```
ui/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   ├── ConnectButton.tsx   # Wallet connection component
│   │   ├── HeroSection.tsx     # Landing page hero section
│   │   ├── LockCertificateModal.tsx
│   │   ├── LockDetailsModal.tsx
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── TokenFactoryCard.tsx
│   │   ├── TokenManagementModal.tsx
│   │   ├── UserLockCard.tsx    # User lock display
│   │   ├── UserTokenCard.tsx   # User token display
│   │   └── Web3Status.tsx      # Web3 connection status
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAirdrop.ts       # Airdrop functionality
│   │   ├── useERC20Token.ts    # ERC20 token interactions
│   │   ├── useLock.ts          # Token locking logic
│   │   ├── useLockFactory.ts   # Lock factory interactions
│   │   └── useTokenFactory.ts  # Token factory interactions
│   ├── lib/                    # Utility libraries
│   │   ├── constants.ts        # Application constants
│   │   ├── useReadClient.ts    # GraphQL read client
│   │   ├── utils.ts            # General utilities
│   │   └── wagmi.ts            # Wagmi configuration
│   ├── pages/                  # Application pages
│   │   ├── Airdrop.tsx         # Airdrop management page
│   │   ├── Home.tsx            # Landing page
│   │   ├── Lock.tsx            # Token locking page
│   │   ├── LockDetails.tsx     # Lock details page
│   │   └── TokenFactory.tsx    # Token creation page
│   ├── abis/                   # Contract ABIs
│   │   ├── airdropDistributor.ts
│   │   ├── lockFactory.ts
│   │   ├── StandardToken.ts
│   │   ├── TokenFactory.json
│   │   └── TokenLock.ts
│   └── graphql/                # GraphQL configuration
│       ├── __generated__/      # Generated types and hooks
│       ├── queries.graphql     # GraphQL queries
│       └── schema.graphql      # GraphQL schema
├── public/                     # Static assets
└── package.json               # Dependencies and scripts
```

## 🚀 Features

### 🏭 Token Factory
- Create standard ERC20 tokens
- Create fee-based tokens with configurable transfer taxes
- Token metadata management
- Real-time token creation tracking

### 🔒 Token Locking
- Lock tokens for specified time periods
- Visual lock progress tracking
- Lock certificate generation
- Project image association
- Lock management dashboard

### 🎁 Airdrop Distribution
- Batch token distribution
- Recipient list management
- Distribution progress tracking
- Gas optimization for large airdrops

### 🔗 Web3 Integration
- Wallet connection (MetaMask, WalletConnect, etc.)
- Real-time blockchain data
- Transaction status tracking
- Multi-chain support

## 🛠️ Technology Stack

### Core Framework
- **React**: `^18.3.1` - UI framework
- **TypeScript**: `~5.6.2` - Type safety
- **Vite**: `^6.0.5` - Build tool and dev server

### Web3 & Blockchain
- **Wagmi**: `^2.16.9` - React hooks for Ethereum
- **Viem**: `^2.37.3` - TypeScript interface for Ethereum
- **RainbowKit**: `^2.2.8` - Wallet connection UI

### UI & Styling
- **Tailwind CSS**: `^4.1.13` - Utility-first CSS framework
- **Radix UI**: Various components for accessible UI primitives
- **Lucide React**: `^0.542.0` - Icon library
- **shadcn/ui**: Pre-built component library

### Data & State Management
- **Apollo Client**: `^3.14.0` - GraphQL client
- **TanStack Query**: `^5.87.1` - Server state management
- **React Router**: `^6.30.1` - Client-side routing

### Development Tools
- **ESLint**: `^9.17.0` - Code linting
- **GraphQL Code Generator**: `^6.0.0` - Type-safe GraphQL

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

Create a `.env` file in the root directory:

```env
# GraphQL endpoint
VITE_GRAPHQL_ENDPOINT=your_graphql_endpoint

# Contract addresses (if needed)
VITE_TOKEN_FACTORY_ADDRESS=your_token_factory_address
VITE_LOCK_FACTORY_ADDRESS=your_lock_factory_address
VITE_AIRDROP_DISTRIBUTOR_ADDRESS=your_airdrop_distributor_address
```

### Development

```bash
# Start development server
npm run dev

# Or using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build for production
npm run build

# Or using yarn
yarn build
```

### Code Generation

```bash
# Generate GraphQL types and hooks
npm run codegen

# Or using yarn
yarn codegen
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run codegen` - Generate GraphQL types

## 🔧 Configuration

### Vite Configuration
The project uses Vite with the following plugins:
- React plugin for JSX support
- Tailwind CSS plugin for styling
- Path aliases for clean imports (`@/` maps to `src/`)

### Wagmi Configuration
Configured for multi-chain support with:
- Ethereum mainnet
- Sepolia testnet
- Somnia testnet
- Local development networks

### GraphQL Configuration
- Apollo Client for data fetching
- Code generation for type safety
- Real-time subscriptions support

## 🎨 UI Components

### Design System
Built with a consistent design system using:
- **shadcn/ui** components for consistency
- **Tailwind CSS** for styling
- **Radix UI** primitives for accessibility
- **Lucide React** for icons

### Key Components
- **ConnectButton**: Wallet connection with multiple providers
- **TokenFactoryCard**: Token creation interface
- **UserTokenCard**: User token management
- **UserLockCard**: Lock status and management
- **LockDetailsModal**: Detailed lock information
- **Airdrop**: Batch distribution interface

## 🔗 Integration

### Smart Contracts
The UI integrates with the following smart contracts:
- **TokenFactory**: Token creation
- **LockFactory**: Token locking
- **AirdropDistributor**: Token distribution
- **TokenLock**: Individual lock management

### GraphQL API
Connects to the Envio indexer for:
- Real-time blockchain data
- Historical transaction data
- User activity tracking
- Platform statistics

## 🧪 Testing

```bash
# Run tests (when available)
npm test

# Run linting
npm run lint
```

## 🚀 Deployment

### Build Process
1. Run `npm run build` to create production build
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables for production

### Recommended Hosting
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 🔒 Security Considerations

- Environment variables for sensitive data
- Secure wallet connection handling
- Input validation and sanitization
- HTTPS enforcement in production

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
