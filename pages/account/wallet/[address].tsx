import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Button from "../../../components/Button";
import Layout from "../../../components/Layout";
import Table, {
  TableHead,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "../../../components/Table";
import { useWeb3API } from "../../../lib/api";
import { fetchAccountDetail } from "../../../lib/queries/account";
import { pingProtected } from "../../../lib/queries/auth";
import { DelegationEvent, Paginated, Transaction } from "../../../lib/types";
import { minimalTokenToToken, truncateEthAddress } from "../../../utils";

const Page = () => {
  const router = useRouter();
  const { login } = useWeb3API();

  const [transactions, setTransactions] =
    useState<Paginated<Transaction> | null>();
  const [delegationHistory, setDelegationHistory] =
    useState<Paginated<DelegationEvent> | null>();

  const handlePing = () => {
    pingProtected().then((res) => console.log(res));
  };

  const walletAddress = router.query.address as string;

  const refetch = useCallback(async () => {
    if (walletAddress) {
      const detail = await fetchAccountDetail(walletAddress);
      setTransactions(detail.transactions);
      setDelegationHistory(detail.delegationHistory);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Layout
      title={`Wallet ${truncateEthAddress(walletAddress)}`}
      bannerTitle={`Wallet ${truncateEthAddress(walletAddress)}`}
    >
      <div className="m-5 lg:m-28 mb-40">
        <Button onClick={login}>Login</Button>
        <Button onClick={handlePing}>Ping</Button>
        <div className="mt-6">
          {transactions && (
            <div>
              <h3 className="text-2xl font-bold p-2">Transactions</h3>
              <Table className="md:table">
                <TableHead>
                  <tr>
                    <TableColumn>#</TableColumn>
                    <TableColumn>From</TableColumn>
                    <TableColumn>To</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Timestamp</TableColumn>
                  </tr>
                </TableHead>
                <TableBody>
                  {transactions.data.map((tx, index) => (
                    <TableRow key={tx.transactionHash}>
                      <TableCell isIndex>
                        {truncateEthAddress(tx.blockHash)}
                      </TableCell>
                      <TableCell>
                        {truncateEthAddress(tx.fromAddress)}
                      </TableCell>
                      <TableCell>{truncateEthAddress(tx.toAddress)}</TableCell>
                      <TableCell>{minimalTokenToToken(tx.value)}</TableCell>
                      <TableCell>
                        {new Date(tx.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end p-4">
                Page {transactions.page + 1} /{" "}
                {Math.ceil(transactions.totalCount / transactions.limit)}
              </div>
            </div>
          )}
        </div>
        <div className="mt-6">
          {delegationHistory && (
            <div>
              <h3 className="text-2xl font-bold p-2">Delegation History</h3>
              <Table className="md:table">
                <TableHead>
                  <tr>
                    <TableColumn>Tx Hash</TableColumn>
                    <TableColumn>To</TableColumn>
                    <TableColumn>Change</TableColumn>
                    <TableColumn>Block</TableColumn>
                  </tr>
                </TableHead>
                <TableBody>
                  {delegationHistory.data.map((delegationEvent, index) => (
                    <TableRow
                      key={`delegation-${delegationEvent.transactionHash}`}
                    >
                      <TableCell isIndex>
                        {truncateEthAddress(delegationEvent.transactionHash)}
                      </TableCell>
                      <TableCell>
                        {truncateEthAddress(delegationEvent.to)}
                      </TableCell>
                      <TableCell>
                        {minimalTokenToToken(delegationEvent.newVotePower) -
                          minimalTokenToToken(delegationEvent.priorVotePower)}
                      </TableCell>
                      <TableCell>
                        {delegationEvent.blockNumber.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end p-4">
                Page {delegationHistory.page + 1} /{" "}
                {Math.ceil(
                  delegationHistory.totalCount / delegationHistory.limit
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Page;
