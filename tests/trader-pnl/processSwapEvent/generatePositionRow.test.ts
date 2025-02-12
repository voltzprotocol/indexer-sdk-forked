/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { BigQueryPositionRow } from '../../../src/big-query-support';
import { generatePositionRow } from '../../../src/common/swaps/generatePositionRow';
import { SwapEventInfo } from '../../../src/common/swaps/parseSwapEvent';
import { mockedAMM } from '../../utils';

jest.useFakeTimers().setSystemTime(1640995200000); // 01.01.2022
jest.mock('../../../src/common/services/getLiquidityIndex.ts', () => {
  return {
    getLiquidityIndex: jest.fn(() => {
      return 1.5;
    }),
  };
});

describe('generate position row', () => {
  const eventInfo: SwapEventInfo = {
    eventId: 'blockhash_transactionhash_1',
    chainId: 1,
    vammAddress: 'amm-test',
    ownerAddress: '0x0000',
    tickLower: -1200,
    tickUpper: 1200,
    eventBlockNumber: 100,

    variableTokenDelta: 10,
    fixedTokenDeltaUnbalanced: -50,
    feePaidToLps: 1,

    rateOracle: 'rate-oracle',
    underlyingToken: 'token',
    marginEngineAddress: 'margin-engine',
  };

  it('non-existing position', async () => {
    const positionRow = generatePositionRow(mockedAMM, eventInfo, 1609459200, null, 1.5);

    expect(positionRow.marginEngineAddress).toBe('margin-engine');
    expect(positionRow.vammAddress).toBe('amm-test');
    expect(positionRow.ownerAddress).toBe('0x0000');
    expect(positionRow.tickLower).toBe(-1200);
    expect(positionRow.tickUpper).toBe(1200);
    expect(positionRow.realizedPnLFromSwaps).toBeCloseTo(-0);
    expect(positionRow.realizedPnLFromFeesPaid).toBe(-1);
    expect(positionRow.netNotionalLocked).toBe(10);
    expect(positionRow.netFixedRateLocked).toBe(0.05);
    expect(positionRow.lastUpdatedTimestamp).toBe(1609459200);
    expect(positionRow.notionalLiquidityProvided).toBe(0);
    expect(positionRow.realizedPnLFromFeesCollected).toBe(0);
    expect(positionRow.netMarginDeposited).toBe(0);
    expect(positionRow.rateOracleIndex).toBe(1);
    expect(positionRow.rowLastUpdatedTimestamp).toBe(1640995200);
    expect(positionRow.fixedTokenBalance).toBe(0);
    expect(positionRow.variableTokenBalance).toBe(0);
    expect(positionRow.positionInitializationTimestamp).toBe(1609459200);
    expect(positionRow.rateOracle).toBe('rate-oracle');
    expect(positionRow.underlyingToken).toBe('token-name');
    expect(positionRow.chainId).toBe(1);
  });

  it('existing position', async () => {
    const existingPositionRow: BigQueryPositionRow = {
      marginEngineAddress: 'margin-engine-immutable',
      vammAddress: 'amm-test-immutable',
      ownerAddress: '0x0000-immutable',
      tickLower: -1200,
      tickUpper: 1200,
      realizedPnLFromSwaps: 0,
      realizedPnLFromFeesPaid: -1,
      netNotionalLocked: -20,
      netFixedRateLocked: 0.1,
      lastUpdatedTimestamp: 1609459200,
      notionalLiquidityProvided: 0,
      realizedPnLFromFeesCollected: 0,
      netMarginDeposited: 0,
      rateOracleIndex: 1,
      rowLastUpdatedTimestamp: 1609459200,
      fixedTokenBalance: 0,
      variableTokenBalance: 0,
      positionInitializationTimestamp: 1609459200,
      rateOracle: 'rate-oracle-immutable',
      underlyingToken: 'token-immutable',
      chainId: 1,
      cashflowLiFactor: 0,
      cashflowTimeFactor: 0,
      cashflowFreeTerm: 0,
    };

    const positionRow = generatePositionRow(
      mockedAMM,
      eventInfo,
      1640995200,
      existingPositionRow,
      1.5,
    );

    expect(positionRow.marginEngineAddress).toBe('margin-engine-immutable');
    expect(positionRow.vammAddress).toBe('amm-test-immutable');
    expect(positionRow.ownerAddress).toBe('0x0000-immutable');
    expect(positionRow.tickLower).toBe(-1200);
    expect(positionRow.tickUpper).toBe(1200);
    expect(positionRow.realizedPnLFromSwaps).toBeCloseTo(0);
    expect(positionRow.realizedPnLFromFeesPaid).toBe(-2);
    expect(positionRow.netNotionalLocked).toBe(-10);
    expect(positionRow.netFixedRateLocked).toBe(0);
    expect(positionRow.lastUpdatedTimestamp).toBe(1640995200);
    expect(positionRow.notionalLiquidityProvided).toBe(0);
    expect(positionRow.realizedPnLFromFeesCollected).toBe(0);
    expect(positionRow.netMarginDeposited).toBe(0);
    expect(positionRow.rateOracleIndex).toBe(1);
    expect(positionRow.rowLastUpdatedTimestamp).toBe(1640995200);
    expect(positionRow.fixedTokenBalance).toBe(0);
    expect(positionRow.variableTokenBalance).toBe(0);
    expect(positionRow.positionInitializationTimestamp).toBe(1609459200);
    expect(positionRow.rateOracle).toBe('rate-oracle-immutable');
    expect(positionRow.underlyingToken).toBe('token-immutable');
    expect(positionRow.chainId).toBe(1);
  });
});
