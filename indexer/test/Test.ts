import assert from "assert";
import { 
  TestHelpers,
  TokenFactory_FeeTokenCreated
} from "generated";
const { MockDb, TokenFactory } = TestHelpers;

describe("TokenFactory contract FeeTokenCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for TokenFactory contract FeeTokenCreated event
  const event = TokenFactory.FeeTokenCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("TokenFactory_FeeTokenCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await TokenFactory.FeeTokenCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualTokenFactoryFeeTokenCreated = mockDbUpdated.entities.TokenFactory_FeeTokenCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedTokenFactoryFeeTokenCreated: TokenFactory_FeeTokenCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      token: event.params.token,
      name: event.params.name,
      symbol: event.params.symbol,
      totalSupply: event.params.totalSupply,
      decimalPlaces: event.params.decimalPlaces,
      transferTax: event.params.transferTax,
      owner: event.params.owner,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualTokenFactoryFeeTokenCreated, expectedTokenFactoryFeeTokenCreated, "Actual TokenFactoryFeeTokenCreated should be the same as the expectedTokenFactoryFeeTokenCreated");
  });
});
