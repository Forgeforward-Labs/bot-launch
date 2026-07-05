import { Download, Eye, Loader2, LockIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LockDetailsModal } from "./LockDetailsModal";
import { LockCertificateModal } from "./LockCertificateModal";
import { useState } from "react";
import { useERC20Token } from "@/hooks/useERC20Token";
import { zeroAddress } from "viem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBalance } from "wagmi";
import { useLock } from "@/hooks/useLock";

export function UserLockCard({ lock }: { lock: any }) {
  const [showLockDetails, setShowLockDetails] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const { withdraw } = useLock();

  const { getTokenDetails } = useERC20Token(lock.token);

  const { data: lockBalance, refetch: refetchLockBalance } = useBalance({
    address: lock.lockAddress,
    token: lock.token === zeroAddress ? "" : lock.token,
  });

  const { data: tokenDetails } = useQuery({
    queryKey: ["token-details", lock.token],
    queryFn: () => getTokenDetails(),
  });

  const handleWithdraw = async () => {
    const receipt = await withdraw(lock.lockAddress);
    console.log("receipt", receipt);
  };

  const { mutate: withdrawMutation, isPending: withdrawPending } = useMutation({
    mutationFn: handleWithdraw,
    onSuccess: () => {
      refetchLockBalance();
    },
  });

  console.log("lock balance", lock.token, lock.lockAddress, lockBalance);

  const tokenName =
    lock.token === zeroAddress ? "BOT" : (tokenDetails?.name as string);
  const tokenSymbol =
    lock.token === zeroAddress ? "BOT" : (tokenDetails?.symbol as string);
  const decimalPlaces =
    lock.token === zeroAddress ? 18 : tokenDetails?.decimals || 0;
  const status =
    Number(lock.lockTimeEnd) * 1000 > Date.now()
      ? "Locked"
      : Number(lockBalance?.value) > 0
      ? "Unlockable"
      : "Unlocked";
  return (
    <>
      <div
        key={lock.id}
        className="p-4 glass-card rounded-lg border border-white/10 hover:border-white/20 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-lg">
              <LockIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold">{tokenName}</h4>
              <p className="text-sm text-muted-foreground">{tokenSymbol}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={lock.type === "LP" ? "secondary" : "outline"}>
              {lock.type}
            </Badge>
            <Badge variant={status === "Unlockable" ? "default" : "secondary"}>
              {status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-semibold">
              {Number(lock.lockingAmount) / 10 ** Number(decimalPlaces)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Lock Date</p>
            <p className="font-semibold">{lock.lockDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Unlock Date</p>
            <p className="font-semibold">{lock.unlockDate}</p>
          </div>
          <div className="flex items-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLockDetails(true)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCertificate(true)}
            >
              <Download className="h-3 w-3 mr-1" />
              Certificate
            </Button>
            {status === "Unlockable" && (
              <Button
                size="sm"
                variant="protocol"
                disabled={withdrawPending}
                onClick={() => withdrawMutation()}
              >
                {withdrawPending && (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                )}
                {withdrawPending ? "Unlocking..." : "Unlock"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <>
        <LockDetailsModal
          lock={{
            ...lock,
            tokenName,
            tokenSymbol,
            decimalPlaces,
            amount: Number(lock.lockingAmount) / 10 ** Number(decimalPlaces),
            status,
          }}
          open={showLockDetails}
          onOpenChange={setShowLockDetails}
        />
        <LockCertificateModal
          lock={{
            ...lock,
            tokenName,
            tokenSymbol,
            decimalPlaces,
            amount: Number(lock.lockingAmount) / 10 ** Number(decimalPlaces),
            status,
          }}
          open={showCertificate}
          onOpenChange={setShowCertificate}
        />
      </>
    </>
  );
}
