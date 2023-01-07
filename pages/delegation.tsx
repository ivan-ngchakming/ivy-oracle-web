/* eslint-disable @next/next/no-img-element */

import classNames from "classnames";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../components/Table";
import { fetchDelegationStats } from "../lib/queries";
import { DelegationStat } from "../lib/types";
import { truncateEthAddress } from "../utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const delegationStats = await fetchDelegationStats();

  return {
    props: {
      delegationStats,
    },
  };
};

const Page = ({ delegationStats }: { delegationStats: DelegationStat[] }) => {
  const [sortKey, setSortKey] = useState("");
  const [isAsc, setIsAsc] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setIsAsc((prev) => !prev);
      return;
    }
    setIsAsc(false);
    setSortKey(key);
  };

  const delegationStatsSorted = useMemo(() => {
    return delegationStats.sort((a, b) => {
      switch (sortKey) {
        case "count":
          return (a.count - b.count) * (isAsc ? 1 : -1);
        case "average":
          return (a.average - b.average) * (isAsc ? 1 : -1);
        case "stddev":
          return (a.standardDeviation - b.standardDeviation) * (isAsc ? 1 : -1);
        case "24hChange":
          return (
            (a.percentageChange24Hour - b.percentageChange24Hour) *
            (isAsc ? 1 : -1)
          );
        default:
          return 0;
      }
    });
  }, [delegationStats, sortKey, isAsc]);

  return (
    <Layout title="Delegation Statistics" bannerTitle="Delegation Statistics">
      <div className="m-5 lg:m-28 mb-40">
        <Table>
          <TableHead>
            <tr>
              <TableColumn>#</TableColumn>
              <TableColumn className="sm:table-cell hidden"></TableColumn>
              <TableColumn>
                <p>Name</p>
                <p className="text-gray-400 font-light text-xs">(Address)</p>
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("count")}
                asc={isAsc}
                sorted={sortKey === "count"}
              >
                Delegators Count
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("average")}
                asc={isAsc}
                sorted={sortKey === "average"}
              >
                Average
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("stddev")}
                asc={isAsc}
                sorted={sortKey === "stddev"}
              >
                Standard Deviation
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("24hChange")}
                asc={isAsc}
                sorted={sortKey === "24hChange"}
              >
                24h Change
              </TableColumn>
            </tr>
          </TableHead>
          <TableBody>
            {delegationStatsSorted.map((delegationStat, index) => (
              <TableRow key={delegationStat.address}>
                <TableCell isIndex>{index + 1}</TableCell>
                <TableCell className="sm:table-cell hidden">
                  <img
                    className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]"
                    src={delegationStat.logoUrl}
                    alt=""
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/ftso/data-provider/${delegationStat.address}`}>
                    <div className="flex items-center justify-center hover:cursor-pointer">
                      <div>
                        <p className="font-medium">
                          {delegationStat.address === delegationStat.name
                            ? truncateEthAddress(delegationStat.address)
                            : delegationStat.name}
                        </p>
                        <p className="text-gray-500">
                          {truncateEthAddress(delegationStat.address)}
                        </p>
                      </div>
                      <i
                        className="fa fa-external-link ml-4"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  {Math.round(delegationStat.count).toLocaleString()}
                </TableCell>
                <TableCell className="min-w-[200px]">
                  {delegationStat.average.toLocaleString()}
                </TableCell>
                <TableCell>
                  {delegationStat.standardDeviation.toLocaleString()}
                </TableCell>
                <TableCell className={classNames("min-w-[200px]")} isIndex>
                  <p
                    className={(() => {
                      if (delegationStat.percentageChange24Hour < 0) {
                        return "text-red-800";
                      }
                      if (delegationStat.percentageChange24Hour > 0) {
                        return "text-green-800";
                      }
                      return "";
                    })()}
                  >
                    {(
                      delegationStat.percentageChange24Hour * 100
                    ).toLocaleString() + "%"}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default Page;
