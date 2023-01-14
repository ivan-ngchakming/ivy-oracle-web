import { GetStaticProps } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../../../components/Layout";
import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../../../components/Table";
import { CHAIN, SYMBOLS } from "../../../lib/constants";
import { FTSODataProviderBasic, RewardEpoch } from "../../../lib/types";
import { truncateEthAddress } from "../../../utils";
import NProgress from "nprogress";
import Button from "../../../components/Button";
import { fetchFTSODataProviders, fetchRewardEpoch } from "../../../lib/queries";
import Link from "next/link";
import ToggleButton from "../../../components/ToggleButton";
import classNames from "classnames";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const providers = await fetchFTSODataProviders();

  return {
    props: {
      providers,
    },
    revalidate: 5,
  };
};

const calculateTimeLeft = (targetDate: Date): TimeRemaining | null => {
  let difference = +targetDate - +new Date();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return null;
};

const ProviderPage = ({
  providers: initProviders,
}: {
  providers: FTSODataProviderBasic[];
}) => {
  const [providers, setProviders] = useState(initProviders);
  const [rewardEpoch, setRewardEpoch] = useState<RewardEpoch | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);
  const [fetching, setFetching] = useState(false);
  const [sortKey, setSortKey] = useState("accuracy");
  const [isAsc, setIsAsc] = useState(false);
  const [showVotePowerPercentage, setShowVotePowerPercentage] = useState(false);

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
          if (
            a.currentRewardRate === null ||
            String(a.currentRewardRate) === "NaN"
          ) {
            return isAsc ? -1 : 1;
          }
          if (
            b.currentRewardRate === null ||
            String(b.currentRewardRate) === "NaN"
          ) {
            return isAsc ? 1 : -1;
          }
          return (a.currentRewardRate - b.currentRewardRate) * (isAsc ? 1 : -1);
        case "projectedRewardRate":
          if (
            a.projectedRewardRate === null ||
            String(a.projectedRewardRate) === "NaN"
          ) {
            return isAsc ? -1 : 1;
          }
          if (
            b.projectedRewardRate === null ||
            String(b.projectedRewardRate) === "NaN"
          ) {
            return isAsc ? 1 : -1;
          }
          return (
            (a.projectedRewardRate - b.projectedRewardRate) * (isAsc ? 1 : -1)
          );
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

  const refetch = useCallback(async () => {
    setFetching(true);
    const [providers, rewardEpochFetched] = await Promise.all([
      fetchFTSODataProviders(),
      fetchRewardEpoch(),
    ]);
    setProviders(providers);
    setRewardEpoch(rewardEpochFetched);
    setFetching(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (rewardEpoch) {
        const t = calculateTimeLeft(rewardEpoch.end);
        setTimeLeft(t);
        if (!t) {
          refetch();
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    NProgress.start();
    refetch().then(() => {
      NProgress.done();
    });
  }, [refetch]);

  return (
    <Layout title="FTSO Providers" bannerTitle="FTSO Data Providers">
      <div className="m-5 lg:m-10 mb-40">
        <div className="sm:mx-5 mb-10 p-4 border border-black rounded-md">
          <h2 className="font-extrabold text-lg mb-4">Reward Epoch</h2>
          {rewardEpoch ? (
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-5 flex-wrap">
                <div>
                  <b>ID:</b> {rewardEpoch.epochId}
                </div>
                <div>
                  <b>Start:</b> {rewardEpoch.start.toLocaleString()}
                </div>
                <div>
                  <b>End:</b> {rewardEpoch.end.toLocaleString()}
                </div>
                {timeLeft && (
                  <div>
                    <b>Time Remaining:</b> {timeLeft.days} Days,{" "}
                    {timeLeft.hours} Hours, {timeLeft.minutes} Minutes,{" "}
                    {timeLeft.seconds} Seconds,
                  </div>
                )}
              </div>
              <div className="flex gap-x-5 flex-wrap">
                <div>
                  <b>Vote Power Lock Date:</b>{" "}
                  {rewardEpoch.votePowerLockBlockDate.toLocaleString()}
                </div>
                <div>
                  <b>Vote Power Lock Block:</b>{" "}
                  <a
                    className="hover:text-blue-700 transition-colors hover:cursor-pointer"
                    href={`https://${CHAIN}-explorer.flare.network/block/${rewardEpoch.votePowerLockBlockNumber}/transactions`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {rewardEpoch.votePowerLockBlockNumber.toLocaleString()}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="flex sm:flex-row flex-col justify-between m-2 gap-y-2 items-start">
          <div className="flex justify-center items-center">
            <ToggleButton
              toggled={showVotePowerPercentage}
              onChange={setShowVotePowerPercentage}
            />
            <span className="pl-2">Show vote power in %</span>
          </div>
          <Button className="w-32" onClick={refetch} loading={fetching}>
            Refresh
          </Button>
        </div>
        <Table>
          <TableHead>
            <tr>
              <TableColumn>#</TableColumn>
              <TableColumn className="sm:table-cell hidden"></TableColumn>
              <TableColumn
                className="sm:table-cell sm:left-auto sticky left-0"
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
                onClick={() => handleSort("projectedRewardRate")}
                asc={isAsc}
                sorted={sortKey === "projectedRewardRate"}
              >
                <p>Projected Reward Rate</p>
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
                <TableCell className="sm:table-cell sm:left-auto sticky left-0 bg-white">
                  <Link href={`/ftso/data-provider/${provider.address}`}>
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
                        className="fa fa-external-link ml-4 sm:block hidden"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </Link>
                </TableCell>
                <TableCell
                  className={classNames(
                    "min-w-[140px]",
                    provider.currentVotePowerPercentage &&
                      provider.currentVotePowerPercentage > 0.025
                      ? "text-red-800"
                      : ""
                  )}
                >
                  <p className="font-medium">
                    {(() => {
                      if (showVotePowerPercentage) {
                        return provider.currentVotePowerPercentage
                          ? (
                              provider.currentVotePowerPercentage * 100
                            ).toLocaleString() + "%"
                          : "N/A";
                      } else {
                        return provider.currentVotePower
                          ? Math.round(
                              provider.currentVotePower
                            ).toLocaleString()
                          : "N/A";
                      }
                    })()}
                  </p>
                  <p
                    className={classNames(
                      provider.lockedVotePowerPercentage &&
                        provider.lockedVotePowerPercentage > 0.025
                        ? "text-red-900"
                        : "",
                      "text-gray-500"
                    )}
                  >
                    {(() => {
                      if (showVotePowerPercentage) {
                        return provider.lockedVotePowerPercentage
                          ? (
                              provider.lockedVotePowerPercentage * 100
                            ).toLocaleString() + "%"
                          : "N/A";
                      } else {
                        return provider.lockedVotePower
                          ? Math.round(
                              provider.lockedVotePower
                            ).toLocaleString()
                          : "N/A";
                      }
                    })()}
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
                    {provider.projectedRewardRate !== null
                      ? (provider.projectedRewardRate * 100).toFixed(4)
                      : "N/A"}
                  </p>
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
                            Math.round(fee * 10000) / 100
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
                      if (
                        provider.whitelistedSymbols.length ===
                        SYMBOLS.length - 1
                      ) {
                        return `All except ${SYMBOLS.filter(
                          (symbol) =>
                            !provider.whitelistedSymbols.includes(symbol)
                        )}`;
                      }
                      if (
                        provider.whitelistedSymbols.length === SYMBOLS.length
                      ) {
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
