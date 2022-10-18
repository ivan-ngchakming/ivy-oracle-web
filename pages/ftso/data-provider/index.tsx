import { GetServerSideProps } from "next";
import { useMemo, useState } from "react";
import Layout from "../../../components/Layout";
import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../../../components/Table";
import { SYMBOLS } from "../../../constants";
import { ProviderBasic } from "../../../types";
import { truncateEthAddress } from "../../../utils";

const BASE_URL = process.env.BASE_URL;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [data, towoData] = await Promise.all([
    fetch(`${BASE_URL}/ftso/data-provider`).then((res) => res.json()),
    fetch(
      `https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/bifrost-wallet.providerlist.json`
    ).then(async (res) =>
      (await res.json()).providers.filter((p: any) => p.chainId === 19)
    ),
  ]);

  return {
    props: {
      providers: data.map((row: any) => {
        const towoInfo = towoData.find((p: any) => p.address === row.address);

        return {
          address: row.address,
          name: row.name ?? towoInfo?.name ?? row.address,
          logoUrl: towoInfo
            ? towoInfo.logoURI
            : row.logo ??
              "https://cdn.flaremetrics.io/flare/ftso/emblem/unknown@64.png",
          accuracy: row.accuracy,
          fee: row.fee,
          scheduledFeeChange: row.scheduledFeeChanges,
          currentVotePower: row.currentVotePower,
          lockedVotePower: row.lockedVotePower,
          currentRewardRate: row.rewardRate,
          averageRewardRate: null,
          currentReward: row.providerRewards,
          totalReward: row.totalRewards,
          availability: row.availability,
          whitelistedSymbols: row.whitelistedSymbols,
          flareMetricsLink: null,
          ftsoMonitorLink: `https://songbird-ftso-monitor.flare.network/price?currency=XRP&startTime=30m&providerAddress=${row.address.toLowerCase()}`,
          blockChainExplorerLink: `https://songbird-explorer.flare.network/address/${row.address}`,
        };
      }),
    },
  };
};

