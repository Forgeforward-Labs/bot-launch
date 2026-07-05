import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { useConnect } from "wagmi";
import { useState } from "react";
import metamaskIcon from "@/assets/metamask-icon.svg";

const WalletModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { connectors, connect } = useConnect();

  console.log(connectors);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>


        
      </DialogTrigger> */}
      <DialogContent className="max-w-md">
        <div className="text-2xl font-bold">Connect Wallet</div>
        {connectors.map((connector) => (
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              connector.name === "Injected" ? "md:hidden" : ""
            }`}
            key={connector.uid}
            onClick={() => {
              connect({ connector });
              onClose();
            }}
          >
            <img
              className="w-10 h-10"
              src={
                connector.name === "MetaMask" ? metamaskIcon : connector.icon
              }
              alt={connector.name}
            />
            {connector.name}
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export const ConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="gradient"
        size="sm"
        className="group"
        onClick={() => setIsOpen(true)}
      >
        <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
        Connect Wallet
      </Button>
      <WalletModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
