import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Lock as LockIcon,
  ArrowLeft,
  Copy,
  Calendar,
  Clock,
  Shield,
  Download,
  ExternalLink,
  Coins,
} from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { LockCertificateModal } from "@/components/LockCertificateModal";
import { toast } from "sonner";
import { useGetLockQuery } from "@/graphql/__generated__/types-and-hooks";
import { useERC20Token } from "@/hooks/useERC20Token";
import { zeroAddress } from "viem";
import { useBalance } from "wagmi";
import { convertTimestampToDate, shortenAddress } from "@/lib/utils";
import { useQuery } from "wagmi/query";
import { botChainTestnet } from "@/lib/chains";

const LockDetails = () => {
  const { address } = useParams<{ address: string }>();
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  const { data: lock, loading: lockLoading } = useGetLockQuery({
    variables: {
      lockAddress: address as `0x${string}`,
    },
    skip: !address,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const lockData = (lock?.Lock as any)?.[0];

  const { getTokenDetails } = useERC20Token(lockData?.token as `0x${string}`);

  const { data: lockBalance } = useBalance({
    address: lockData?.lockAddress as `0x${string}`,
    token:
      lockData?.token === zeroAddress
        ? undefined
        : (lockData?.token as `0x${string}`),
  });

  const getUnlockProgress = () => {
    const lockDate = Number(lockData?.createdAt);
    const unlockDate = Number(lockData?.lockTimeEnd);
    const currentDate = Date.now() / 1000;

    const totalPeriod = unlockDate - lockDate;
    const elapsed = currentDate - lockDate;

    return Math.min(Math.max((elapsed / totalPeriod) * 100, 0), 100);
  };

  const { data: tokenDetails } = useQuery({
    queryKey: ["token-details", lockData?.token as `0x${string}`],
    queryFn: () => getTokenDetails(),
  });

  const tokenName =
    lockData?.token === zeroAddress
      ? "BOT"
      : ((tokenDetails as any)?.name as string);
  const tokenSymbol =
    lockData?.token === zeroAddress
      ? "BOT"
      : ((tokenDetails as any)?.symbol as string);
  const decimalPlaces =
    lockData?.token === zeroAddress ? 18 : (tokenDetails as any)?.decimals || 0;
  const status =
    Number(lockData?.lockTimeEnd) * 1000 > Date.now()
      ? "Locked"
      : Number(lockBalance?.value) > 0
        ? "Unlockable"
        : "Unlocked";

  const shareUrl = window.location.href;

  if (lockLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!lock || !lockData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Lock not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/lock">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm hover:bg-zinc-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Locks
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Lock Details</h1>
            <p className="text-zinc-400">
              Viewing lock for {tokenName} ({tokenSymbol})
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === "Locked"
                ? "bg-emerald-500/20 text-emerald-400"
                : status === "Unlockable"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-zinc-500/20 text-zinc-400"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Main Lock Info */}
        <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <LockIcon className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {tokenName} ({tokenSymbol})
                </h2>
                <p className="text-zinc-500 text-sm">Token Lock Certificate</p>
              </div>
            </div>
            <button
              onClick={() => setCertificateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm hover:bg-zinc-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Certificate
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Unlock Progress</span>
              <span className="text-white">
                {getUnlockProgress().toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-zinc-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                style={{ width: `${getUnlockProgress()}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Locked: {convertTimestampToDate(lockData.createdAt * 1000)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Unlocks: {convertTimestampToDate(lockData.lockTimeEnd * 1000)}
                </span>
              </div>
            </div>
          </div>

          {/* Lock Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-white">
                <Coins className="h-4 w-4 text-emerald-400" />
                Token Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Token Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white">
                      {shortenAddress(lockData.token)}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(lockData.token, "Token address")
                      }
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Locked Amount:</span>
                  <span className="font-medium text-white">
                    {Number(lockData.lockingAmount) /
                      10 ** Number(decimalPlaces)}{" "}
                    {tokenSymbol}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-white">
                <Shield className="h-4 w-4 text-emerald-400" />
                Owner Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Owner Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white">
                      {shortenAddress(lockData.owner)}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(lockData.owner, "Owner address")
                      }
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Lock Date:</span>
                  <span className="text-white">
                    {convertTimestampToDate(lockData.createdAt * 1000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Unlock Date:</span>
                  <span className="text-white">
                    {convertTimestampToDate(lockData.lockTimeEnd * 1000)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vesting Info */}
          {lockData.isVesting && (
            <div className="space-y-4 pt-4 border-t border-zinc-700/50 mb-6">
              <h3 className="font-semibold text-white">Vesting Schedule</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">Vesting Start:</span>
                  <p className="font-medium text-white">
                    {format(new Date(lockData.vestingStart), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-500">Cliff Period:</span>
                  <p className="font-medium text-white">
                    {lockData.vestingCliff} days
                  </p>
                </div>
                <div>
                  <span className="text-zinc-500">Vesting Period:</span>
                  <p className="font-medium text-white">
                    {lockData.vestingPeriod} days
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-700/50">
            <h3 className="font-semibold text-white">Share This Lock</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-zinc-800/50 rounded-lg font-mono text-sm text-zinc-400 truncate">
                {shareUrl}
              </div>
              <button
                onClick={() => copyToClipboard(shareUrl, "Share URL")}
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  window.open(
                    `${botChainTestnet.blockExplorers.default.url}/address/${lockData.lockAddress}`,
                    "_blank",
                  )
                }
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <LockCertificateModal
        lock={{
          ...lockData,
          tokenName,
          tokenSymbol,
          decimalPlaces,
          lockDate: convertTimestampToDate(Number(lockData.createdAt)),
          unlockDate: convertTimestampToDate(Number(lockData.lockTimeEnd)),
          amount: Number(lockData.lockingAmount) / 10 ** Number(decimalPlaces),
          status,
        }}
        open={certificateModalOpen}
        onOpenChange={setCertificateModalOpen}
      />
    </div>
  );
};

export default LockDetails;
