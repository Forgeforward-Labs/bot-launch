import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SalesFactoryModule", (m) => {
  const owner = m.getAccount(0);
  //   const treasury = m.getParameter("treasury", owner);

  const lpVault = m.contract("LPVault", [owner]);
  const salesFactory = m.contract("SalesFactory", [
    "0xf6FeFa5b0B6a34F5d2949718D62E5042c68829a7",
    lpVault,
  ]);

  return { lpVault, salesFactory };
});
