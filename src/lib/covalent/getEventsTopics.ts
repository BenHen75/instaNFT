/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";

// import { covalentInstance } from ".";
import { errorHandler } from "../../utils/errorHandler";
// import { INFT } from "../../utils/Firestore/nft/addNfts";

function mapResponseBody(rawData: any) {
  /* Store only what is necessary from the server response */
  return rawData.map((element: any) => {
    const date = new Date(element.block_signed_at);

    let month = date.getMonth() + 1;
    let day = date.getDate();

    return {
      hash: element.tx_hash,
      value: element.value,
      from: element.from_address,
      to: element.to_address,
      timeStamp: element.block_signed_at,
      confirmations: element.successful,
      blockNumber: element.block_height,
      log_events: element.log_events,

      date: `${date.getFullYear()}-${month}-${day}`
    };
  });
}

export async function getEventsTopics(
  chain_id: any,
  accountAddress: string | undefined
): Promise<
  { events: Array<any>; success: true } | { error: string; success: false }
> {
  if (!accountAddress) return { error: "No account address", success: false };

  const url = `https://api.covalenthq.com/v1/${chain_id}/events/topics/${accountAddress}/?ending-block=12500100&key=`+process.env.REACT_APP_COVALENT_KEY;

  try {
    const res = await axios.get(url);

    if (res.status != 200) {
      return { error: "No nfts found", success: false };
    }

    console.log(res)
    
    const events = mapResponseBody(res.data.data.items);

    return {
      events,
      success: true,
    };
  } catch (error: any) {
    errorHandler(error, "getNfts nftport -> line 47");
    return {
      error: error.message,
      success: false,
    };
  }
}
