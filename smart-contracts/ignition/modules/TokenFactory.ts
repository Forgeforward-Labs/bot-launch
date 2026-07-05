import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenFactoryModule", (m) => {
  const tokenFactory = m.contract("TokenFactory");

  m.call(tokenFactory, "createStandardToken", [
    "Test Token",
    "TT",
    1000000000000000000000000n,
    18n,
  ]);

  return { tokenFactory };
});
