/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Lock,
  LockFactory,
  Presale,
  PresalePurchase,
  Sales,
  SalesFactory,
  TokenFactory,
  Tokens,
} from "generated";
// import {} from "/generated/templates";
import type { PresaleStatus_t } from "generated/src/db/Enums.gen";
import type { TokenType_t } from "generated/src/db/Enums.gen";

TokenFactory.FeeTokenCreated.handler(async ({ event, context }) => {
  const entity: Tokens = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token: event.params.token,
    name: event.params.name ?? "TEST",
    symbol: event.params.symbol ?? "TEST",
    totalSupply: event.params.totalSupply ?? BigInt(0),
    decimalPlaces: event.params.decimalPlaces ?? BigInt(0),
    owner: event.params.owner ?? "0x0000000000000000000000000000000000000000",
    tokenType: "FEE" as TokenType_t,
    createdAt: BigInt(event.block.timestamp),
    fee: event.params.transferTax ?? BigInt(0),
    transferTax: event.params.transferTax ?? BigInt(0),
  };

  const stats = await context.PlatformStats.get("1");

  if (!stats) {
    context.PlatformStats.set({
      id: "1",
      totalTokens: BigInt(1),
      totalTokenLockers: BigInt(0),
      totalLPLockers: BigInt(0),
      totalSales: BigInt(0),
    });
  } else {
    context.PlatformStats.set({
      id: "1",
      totalTokens: BigInt(stats.totalTokens ?? 0) + BigInt(1),
      totalTokenLockers: stats.totalTokenLockers,
      totalLPLockers: stats.totalLPLockers,
      totalSales: stats.totalSales,
    });
  }

  context.Tokens.set(entity);
});

TokenFactory.StandardTokenCreated.handler(async ({ event, context }) => {
  const entity: Tokens = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token: event.params.token as string,
    name: event.params.name,
    symbol: event.params.symbol,
    totalSupply: event.params.totalSupply,
    decimalPlaces: event.params.decimalPlaces,
    owner: event.params.owner,
    tokenType: "STANDARD" as TokenType_t,
    createdAt: BigInt(event.block.timestamp),
    fee: BigInt(0),
    transferTax: BigInt(0),
  };

  const stats = await context.PlatformStats.get("1");

  if (!stats) {
    context.PlatformStats.set({
      id: "1",
      totalTokens: BigInt(1),
      totalTokenLockers: BigInt(0),
      totalLPLockers: BigInt(0),
      totalSales: BigInt(0),
    });
  } else {
    context.PlatformStats.set({
      id: "1",
      totalTokens: BigInt(stats.totalTokens ?? 0) + BigInt(1),
      totalTokenLockers: stats.totalTokenLockers,
      totalLPLockers: stats.totalLPLockers,
      totalSales: stats.totalSales,
    });
  }

  context.Tokens.set(entity);
});

LockFactory.LockCreated.handler(async ({ event, context }) => {
  const entity: Lock = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token: event.params.token,
    owner: event.params.owner,
    lockingAmount: event.params.lockingAmount,
    lockTimeEnd: event.params.lockTimeEnd,
    projectImageUrl: event.params.projectImageUrl,
    createdAt: BigInt(event.block.timestamp),
    lockAddress: event.params.lock,
  };

  const stats = await context.PlatformStats.get("1");

  if (!stats) {
    context.PlatformStats.set({
      id: "1",
      totalTokens: BigInt(0),
      totalTokenLockers: BigInt(1),
      totalLPLockers: BigInt(0),
      totalSales: BigInt(0),
    });
  } else {
    context.PlatformStats.set({
      id: "1",
      totalTokens: stats.totalTokens,
      totalTokenLockers: BigInt(stats.totalTokenLockers ?? 0) + BigInt(1),
      totalLPLockers: stats.totalLPLockers,
      totalSales: stats.totalSales,
    });
  }

  context.Lock.set(entity);
});

SalesFactory.SaleCreated.contractRegister(({ event, context }) => {
  context.addSales(event.params.saleAddress);
});

SalesFactory.SaleCreated.handler(async ({ event, context }) => {
  // saleData is a positional tuple:
  // [0] startTime, [1] endTime, [2] softCap, [3] hardCap, [4] maxBuy,
  // [5] saleSold, [6] totalTokensForSale, [7] salesJson,
  // [8] totalTokensForLiquidity, [9] liquidityBPS
  const saleData = event.params.saleData;
  const entity: Presale = {
    id: event.params.saleAddress,
    saleAddress: event.params.saleAddress,
    saleOwner: event.params.saleOwner,
    token: event.params.token,
    createdAt: BigInt(event.block.timestamp),
    status: "ACTIVE" as PresaleStatus_t,
    startTime: saleData[0],
    endTime: saleData[1],
    softCap: saleData[2],
    hardCap: saleData[3],
    maxBuy: saleData[4],
    totalTokensForSale: saleData[6],
    totalTokensForLiquidity: saleData[8],
    liquidityBPS: saleData[9],
    salesJson: saleData[7],
    saleSold: BigInt(0),
    participantCount: BigInt(0),
    totalSold: undefined,
    liquidityAmount: undefined,
    treasuryAmount: undefined,
  };

  const stats = await context.PlatformStats.get("1");

  if (!stats) {
    context.PlatformStats.set({
      id: "1",
      totalTokens: BigInt(0),
      totalTokenLockers: BigInt(0),
      totalLPLockers: BigInt(0),
      totalSales: BigInt(1),
    });
  } else {
    context.PlatformStats.set({
      id: "1",
      totalTokens: stats.totalTokens,
      totalTokenLockers: stats.totalTokenLockers,
      totalLPLockers: stats.totalLPLockers,
      totalSales: BigInt(stats.totalSales ?? 0) + BigInt(1),
    });
  }

  context.Presale.set(entity);
});

Sales.TokensPurchased.handler(async ({ event, context }) => {
  const entity: PresalePurchase = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    saleAddress: event.srcAddress,
    buyer: event.params.buyer,
    ethAmount: event.params.ethAmount,
    createdAt: BigInt(event.block.timestamp),
  };

  context.PresalePurchase.set(entity);

  // Update saleSold and participantCount on the Presale
  const presale = await context.Presale.get(event.srcAddress);
  if (presale) {
    context.Presale.set({
      ...presale,
      saleSold: BigInt(presale.saleSold ?? 0) + event.params.ethAmount,
      participantCount: BigInt(presale.participantCount ?? 0) + BigInt(1),
    });
  }
});

Sales.SaleFinalized.handler(async ({ event, context }) => {
  const presale = await context.Presale.get(event.srcAddress);

  if (presale) {
    context.Presale.set({
      ...presale,
      status: "FINALIZED" as PresaleStatus_t,
      totalSold: event.params.totalSold,
      liquidityAmount: event.params.liquidityAmount,
      treasuryAmount: event.params.treasuryAmount,
    });
  }
});
