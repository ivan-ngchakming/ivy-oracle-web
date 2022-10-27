import { GetStaticProps } from "next";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { address } from "../abis/ftsoManager";
import Button from "../components/Button";
import Layout from "../components/Layout";
import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../components/Table";
import { Chain, CHAIN } from "../lib/constants";
import { fetchValidators } from "../lib/queries";
import { Validator } from "../lib/types";

export const getStaticProps: GetStaticProps = async (context) => {
  const validators = await fetchValidators();

  return {
    props: {
      validators,
    },
    revalidate: 5,
  };
};

const ValidatorPage = ({
  validators: initValidators,
}: {
  validators: Validator[];
}) => {
  const [validators, setValidators] = useState<Validator[]>(initValidators);
  const [fetching, setFetching] = useState(false);

  const refetchValidators = useCallback(async () => {
    setFetching(true);
    setValidators(await fetchValidators());
    setFetching(false);
  }, []);

  useEffect(() => {}, []);

  if (CHAIN === Chain.Songbird) {
    return (
      <Layout title="Validators" bannerTitle="Validators">
        <div className="m-5 lg:m-28 mb-40">
          <p className="text-center">
            Validator data not yet available on Songbird
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Validators" bannerTitle="Validators">
      <div className="m-5 lg:m-28 mb-40">
        <div className="flex justify-end mb-2 mx-2">
          <Button
            className="w-32"
            onClick={refetchValidators}
            loading={fetching}
          >
            Refresh
          </Button>
        </div>

        <Table>
          <TableHead>
            <tr>
              <TableColumn>#</TableColumn>
              <TableColumn>Node ID</TableColumn>
              <TableColumn>Reward Owner Address</TableColumn>
              <TableColumn>Delegation Fee</TableColumn>
              <TableColumn>Up Time</TableColumn>
              <TableColumn>Connected</TableColumn>
            </tr>
          </TableHead>
          <TableBody>
            {validators.map((validator, index) => (
              <TableRow key={validator.nodeID}>
                <TableCell isIndex>{index + 1}</TableCell>
                <TableCell>{validator.nodeID}</TableCell>
                <TableCell>
                  {validator.rewardOwner.checksumAddresses.map((address) => (
                    <a
                      key={validator.nodeID + address}
                      href={`https://flare-explorer.flare.network/address/${address}`}
                      className="hover:text-blue-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>{address}</p>
                    </a>
                  ))}
                </TableCell>
                <TableCell>
                  {Math.round(validator.delegationFee * 100 * 100) / 100}%
                </TableCell>
                <TableCell>
                  {Math.round(validator.uptime * 100 * 100) / 100}%
                </TableCell>
                <TableCell>
                  {validator.connected ? (
                    <i className="fa fa-check text-green-500"></i>
                  ) : (
                    <i className="fa fa-times text-red-500"></i>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};
export default ValidatorPage;
