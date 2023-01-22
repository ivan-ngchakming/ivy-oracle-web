import { BASE_URL } from "../constants";
import { mapEthBlock } from "../mappers";

export const fetchBlock = async (blockNumber: number) => {
  const apiEthBlock = await fetch(`${BASE_URL}/indexer/block/${blockNumber}`)
    .then((res) => res.text())
    .then((data) => (data.length == 0 ? null : JSON.parse(data)));
  return apiEthBlock ? mapEthBlock(apiEthBlock) : null;
};
