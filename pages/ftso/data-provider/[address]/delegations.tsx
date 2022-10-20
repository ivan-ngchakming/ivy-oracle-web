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

import { Delegation, Paginated } from "../../../../types";
import { truncateEthAddress } from "../../../../utils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const DelegationsPage = () => {
  const router = useRouter();
  const { address } = router.query;

  const [delegations, setDelegations] = useState<Paginated<Delegation> | null>(
    null
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
      fetch(`${BASE_URL}/delegation?to=${address}&page=${page}&size=100`)
        .then((res) => res.json())
        .then((res) => {
          setDelegations(res);
        });
    }
  }, [address, page]);

  if (!address || !delegations) {
    return null;
  }

  return (
    <Layout
      title="FTSO Providers"
      bannerTitle={truncateEthAddress(address as string)}
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
