import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Coins, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTokenFactory } from '@/hooks/useTokenFactory';
import { useMutation } from '@tanstack/react-query';

const TokenFactoryCard = () => {
  const [tokenType] = useState<
    'standard' | 'mintable' | 'burnable' | 'pausable'
  >('standard');

  const [tokenData, setTokenData] = useState({
    tokenName: '',
    tokenSymbol: '',
    totalSupply: 0,
    decimals: 18,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTokenData({ ...tokenData, [name]: value });
  };

  const { createTokens } = useTokenFactory();

  const handleCreateTokens = async () => {
    const tokenAddress = await createTokens(
      tokenData.tokenName,
      tokenData.tokenSymbol,
      tokenData.decimals,
      tokenData.totalSupply,
    );
    console.log(tokenAddress);
  };

  const handleReset = () => {
    setTokenData({
      tokenName: '',
      tokenSymbol: '',
      totalSupply: 0,
      decimals: 18,
    });
  };

  const { mutate: createToken, isPending: isCreatingToken } = useMutation({
    mutationFn: handleCreateTokens,
    onSuccess: () => {
      handleReset();
    },
  });

  const isDisabled =
    !tokenData.tokenName ||
    !tokenData.tokenSymbol ||
    !tokenData.totalSupply ||
    !tokenData.decimals ||
    isCreatingToken;

  return (
    <Card className="glass-card hover-glow">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <Coins className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Token Factory</CardTitle>
            <CardDescription>
              Create custom tokens with advanced features
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tokenName">Token Name</Label>
              <Input
                id="tokenName"
                placeholder="My Token"
                className="mt-1"
                name="tokenName"
                value={tokenData.tokenName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="tokenSymbol">Symbol</Label>
              <Input
                id="tokenSymbol"
                placeholder="MTK"
                className="mt-1"
                name="tokenSymbol"
                value={tokenData.tokenSymbol}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalSupply">Total Supply</Label>
              <Input
                id="totalSupply"
                placeholder="1000000"
                type="number"
                className="mt-1"
                name="totalSupply"
                value={tokenData.totalSupply}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="decimals">Decimals</Label>
              <Input
                id="decimals"
                placeholder="18"
                type="number"
                className="mt-1"
                name="decimals"
                value={tokenData.decimals}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Token Features
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Badge
              variant={tokenType === 'standard' ? 'gradient' : 'outline'}
              className="p-2 justify-center cursor-pointer hover:bg-accent/20"
            >
              {/* <Shield className="w-4 h-4 mr-2" /> */}
              Standard
            </Badge>
            {/* <Badge
              variant="secondary"
              className="p-2 justify-center cursor-pointer hover:bg-accent/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Mintable
            </Badge>
            <Badge
              variant="secondary"
              className="p-2 justify-center cursor-pointer hover:bg-accent/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              Burnable
            </Badge>
            <Badge
              variant="secondary"
              className="p-2 justify-center cursor-pointer hover:bg-accent/20"
            >
              <Shield className="w-4 h-4 mr-2" />
              Pausable
            </Badge> */}
          </div>
        </div>

        {/* Deployment Cost */}
        <div className="glass-card p-4 border border-accent/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Deployment Cost:
            </span>
            <span className="font-semibold text-accent">0.0 BOT</span>
          </div>
        </div>

        <Button
          variant="gradient"
          className="w-full"
          size="lg"
          onClick={() => createToken()}
          disabled={isDisabled}
        >
          {isCreatingToken ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Coins className="w-5 h-5 mr-2" />
              Deploy Token
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TokenFactoryCard;
