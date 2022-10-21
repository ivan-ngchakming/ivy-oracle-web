import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../../../components/Layout";
import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../../../../components/Table";
import {
  fetchDelegations,
  fetchFTSODataProviderTowo,
} from "../../../../lib/queries";
import { Delegation, FTSODataProvider, Paginated } from "../../../../lib/types";
import { truncateEthAddress } from "../../../../utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  if (!params || !params.address) {
    return {
      props: {
        provider: null,
      },
    };
  }

  const [towoData, delegations] = await Promise.all([
    fetchFTSODataProviderTowo(params.address as string),
    fetchDelegations({ to: params.address as string }),
  ]);

  const provider = {
    address: params.address,
    name: towoData?.name ?? params.address,
  };

  return {
    props: { provider, delegations },
  };
};

const DelegationsPage = ({
  provider,
  delegations: initDelegations,
}: {
  provider: FTSODataProvider;
  delegations: Paginated<Delegation>;
}) => {
  const router = useRouter();
  const { address } = router.query;

  const [delegations, setDelegations] = useState<Paginated<Delegation> | null>(
    initDelegations
  );
  const [page, setPage] = useState(0);

  const totalPages = useMemo(() => {
    if (!delegations) {
      return 0;
    }
    return Math.ceil(delegations.totalCount / delegations.limit);
  }, [delegations]);

  useEffect(() => {
    if (address) {
      fetchDelegations({ to: address as string, page }).then((res) => {
        setDelegations(res);
      });
    }
  }, [address, page]);

  if (!address || !delegations) {
    return null;
  }

  return (
    <Layout
      title={`FTSO Providers | ${provider.name} | Delegations`}
      bannerTitle={
        (provider.address === provider.name
          ? truncateEthAddress(provider.address)
          : provider.name) + " Delegations"
      }
    >
      <div className="-translate-y-14 translate-x-5 text-white w-fit">
        <Link href={`/ftso/data-provider/${address}`}>
          <button className="flex justify-center items-center hover:text-gray-300 transition-colors">
            <i className="fa fa-angle-left mr-4" aria-hidden="true"></i>{" "}
            Provider Detail
          </button>
        </Link>
      </div>
      <div className="m-5 lg:mx-28 mb-40">
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-xl font-extrabold">Delegations</h2>
          {delegations.page !== 0 && (
            <button
              className="flex justify-center items-center px-4 py-2 hover:bg-white transition-colors rounded-full hover:shadow-lg"
              onClick={() => setPage((prev) => prev - 1)}
            >
              <i className="fa fa-angle-left sm:mr-4" aria-hidden="true"></i>{" "}
              <span className="hidden sm:block">Previous</span>
            </button>
          )}
          {delegations.hasMore && (
            <button
              className="flex justify-center items-center px-4 py-2 hover:bg-white transition-colors rounded-full hover:shadow-lg"
              onClick={() => setPage((prev) => prev + 1)}
            >
              <span className="hidden sm:block">Next</span>{" "}
              <i className="fa fa-angle-right sm:ml-4" aria-hidden="true"></i>
            </button>
          )}
          <p>
            page {delegations.page + 1} / {totalPages}
          </p>
        </div>
        <Table className="md:table">
          <TableHead>
            <tr>
              <TableColumn>#</TableColumn>
              <TableColumn>Delegator</TableColumn>
              <TableColumn asc={false} sorted>
                Amount
              </TableColumn>
              <TableColumn>Update at Block</TableColumn>
              <TableColumn>Created at Block</TableColumn>
            </tr>
          </TableHead>
          <TableBody>
            {delegations.data.map((delegation, index) => (
              <TableRow key={delegation.fromAddress}>
                <TableCell isIndex>
                  {index + 1 + delegations.page * 100}
                </TableCell>
                <TableCell>{delegation.fromAddress}</TableCell>
                <TableCell isIndex>
                  {Math.round(delegation.amount).toLocaleString()}
                </TableCell>
                <TableCell>
                  {delegation.updatedAtBlock.toLocaleString()}
                </TableCell>
                <TableCell>
                  {delegation.createdAtBlock.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <div className="w-28"></div>
          {delegations.page !== 0 && (
            <button
              className="flex justify-center items-center px-4 py-2 hover:bg-white transition-colors rounded-full hover:shadow-lg"
              onClick={() => setPage((prev) => prev - 1)}
            >
              <i className="fa fa-angle-left sm:mr-4" aria-hidden="true"></i>{" "}
              <span className="hidden sm:block">Previous</span>
            </button>
          )}
          {delegations.hasMore && (
            <button
              className="flex justify-center items-center px-4 py-2 hover:bg-white transition-colors rounded-full hover:shadow-lg"
              onClick={() => setPage((prev) => prev + 1)}
            >
              <span className="hidden sm:block">Next</span>{" "}
              <i className="fa fa-angle-right sm:ml-4" aria-hidden="true"></i>
            </button>
          )}
          <p>
            page {delegations.page + 1} / {totalPages}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DelegationsPage;