const ProviderPage = ({ providers }: { providers: ProviderBasic[] }) => {
  const [sortKey, setSortKey] = useState("accuracy");
  const [isAsc, setIsAsc] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setIsAsc((prev) => !prev);
      return;
    }
    setIsAsc(false);
    setSortKey(key);
  };

  const providersSorted = useMemo(() => {
    return providers.sort((a, b) => {
      switch (sortKey) {
        case "votePower":
          if (!a.currentVotePower) {
            return isAsc ? -1 : 1;
          }
          if (!b.currentVotePower) {
            return isAsc ? 1 : -1;
          }
          return (a.currentVotePower - b.currentVotePower) * (isAsc ? 1 : -1);
        case "accuracy":
          if (!a.accuracy) {
            return isAsc ? -1 : 1;
          }
          if (!b.accuracy) {
            return isAsc ? 1 : -1;
          }
          return (a.accuracy - b.accuracy) * (isAsc ? 1 : -1);
        case "rewardRate":
          if (!a.currentRewardRate) {
            return isAsc ? -1 : 1;
          }
          if (!b.currentRewardRate) {
            return isAsc ? 1 : -1;
          }
          return (a.currentRewardRate - b.currentRewardRate) * (isAsc ? 1 : -1);
        case "name":
          return ("" + a.name).localeCompare(b.name) * (isAsc ? -1 : 1);
        case "availability":
          if (!a.availability) {
            return isAsc ? -1 : 1;
          }
          if (!b.availability) {
            return isAsc ? 1 : -1;
          }
          return (a.availability - b.availability) * (isAsc ? 1 : -1);
        case "fee":
          if (!a.fee) {
            return isAsc ? -1 : 1;
          }
          if (!b.fee) {
            return isAsc ? 1 : -1;
          }
          return (a.fee - b.fee) * (isAsc ? 1 : -1);
        default:
          return 0;
      }
    });
  }, [providers, sortKey, isAsc]);

  return (
    <Layout title="FTSO Providers" bannerTitle="FTSO Data Providers">
      <div className="m-5 lg:m-28 mb-40">
        <Table>
          <TableHead>
            <tr>
              <TableColumn>#</TableColumn>
              <TableColumn className="sm:table-cell hidden"></TableColumn>
              <TableColumn
                onClick={() => handleSort("name")}
                asc={isAsc}
                sorted={sortKey === "name"}
              >
                <p>Name</p>
                <p className="text-gray-400 font-light text-xs">(Address)</p>
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("votePower")}
                asc={isAsc}
                sorted={sortKey === "votePower"}
              >
                <p>Vote Power</p>
                <p className="text-gray-400 font-light text-xs">
                  (Locked Vote Power)
                </p>
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("accuracy")}
                asc={isAsc}
                sorted={sortKey === "accuracy"}
              >
                <p>Accuracy</p>
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("rewardRate")}
                asc={isAsc}
                sorted={sortKey === "rewardRate"}
              >
                <p>Reward Rate</p>
                {/* <p className="text-gray-400 font-light text-xs">
                  (Avg. Reward Rate)
                </p> */}
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("fee")}
                asc={isAsc}
                sorted={sortKey === "fee"}
              >
                <p>Fee</p>
                <p className="text-gray-400 font-light text-xs">
                  (Scheduled fee change)
                </p>
              </TableColumn>
              <TableColumn
                onClick={() => handleSort("availability")}
                asc={isAsc}
                sorted={sortKey === "availability"}
              >
                <p>Availability</p>
              </TableColumn>
              <TableColumn>
                <p>Whitelisted for</p>
              </TableColumn>
              <TableColumn>
                <p>View On</p>
              </TableColumn>
            </tr>
          </TableHead>
          <TableBody>
            {providersSorted.map((provider, index) => (
              <TableRow key={provider.address}>
                <TableCell isIndex>{index + 1}</TableCell>
                <TableCell className="sm:table-cell hidden">
                  <img
                    className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]"
                    src={provider.logoUrl}
                    alt=""
                  />
                </TableCell>
                <TableCell>
                  <a href={`/ftso/data-provider/${provider.address}`}>
                    <div className="flex items-center justify-center hover:cursor-pointer">
                      <div>
                        <p className="font-medium">
                          {provider.address === provider.name
                            ? truncateEthAddress(provider.address)
                            : provider.name}
                        </p>
                        <p className="text-gray-500">
                          {truncateEthAddress(provider.address)}
                        </p>
                      </div>
                      <i
                        className="fa fa-external-link ml-4"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </a>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {provider.currentVotePower
                      ? Math.round(provider.currentVotePower).toLocaleString()
                      : "N/A"}
                  </p>
                  <p className="text-gray-500">
                    {provider.lockedVotePower
                      ? Math.round(provider.lockedVotePower).toLocaleString()
                      : "N/A"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {provider.accuracy && (provider.accuracy * 100).toFixed(2)}%
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {provider.currentRewardRate !== null
                      ? (provider.currentRewardRate * 100).toFixed(4)
                      : "N/A"}
                  </p>
                  {/* <p className="text-gray-500">
                    {provider.averageRewardRate !== null
                      ? (provider.averageRewardRate * 100).toFixed(4)
                      : "N/A"}
                  </p> */}
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {provider.fee !== null ? `${provider.fee * 100}%` : "N/A"}
                  </p>
                  {provider.scheduledFeeChange &&
                    provider.scheduledFeeChange.length > 0 && (
                      <p className="text-gray-500 mt-1">
                        {(() => {
                          const { fee, validFromEpoch } =
                            provider.scheduledFeeChange[0];
                          return `${
                            fee * 100
                          }% effective from ${validFromEpoch}`;
                        })()}
                      </p>
                    )}
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {provider.availability
                      ? `${(provider.availability * 100).toFixed(0)}%`
                      : "N/A"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {(() => {
                      if (provider.whitelistedSymbols.length < 3) {
                        return provider.whitelistedSymbols.join(", ") + " Only";
                      }
                      if (provider.whitelistedSymbols.length === 11) {
                        return `All except ${SYMBOLS.filter(
                          (symbol) =>
                            !provider.whitelistedSymbols.includes(symbol)
                        )}`;
                      }
                      if (provider.whitelistedSymbols.length === 12) {
                        return "All";
                      }
                      return `${provider.whitelistedSymbols.length} FTSOs`;
                    })()}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-4 justify-center items-center">
                    {provider.flareMetricsLink && (
                      <a
                        href={provider.flareMetricsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Flare Metrics
                        <i
                          className="fa fa-external-link ml-2"
                          aria-hidden="true"
                        ></i>
                      </a>
                    )}

                    {provider.ftsoMonitorLink && (
                      <a
                        href={provider.ftsoMonitorLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        FTSO Monitor
                        <i
                          className="fa fa-external-link ml-2"
                          aria-hidden="true"
                        ></i>
                      </a>
                    )}

                    {provider.blockChainExplorerLink && (
                      <a
                        href={provider.blockChainExplorerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Explorer
                        <i
                          className="fa fa-external-link ml-2"
                          aria-hidden="true"
                        ></i>
                      </a>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default ProviderPage;
