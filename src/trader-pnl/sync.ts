import { BigQuery } from '@google-cloud/bigquery';
import { AMM } from '@voltz-protocol/v1-sdk';

import { getPreviousEvents } from '../common';
import { processSwapEvent } from './processSwapEvent';

export const sync = async (
  chainId: number,
  bigQuery: BigQuery,
  amms: AMM[],
  previousBlockNumber: number,
): Promise<void> => {
  const previousSwapEvents = await getPreviousEvents(amms, 'swap', previousBlockNumber);

  const promises = Object.values(previousSwapEvents).map(async ({ amm, events }) => {
    for (const swapEvent of events) {
      await processSwapEvent(chainId, bigQuery, amm, swapEvent);
    }
  });

  const output = await Promise.allSettled(promises);
  output.forEach((v) => {
    if (v.status === 'rejected') {
      throw v.reason;
    }
  });
};
