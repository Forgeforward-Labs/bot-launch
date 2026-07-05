import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  ExternalLink,
  AlertTriangle,
  Crown,
  Users,
  //   Percent,
  Settings,
  Shield,
  Pause,
  Play,
  Coins,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Tokens } from "@/graphql/__generated__/types-and-hooks";
import { convertTimestampToDate, shortenAddress } from "@/lib/utils";
import { useERC20Token } from "@/hooks/useERC20Token";
import { useMutation, useQuery } from "@tanstack/react-query";

interface TokenManagementModalProps {
  token: Tokens | null;
  isOpen: boolean;
  onClose: () => void;
}

const TokenManagementModal: React.FC<TokenManagementModalProps> = ({
  token,
  isOpen,
  onClose,
}) => {
  const [newOwner, setNewOwner] = useState("");
  //   const [taxRate, setTaxRate] = useState("3");
  //   const [maxWallet, setMaxWallet] = useState("2");

  const { renounceOwnership, transferOwnership } = useERC20Token(
    token?.token as string
  );
  const { getTokenOwnership } = useERC20Token(token?.token as string);
  const { data: owner, refetch } = useQuery({
    queryKey: ["token-ownership", token?.token],
    queryFn: () => getTokenOwnership(),
  });
  const { mutate: handleRenounceOwnership, isPending: isRenouncing } =
    useMutation({
      mutationFn: renounceOwnership,
      onSuccess: () => {
        refetch();
      },
    });

  const { mutate: handleTransferOwnership, isPending: isTransferring } =
    useMutation({
      mutationFn: transferOwnership,
      onSuccess: () => {
        refetch();
      },
    });

  const isOwner = owner?.toLowerCase() === token?.owner.toLowerCase();

  console.log({ owner, isOwner });
  const status = "Active";

  if (!token) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(token.token);
    toast.success("Address copied", {
      description: "Token contract address copied to clipboard",
    });
  };

  //   const handleRenounceOwnership = () => {
  //     // toast.error("Ownership Renounced", {
  //     //   description: "You have permanently renounced ownership of this token",
  //     // });
  //   };

  //   const handleRenounceOwnership = async () => {
  //     await renounceOwnership();
  //   };

  //   const handleTransferOwnership = () => {
  //     if (!newOwner) {
  //       toast.error("Error", {
  //         description: "Please enter a valid address",
  //       });
  //       return;
  //     }
  //     toast.success("Ownership Transferred", {
  //       description: `Ownership transferred to ${newOwner}`,
  //     });
  //     setNewOwner("");
  //   };

  const handlePauseToken = () => {
    toast.success(status === "Active" ? "Token Paused" : "Token Resumed", {
      description:
        status === "Active"
          ? "All transfers have been paused"
          : "Transfers have been resumed",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span>{token.name} Management</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{token.symbol}</Badge>
                <Badge
                  variant={status === "Active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {status}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Manage your token settings, ownership, and parameters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Token Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Token Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Contract Address
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-sm font-mono">
                    {shortenAddress(token.token)}
                  </code>
                  <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Total Supply
                </Label>
                <p className="font-semibold mt-1">{token.totalSupply}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Created</Label>
                <p className="font-semibold mt-1">
                  {convertTimestampToDate(Number(token.createdAt))}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <Badge
                  variant={status === "Active" ? "default" : "secondary"}
                  className="mt-1"
                >
                  {status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ownership Management */}
          {isOwner ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Crown className="w-5 h-5 text-accent" />
                <span>Ownership Management</span>
              </h3>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <Label htmlFor="newOwner">Transfer Ownership</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      id="newOwner"
                      placeholder="0x... (new owner address)"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() =>
                        handleTransferOwnership(newOwner as `0x${string}`)
                      }
                      variant="outline"
                      disabled={isTransferring}
                    >
                      {isTransferring ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Transfer
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Transfer ownership to another address. This action cannot be
                    undone.
                  </p>
                </div>

                <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-destructive">
                        Renounce Ownership
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permanently give up ownership of this token. This action
                        cannot be undone and will make the token immutable.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-3"
                        onClick={() => handleRenounceOwnership()}
                        disabled={isRenouncing}
                      >
                        {isRenouncing ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Renounce Ownership
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <Separator />

          {/* Token Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Token Controls</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <Label>Token Status</Label>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">
                    {status === "Active"
                      ? "Token transfers are enabled"
                      : "Token transfers are paused"}
                  </span>
                  <Button
                    variant={status === "Active" ? "destructive" : "default"}
                    size="sm"
                    onClick={handlePauseToken}
                  >
                    {status === "Active" ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <Label>Contract Actions</Label>
                <div className="space-y-2 mt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Add Liquidity
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Mint Tokens
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* <Separator /> */}

          {/* Fee Parameters */}
          {/* <div className="space-y-4"> */}
          {/* <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Percent className="w-5 h-5" />
              <span>Fee Parameters</span>
            </h3> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    id="taxRate"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    min="0"
                    max="25"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Transaction tax rate (0-25%)
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <Label htmlFor="maxWallet">Max Wallet (%)</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    id="maxWallet"
                    type="number"
                    value={maxWallet}
                    onChange={(e) => setMaxWallet(e.target.value)}
                    min="0.1"
                    max="100"
                    step="0.1"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum wallet holding percentage
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Fee Distribution</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Marketing</Label>
                  <p className="font-semibold">40%</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Liquidity</Label>
                  <p className="font-semibold">40%</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Burn</Label>
                  <p className="font-semibold">20%</p>
                </div>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenManagementModal;
