import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AirdropDistributorModule", (m) => {
  const airdropDistributor = m.contract("Distributor");

  return { airdropDistributor };
});
