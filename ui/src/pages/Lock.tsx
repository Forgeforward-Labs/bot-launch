import { useState } from "react";
import {
  Lock as LockIcon,
  Shield,
  Clock,
  TrendingUp,
  Search,
  Coins,
  Zap,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { convertTimestampToDate } from "@/lib/utils";
import { useAccount, useBalance } from "wagmi";
import useLockFactory from "@/hooks/useLockFactory";
import { zeroAddress } from "viem";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useERC20Token } from "@/hooks/useERC20Token";
import {
  useGetPlatformStatsQuery,
  useGetUserLocksQuery,
} from "@/graphql/__generated__/types-and-hooks";
import { UserLockCard } from "@/components/UserLockCard";

const Lock = () => {
  const [activeTab, setActiveTab] = useState<"lock" | "search">("lock");
  const [lockType, setLockType] = useState("token");
  const [tokenType, setTokenType] = useState("contract");
  const [tokenCategory] = useState("standard");
  const [tokenAddress, setTokenAddress] = useState("");
  const [lockAmount, setLockAmount] = useState("");
  const [sliderValue, setSliderValue] = useState([0]);
  const [lockDuration, setLockDuration] = useState("");
  const [customUnlockDate, setCustomUnlockDate] = useState<string>("");
  const [searchAddress, setSearchAddress] = useState("");
  const [enableVesting, setEnableVesting] = useState(false);
  const [vestingStart, setVestingStart] = useState("");
  const [vestingCliff, setVestingCliff] = useState("");
  const [vestingPeriod, setVestingPeriod] = useState("");

  const { createLock } = useLockFactory();
  const { address } = useAccount();
  const { getTokenDetails } = useERC20Token(tokenAddress);

  const { data: tokenDetails } = useQuery({
    queryKey: ["tokenDetails", tokenAddress],
    queryFn: () => getTokenDetails(),
  });

  const { data: platformStats } = useGetPlatformStatsQuery();

  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
    token:
      tokenType === "native" ? undefined : (tokenAddress as `0x${string}`),
  });

  const balance = balanceData?.formatted || "0";
  const symbol = balanceData?.symbol || "BOT";

  const lockToken = async () => {
    if (
      (tokenType === "contract" && !tokenAddress) ||
      !lockAmount ||
      !lockDuration
    ) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields",
      });
      return;
    }

    let lockEndTime = 0;
    const nowSecs = Math.floor(Date.now() / 1000);

    switch (lockDuration) {
      case "30":
        lockEndTime = nowSecs + 30 * 24 * 60 * 60;
        break;
      case "90":
        lockEndTime = nowSecs + 90 * 24 * 60 * 60;
        break;
      case "180":
        lockEndTime = nowSecs + 180 * 24 * 60 * 60;
        break;
      case "365":
        lockEndTime = nowSecs + 365 * 24 * 60 * 60;
        break;
      case "730":
        lockEndTime = nowSecs + 730 * 24 * 60 * 60;
        break;
      case "custom":
        lockEndTime = Math.floor(new Date(customUnlockDate).getTime() / 1000);
    }

    const receipt = await createLock({
      token: tokenType === "native" ? zeroAddress : tokenAddress,
      amount: Number(lockAmount),
      lockTimeEnd: lockEndTime,
      decimals:
        tokenType === "native" ? 18 : (tokenDetails?.decimals as number),
      isLpLock: lockType === "lp",
    });

    console.log("receipt", receipt);
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const amount = ((parseFloat(balance) * value[0]) / 100).toFixed();
    setLockAmount(amount);
  };

  const handleAmountChange = (value: string) => {
    setLockAmount(value);
    if (value && balance) {
      const percentage = (parseFloat(value) / parseFloat(balance)) * 100;
      setSliderValue([Math.min(100, Math.max(0, percentage))]);
    }
  };

  const { mutate: handleLockToken, isPending: isLocking } = useMutation({
    mutationFn: lockToken,
    onSuccess: () => {
      refetchBalance();
    },
  });

  const lockButtonDisabled =
    isLocking ||
    (tokenType === "contract" && !tokenAddress) ||
    !lockAmount ||
    !lockDuration;

  const { data: userLocks } = useGetUserLocksQuery({
    variables: {
      owner: address as `0x${string}`,
    },
    skip: !address,
    pollInterval: 1000,
  });

  const activeLocks = (userLocks?.Lock as any)?.map((lock: any) => ({
    ...lock,
    lockDate: convertTimestampToDate(Number(lock.createdAt)),
    unlockDate: convertTimestampToDate(Number(lock.lockTimeEnd)),
    amount: Number(lock.lockingAmount) / 10 ** Number(tokenDetails?.decimals),
  }));

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl">
              <LockIcon className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Token & LP Lock
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Secure your tokens and liquidity with time-locked smart contracts.
            Build trust and prevent rug pulls.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-zinc-800/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("lock")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "lock"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Create Lock
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "search"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Search Locks
            </button>
          </div>
        </div>

        {activeTab === "lock" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lock Creation Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Lock Your Assets
                  </h2>
                </div>
                <p className="text-zinc-500 text-sm mb-6">
                  Create a time-locked vault for your tokens or LP tokens
                </p>

                <div className="space-y-6">
                  {/* Lock Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">
                      Lock Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLockType("token")}
                        className={`flex items-center justify-start gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          lockType === "token"
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600"
                        }`}
                      >
                        <Coins className="h-4 w-4" />
                        Token Lock
                      </button>
                      <button
                        type="button"
                        onClick={() => setLockType("lp")}
                        className={`flex items-center justify-start gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          lockType === "lp"
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600"
                        }`}
                      >
                        <Zap className="h-4 w-4" />
                        LP Lock
                      </button>
                    </div>
                  </div>

                  {/* Token Type */}
                  {lockType === "token" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Token Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTokenType("native")}
                          className={`flex items-center justify-start gap-2 px-4 py-3 rounded-lg border transition-colors ${
                            tokenType === "native"
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                              : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600"
                          }`}
                        >
                          <Coins className="h-4 w-4" />
                          Native Token
                        </button>
                        <button
                          type="button"
                          onClick={() => setTokenType("contract")}
                          className={`flex items-center justify-start gap-2 px-4 py-3 rounded-lg border transition-colors ${
                            tokenType === "contract"
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                              : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600"
                          }`}
                        >
                          <Zap className="h-4 w-4" />
                          Token CA
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Token Address */}
                  {((lockType === "token" && tokenType === "contract") ||
                    lockType === "lp") && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        {lockType === "token" ? "Token" : "LP"} Contract Address
                      </label>
                      <input
                        type="text"
                        placeholder="0x..."
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-zinc-600"
                      />
                    </div>
                  )}

                  {/* Vesting Toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEnableVesting(!enableVesting)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        enableVesting ? "bg-emerald-500" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enableVesting ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <label className="text-sm font-medium text-zinc-300">
                      Enable Vesting Schedule
                    </label>
                  </div>

                  {/* Vesting Config */}
                  {enableVesting && (
                    <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                        <Calendar className="h-4 w-4 text-emerald-400" />
                        Vesting Configuration
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-300">
                            Vesting Start Date
                          </label>
                          <input
                            type="date"
                            value={vestingStart}
                            onChange={(e) => setVestingStart(e.target.value)}
                            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-300">
                            Cliff Period (days)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 90"
                            value={vestingCliff}
                            onChange={(e) => setVestingCliff(e.target.value)}
                            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-zinc-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-300">
                            Vesting Period (days)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 365"
                            value={vestingPeriod}
                            onChange={(e) => setVestingPeriod(e.target.value)}
                            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-zinc-600"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        Tokens will be gradually released over the vesting
                        period after the cliff
                      </p>
                    </div>
                  )}

                  {/* Amount and Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Amount to Lock
                      </label>
                      <input
                        type="text"
                        placeholder="0.00"
                        value={lockAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-zinc-600"
                      />
                      {(tokenType === "native" && balance && symbol) ||
                      (tokenType === "contract" &&
                        balance &&
                        symbol !== "BOT") ? (
                        <div className="space-y-3 mt-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">
                              Balance: {balance}
                            </span>
                            <span className="text-zinc-500">
                              {sliderValue[0].toFixed(1)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={sliderValue[0]}
                            onChange={(e) =>
                              handleSliderChange([parseFloat(e.target.value)])
                            }
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                          <div className="flex gap-2">
                            {[25, 50, 75, 100].map((pct) => (
                              <button
                                key={pct}
                                onClick={() => handleSliderChange([pct])}
                                className="flex-1 text-xs py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                              >
                                {pct === 100 ? "MAX" : `${pct}%`}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-zinc-500 text-sm mt-2">
                          No balance found
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Lock Duration
                      </label>
                      <select
                        value={lockDuration}
                        onChange={(e) => setLockDuration(e.target.value)}
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="">Select duration</option>
                        <option value="30">30 Days</option>
                        <option value="90">90 Days</option>
                        <option value="180">6 Months</option>
                        <option value="365">1 Year</option>
                        <option value="730">2 Years</option>
                        <option value="custom">Custom Date</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Date */}
                  {lockDuration === "custom" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Custom Unlock Date
                      </label>
                      <input
                        type="datetime-local"
                        value={customUnlockDate}
                        onChange={(e) => setCustomUnlockDate(e.target.value)}
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                      <p className="text-xs text-zinc-500">
                        Select a future date when tokens will be unlocked
                      </p>
                    </div>
                  )}

                  {/* Lock Summary */}
                  <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                    <h4 className="font-semibold mb-2 text-white">
                      Lock Summary
                    </h4>
                    <div className="space-y-1 text-sm text-zinc-500">
                      <p>
                        • Lock type:{" "}
                        {lockType === "token" ? "Token" : "LP Token"}
                      </p>
                      {lockType === "token" && tokenType === "contract" && (
                        <p>• Token category: {tokenCategory}</p>
                      )}
                      {lockType === "token" && (
                        <p>
                          • Token type:{" "}
                          {tokenType === "native"
                            ? "Native Token"
                            : "Contract Address"}
                        </p>
                      )}
                      <p>
                        • Unlock date:{" "}
                        {lockDuration === "custom"
                          ? customUnlockDate
                            ? format(customUnlockDate, "PPP")
                            : "Custom date not selected"
                          : lockDuration
                          ? `${lockDuration} days from now`
                          : "Not selected"}
                      </p>
                      {enableVesting && (
                        <p>• Vesting: Enabled with {vestingCliff} day cliff</p>
                      )}
                      <p>
                        • Your assets will be held in a secure smart contract
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    disabled={lockButtonDisabled}
                    onClick={() => handleLockToken()}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      lockButtonDisabled
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-400 to-emerald-500 text-black hover:opacity-90"
                    }`}
                  >
                    <LockIcon className="h-5 w-5" />
                    {isLocking ? "Creating Lock..." : "Create Lock"}
                  </button>
                </div>
              </div>
            </div>

            {/* Lock Benefits */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Why Lock Assets?
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-white">
                        Build Trust
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Show commitment to your project
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-white">
                        Time Security
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Prevent early selling or rug pulls
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <LockIcon className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-white">
                        Smart Contract
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Immutable and transparent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Coins className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-white">
                        Token Categories
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Specialized forms for different token types
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Lock Statistics
                </h3>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500">Total Locks</span>
                  <span className="font-semibold text-white">
                    {
                      (platformStats?.PlatformStats as any)?.[0]
                        ?.totalTokenLockers
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "search" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">
                  Search Locks
                </h2>
              </div>
              <p className="text-zinc-500 text-sm mb-4">
                Find token or LP locks by address or view all active locks
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by token address..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-zinc-600"
                />
                <button className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm hover:bg-zinc-700 transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Active Locks
              </h3>
              <div className="space-y-4">
                {activeLocks?.map((lock: any) => (
                  <UserLockCard key={lock.id} lock={lock} />
                ))}
                {(!activeLocks || activeLocks.length === 0) && (
                  <p className="text-zinc-500 text-center py-8">
                    No active locks found
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Lock;
