import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import { fetchFundMovements } from "../../lib/queries";
import { FundMovementNode } from "../../lib/types";
import { truncateEthAddress } from "../../utils";

const FundMovementCard = ({
  accountNodes,
  accountNode,
}: {
  accountNodes: Record<string, FundMovementNode>;
  accountNode: FundMovementNode;
}) => {
  const nextLevelNodes = useMemo(
    () =>
      accountNode.initiatedTransactions &&
      accountNode.initiatedTransactions.data
        .map((transaction) => transaction.toAccount)
        .filter(function (item, pos, self) {
          return self.indexOf(item) == pos;
        })
        .map((address) => accountNodes[address]),
    [accountNode.initiatedTransactions, accountNodes]
  );

  return (
    <div className="flex items-center px-2 py-4 gap-2 font-mono">
      <a
        href={`https://songbird-explorer.flare.network/address/${accountNode.address}`}
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={classNames(
            "border border-green-500 rounded-md px-4 py-2 min-w-[140px]"
          )}
        >
          {truncateEthAddress(accountNode.address)}
        </div>
      </a>
      {accountNode.initiatedTransactions &&
        accountNode.initiatedTransactions.totalCount > 0 && (
          <div className="pl-1">={">"}</div>
        )}
      <div className="flex flex-col gap-y-2">
        {nextLevelNodes && (
          <>
            {nextLevelNodes.map((node) => (
              <div
                key={node.address}
                className="flex items-center px-2 gap-x-2"
              >
                <div className="flex flex-col items-center">
                  {node.receivedTransactions.amount.toLocaleString()} SGB
                  <div className="border border-blue-500 rounded-md px-4 py-2  min-w-[140px]">
                    {node.receivedTransactions.data.map((transaction) => (
                      <div key={transaction.transactionHash}>
                        <a
                          href={`https://songbird-explorer.flare.network/tx/${transaction.transactionHash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {truncateEthAddress(transaction.transactionHash)}
                        </a>
                      </div>
                    ))}
                    {node.receivedTransactions.hasMore && (
                      <div>
                        {node.receivedTransactions.totalCount -
                          node.receivedTransactions.data.length}{" "}
                        more...
                      </div>
                    )}
                  </div>
                </div>

                <div className="pl-1">={">"}</div>
                <FundMovementCard
                  accountNode={node}
                  accountNodes={accountNodes}
                />
              </div>
            ))}
            {accountNode.hasMoreChildNodes && (
              <div className="flex justify-around mt-8 mb-4">
                <div className="flex-1"></div>
                <div className="flex-1 text-center">
                  {accountNode.childNodesCount - nextLevelNodes.length} more...
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [queriedAddress, setQueriedAddress] = useState("");
  const [originAddress, setOriginAddress] = useState(
    "0x1a30adad5fe755053befb992900ec00b687f80ca"
  );
  const [startDate, setStartDate] = useState<string>("2022-12-30 12:00:00");
  const [endDate, setEndDate] = useState<string>("2023-12-30 12:00:00");
  const [level, setLevel] = useState<string>("2");
  const [accountNodes, setAccountNodes] =
    useState<Record<string, FundMovementNode>>();

  const handleQuery = useCallback(async () => {
    setIsFetching(true);
    const fetchedFundMovements = await fetchFundMovements(
      originAddress,
      startDate,
      endDate,
      level
    );
    setQueriedAddress(originAddress);
    setAccountNodes(fetchedFundMovements);
    setIsFetching(false);
  }, [endDate, level, originAddress, startDate]);

  return (
    <Layout title="Fund Tracing" bannerTitle="Fund Tracing">
      <div className="m-5 lg:m-28 mb-40">
        <div className="flex items-end justify-between">
          <div className="flex items-end">
            <Input
              label="Address"
              value={originAddress}
              onChange={(e) => setOriginAddress(e.target.value)}
            />
            <Input
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Input
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </div>
          <Button
            onClick={handleQuery}
            loading={isFetching}
            className="min-w-[100px]"
          >
            Query
          </Button>
        </div>
        <div className="overflow-x-scroll px-10">
          {!isFetching && !accountNodes && <p>Click Query to see result</p>}
          {accountNodes && (
            <FundMovementCard
              accountNode={accountNodes[queriedAddress.toLowerCase()]}
              accountNodes={accountNodes}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Page;
