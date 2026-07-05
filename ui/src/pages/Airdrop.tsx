import { useMemo, useState } from "react";
import { Upload, Gift, Users, Download, Send } from "lucide-react";
import { toast } from "sonner";
import { useAirdrop } from "@/hooks/useAirdrop";
import { useERC20Token } from "@/hooks/useERC20Token";
import { useQuery } from "@tanstack/react-query";

const Airdrop = () => {
  const [tokenType, setTokenType] = useState("contract");
  const [tokenAddress, setTokenAddress] = useState("");
  const [allocationType, setAllocationType] = useState("allocation");
  const [amountPerRecipient, setAmountPerRecipient] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);

  const { getTokenDetails } = useERC20Token(tokenAddress);

  const { data: tokenDetails } = useQuery({
    queryKey: ["tokenDetails", tokenAddress],
    queryFn: () => getTokenDetails(),
  });

  const {
    distributeEtherAllocation,
    distributeTokenAllocation,
    distributeEther,
    distributeToken,
  } = useAirdrop();

  const totalAmount = useMemo(() => {
    if (allocationType === "allocation") {
      return csvData.reduce((acc, curr) => acc + Number(curr.amount), 0);
    }
    return Number(amountPerRecipient) * csvData.length;
  }, [allocationType, csvData, amountPerRecipient]);

  const parseCSV = (content: string) => {
    const lines = content.trim().split("\n");
    const data = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const columns = line.split(",").map((col) => col.trim());
        if (allocationType === "allocation" && columns.length >= 2) {
          data.push({ address: columns[0], amount: columns[1] });
        } else if (allocationType === "equal" && columns.length >= 1) {
          data.push({ address: columns[0] });
        }
      }
    }

    return data;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parsedData = parseCSV(content);
        setCsvData(parsedData.slice(1, parsedData.length));

        toast.success(
          `${file.name} uploaded successfully with ${
            parsedData.length - 1
          } recipients`
        );
      };
      reader.readAsText(file);
    } else {
      toast.error("Please upload a CSV file");
    }
  };

  const downloadCSVTemplate = (type: "allocation" | "equal") => {
    let csvContent = "";
    let filename = "";

    if (type === "allocation") {
      csvContent =
        "address,amount\n0x1234567890123456789012345678901234567890,100.50\n0x0987654321098765432109876543210987654321,250.75";
      filename = "airdrop_allocation_template.csv";
    } else {
      csvContent =
        "address\n0x1234567890123456789012345678901234567890\n0x0987654321098765432109876543210987654321";
      filename = "airdrop_equal_template.csv";
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`${filename} has been downloaded`);
  };

  const handleCreateAirdrop = async () => {
    if (!csvFile) {
      toast.error("Please upload a CSV file");
      return;
    }

    if (tokenType === "contract" && !tokenAddress) {
      toast.error("Please enter token contract address");
      return;
    }

    if (allocationType === "allocation" && !totalAmount) {
      toast.error("Please enter total amount");
      return;
    } else if (allocationType === "equal" && !amountPerRecipient) {
      toast.error("Please enter amount per recipient");
      return;
    }

    if (tokenType === "native" && allocationType === "allocation") {
      const tx = await distributeEtherAllocation(
        csvData.map((data) => data.address),
        csvData.map((data) => BigInt(Number(data.amount) * 10 ** 18))
      );
      toast.success("Ether distributed successfully");
      return tx;
    }

    if (tokenType === "contract" && allocationType === "allocation") {
      const tx = await distributeTokenAllocation(
        tokenAddress,
        csvData.map((data) => data.address),
        csvData.map((data) =>
          BigInt(
            Number(data.amount) * 10 ** Number(tokenDetails?.decimals ?? 0)
          )
        )
      );
      toast.success("Token distributed successfully");
      return tx;
    }

    if (tokenType === "native" && allocationType === "equal") {
      const tx = await distributeEther(
        csvData.map((data) => data.address),
        BigInt(Number(amountPerRecipient) * 10 ** 18)
      );
      toast.success("Ether distributed successfully");
      return tx;
    }

    if (tokenType === "contract" && allocationType === "equal") {
      const tx = await distributeToken(
        tokenAddress,
        csvData.map((data) => data.address),
        BigInt(
          Number(amountPerRecipient) * 10 ** Number(tokenDetails?.decimals ?? 0)
        )
      );
      toast.success("Token distributed successfully");
      return tx;
    }

    toast.success(
      `Token distributed successfully with ${csvData.length} recipients`
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl">
              <Gift className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Airdrop Dispenser
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Distribute tokens efficiently to your community with our automated
            airdrop system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Token Dispenser Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Send className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">
                  Airdrop Dispenser
                </h2>
              </div>
              <p className="text-zinc-500 text-sm mb-6">
                Set up automated token distribution to multiple recipients
              </p>

              <div className="space-y-6">
                {/* Token Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Token Type
                  </label>
                  <select
                    value={tokenType}
                    onChange={(e) => setTokenType(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="native">Native Token</option>
                    <option value="contract">Contract Token</option>
                  </select>
                </div>

                {/* Token Address */}
                {tokenType === "contract" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">
                      Token Contract Address
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

                {/* Allocation Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Allocation Type
                  </label>
                  <select
                    value={allocationType}
                    onChange={(e) => setAllocationType(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="allocation">
                      Individual Allocation (CSV with amounts)
                    </option>
                    <option value="equal">
                      Equal Distribution (Same amount for all)
                    </option>
                  </select>
                </div>

                {/* Amount per recipient */}
                {allocationType === "equal" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">
                      Amount per Recipient
                    </label>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={amountPerRecipient}
                      onChange={(e) => setAmountPerRecipient(e.target.value)}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-zinc-600"
                    />
                    <p className="text-xs text-zinc-500">
                      Each address will receive this exact amount
                    </p>
                  </div>
                )}

                {/* CSV Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Recipients List (CSV)
                  </label>
                  <div className="border border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-colors">
                    <Upload className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                    <p className="text-sm text-zinc-500 mb-2">
                      {allocationType === "allocation"
                        ? "Upload CSV file with recipient addresses and amounts"
                        : "Upload CSV file with recipient addresses only"}
                    </p>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="inline-block px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white hover:bg-zinc-700 transition-colors">
                        Choose File
                      </span>
                    </label>
                    {csvFile && (
                      <div className="mt-3 space-y-1">
                        <p className="text-sm text-emerald-400">
                          {csvFile.name} selected
                        </p>
                        <p className="text-xs text-zinc-500">
                          {csvData.length} recipients loaded
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CSV Format Info */}
                <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                  <h4 className="font-semibold mb-2 text-white">
                    CSV Format & Template
                  </h4>
                  {allocationType === "allocation" ? (
                    <div className="text-sm text-zinc-500 space-y-1 mb-3">
                      <p>• Column 1: Wallet Address</p>
                      <p>• Column 2: Token Amount</p>
                      <p>• Example: 0x123...,100.50</p>
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-500 space-y-1 mb-3">
                      <p>• Column 1: Wallet Address</p>
                      <p>• Example: 0x123...</p>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      downloadCSVTemplate(
                        allocationType as "allocation" | "equal"
                      )
                    }
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCreateAirdrop}
                  className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Gift className="h-5 w-5" />
                  Dispense Tokens
                </button>
              </div>
            </div>
          </div>

          {/* Dispenser Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">
                  Dispenser Benefits
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Gift className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Batch Distribution
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Send tokens to multiple addresses at once
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Flexible Amounts
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Equal or custom amounts per recipient
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Send className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      CSV Upload
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Easy bulk recipient management
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Airdrop;
