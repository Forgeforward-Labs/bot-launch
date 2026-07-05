import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LockFactoryModule", (m) => {
  const lockFactory = m.contract("LockFactory");

  return { lockFactory };
});
