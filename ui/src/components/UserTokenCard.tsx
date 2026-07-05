import { Coins, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tokens } from "@/graphql/__generated__/types-and-hooks";
import { convertTimestampToDate, shortenAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import TokenManagementModal from "./TokenManagementModal";
import { useState } from "react";

export const UserTokenCard = ({ token }: { token: Tokens }) => {
  const status = "Active";
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Card className="glass-card hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">{token.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                status === "Active"
                  ? "bg-primary/20 text-primary"
                  : status === "Locked"
                  ? "bg-accent/20 text-accent"
                  : "bg-muted/20 text-muted-foreground"
              }`}
            >
              {status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Supply</p>
              <p className="font-semibold">
                {Number(token.totalSupply) / 10 ** Number(token.decimalPlaces)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-semibold">
                {convertTimestampToDate(Number(token.createdAt))}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Address</p>
              <div className="flex items-center space-x-1">
                <p className="font-mono text-xs">
                  {shortenAddress(token.token)}
                </p>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
      <TokenManagementModal
        token={token}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
