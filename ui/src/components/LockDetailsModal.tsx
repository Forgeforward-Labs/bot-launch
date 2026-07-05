import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Lock as LockIcon,
  Calendar,
  Coins,
  User,
  Hash,
  TrendingUp,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { shortenAddress } from "@/lib/utils";
import { zeroAddress } from "viem";

interface LockDetailsModalProps {
  lock: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LockDetailsModal({
  lock,
  open,
  onOpenChange,
}: LockDetailsModalProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied successfully`, {
      description: `${label} copied successfully`,
    });
  };

  const calculateVestingProgress = () => {
    if (!lock.vestingEnabled) return 0;

    const startDate = new Date(lock.vestingStart);
    const currentDate = new Date();
    const totalPeriod = parseInt(lock.vestingPeriod);
    const cliffPeriod = parseInt(lock.vestingCliff);

    const daysSinceStart = Math.floor(
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceStart < cliffPeriod) return 0;
    if (daysSinceStart >= totalPeriod) return 100;

    return Math.floor(
      ((daysSinceStart - cliffPeriod) / (totalPeriod - cliffPeriod)) * 100
    );
  };

  const getUnlockProgress = () => {
    const lockDate = Number(lock.createdAt);
    const unlockDate = Number(lock.lockTimeEnd);
    const currentDate = Date.now() / 1000;

    const totalPeriod = unlockDate - lockDate;
    const elapsed = currentDate - lockDate;

    return Math.min(Math.max((elapsed / totalPeriod) * 100, 0), 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-9/10 max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-primary" />
            Lock Details - {lock.tokenName}
          </DialogTitle>
          <DialogDescription>
            Complete information about this token lock
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                Token Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token Name</span>
                <span className="font-semibold">
                  {lock.token === zeroAddress
                    ? "BOT"
                    : (lock.tokenName as string)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symbol</span>
                <span className="font-semibold">
                  {lock.token === zeroAddress
                    ? "BOT"
                    : (lock.tokenSymbol as string)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge
                  variant={lock.token === zeroAddress ? "default" : "secondary"}
                >
                  {lock.token === zeroAddress
                    ? "Native Token"
                    : "Contract Token"}
                </Badge>
              </div>
              {lock.contractAddress && (
                <div className="space-y-2">
                  <span className="text-muted-foreground">
                    Contract Address
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {lock.contractAddress}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          lock.contractAddress,
                          "Contract address"
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lock Details */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockIcon className="h-4 w-4 text-primary" />
                Lock Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Locked</span>
                <span className="font-semibold">
                  {lock.amount} {lock.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lock Date</span>
                <span className="font-semibold">{lock.lockDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unlock Date</span>
                <span className="font-semibold">{lock.unlockDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    lock.status === "Unlockable" ? "default" : "secondary"
                  }
                >
                  {lock.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unlock Progress</span>
                  <span className="text-sm font-semibold">
                    {Math.round(getUnlockProgress())}%
                  </span>
                </div>
                <Progress value={getUnlockProgress()} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span className="text-muted-foreground">Owner Address</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {shortenAddress(lock.owner)}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(lock.owner, "Owner address")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-muted-foreground">Lock ID</span>
                <span className="font-mono text-sm">{lock.id}</span>
              </div> */}
            </CardContent>
          </Card>

          {/* Vesting Information */}
          {lock.vestingEnabled && (
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Vesting Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vesting Start</span>
                  <span className="font-semibold">{lock.vestingStart}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliff Period</span>
                  <span className="font-semibold">
                    {lock.vestingCliff} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vesting Period</span>
                  <span className="font-semibold">
                    {lock.vestingPeriod} days
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Vesting Progress
                    </span>
                    <span className="text-sm font-semibold">
                      {calculateVestingProgress()}%
                    </span>
                  </div>
                  <Progress
                    value={calculateVestingProgress()}
                    className="h-2"
                  />
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    Tokens are gradually released over the vesting period after
                    the cliff
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Transaction History */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 glass-card rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <LockIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Lock Created</p>
                    <p className="text-sm text-muted-foreground">
                      {lock.lockDate}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(`0x${"a".repeat(64)}`, "Transaction hash")
                  }
                >
                  <Hash className="h-3 w-3 mr-1" />
                  View Tx
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
