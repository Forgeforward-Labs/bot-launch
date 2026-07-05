import TokenFactoryCard from '@/components/TokenFactoryCard';
import {
  useGetPlatformStatsQuery,
  useGetRecentTokensQuery,
  useGetUserTokensQuery,
} from '@/graphql/__generated__/types-and-hooks';
import { History, TrendingUp } from 'lucide-react';
import { useAccount } from 'wagmi';
import { UserTokenCard } from '@/components/UserTokenCard';

const TokenFactory = () => {
  const { data: recentTokens } = useGetRecentTokensQuery({
    pollInterval: 10000,
  });
  const { address } = useAccount();
  const { data: platformStats } = useGetPlatformStatsQuery({
    pollInterval: 10000,
  });

  const { data: userTokens } = useGetUserTokensQuery({
    variables: {
      owner: address as string,
    },
    skip: !address,
    pollInterval: 10000,
  });

  const userCreatedTokens = userTokens?.Tokens || [];

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                Token Factory
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Create custom tokens with advanced features, security controls,
              and automated deployment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Factory Form */}
            <div className="lg:col-span-2">
              <TokenFactoryCard />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistics */}
              <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Factory Stats
                  </h3>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tokens Created</span>
                  <span className="font-semibold text-emerald-400">
                    {(platformStats?.PlatformStats as any)?.[0]?.totalTokens ||
                      0}
                  </span>
                </div>
              </div>

              {/* Recent Tokens */}
              <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Recent Tokens
                  </h3>
                </div>
                <p className="text-zinc-500 text-sm mb-4">
                  Latest tokens created on the platform
                </p>
                <div className="space-y-3">
                  {recentTokens?.Tokens?.map((token, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-semibold text-sm text-white">
                            {token.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {token.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {Number(token.totalSupply) /
                            10 ** Number(token.decimalPlaces)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!recentTokens?.Tokens ||
                    recentTokens.Tokens.length === 0) && (
                    <p className="text-zinc-500 text-center py-4 text-sm">
                      No tokens created yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Created Tokens Grid Section */}
          {userCreatedTokens.length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Your Created Tokens
                </h2>
                <p className="text-zinc-400">
                  Manage and monitor all your created tokens
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCreatedTokens.map((token, index) => (
                  <UserTokenCard key={index} token={token} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TokenFactory;
