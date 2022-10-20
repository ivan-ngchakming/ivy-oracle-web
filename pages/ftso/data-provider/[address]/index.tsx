import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import NProgress from "nprogress";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../../../../components/Layout";
import Table, {
  TableHead,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "../../../../components/Table";
import { Delegation, Paginated, Provider } from "../../../../types";
import { truncateEthAddress } from "../../../../utils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  if (!params || !params.address) {
    return {
      props: {
        provider: null,
      },
    };
  }

  const [data, towoData, delegations] = await Promise.all([
    fetch(`${BASE_URL}/ftso/data-provider/${params.address}`).then((res) =>
      res.json()
    ),
    fetch(
      `https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/bifrost-wallet.providerlist.json`
    ).then(async (res) =>
      (
        await res.json()
      ).providers.find(
        (p: any) => p.chainId === 19 && p.address === params.address
      )
    ),
    fetch(`${BASE_URL}/delegation?to=${params.address}`).then((res) =>
      res.json()
    ),
  ]);

  const provider = {
    address: data.address,
    name: data.name ?? towoData?.name ?? data.address,
    logoUrl: towoData
      ? towoData.logoURI
      : data.logo ??
        "https://cdn.flaremetrics.io/flare/ftso/emblem/unknown@64.png",
    accuracy: data.accuracy,
    fee: data.fee,
    scheduledFeeChange: data.scheduledFeeChanges,
    currentVotePower: data.currentVotePower,
    lockedVotePower: data.lockedVotePower,
    currentRewardRate: data.rewardRate,
    averageRewardRate: null,
    currentReward: data.providerRewards,
    totalReward: data.totalRewards,
    availability: data.availability,
    whitelistedSymbols: data.whitelistedSymbols,
    flareMetricsLink: null,
    ftsoMonitorLink: `https://songbird-ftso-monitor.flare.network/price?currency=XRP&startTime=30m&providerAddress=${data.address.toLowerCase()}`,
    blockChainExplorerLink: `https://songbird-explorer.flare.network/address/${data.address}`,
  };

  return {
    props: { provider, delegations },
  };
};

const ProviderPage = ({
  provider,
  delegations,
}: {
  provider: Provider;
  delegations: Paginated<Delegation>;
}) => {
  const router = useRouter();
  const { address } = router.query;

  const copy = async () => {
    await navigator.clipboard.writeText(address as string);
    toast.info("Address copied");
  };

  useEffect(() => {
    if (!address) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [address]);

  if (!address) {
    return (
      <Layout
        title={`FTSO Providers | ${provider.name}`}
        bannerTitle={"Loading"}
      >
        <div className="h-[50vh] p-10 text-center">
          <p className="mb-2">
            Looks like you are the first person checking out this provider.
          </p>
          <p>hold on, let Next.js do it&apos;s thing</p>
          <i className="fa-solid text-xl fa-spinner animate-spin mt-5"></i>
        </div>
      </Layout>
    );
  }

  if (!provider) {
    return;
  }

  return (
    <Layout
      title={`FTSO Providers | ${provider.name}`}
      bannerTitle={
        provider.address === provider.name
          ? truncateEthAddress(provider.address)
          : provider.name
      }
    >
      <div className="-translate-y-14 translate-x-5 text-white w-fit">
        <Link href={`/ftso/data-provider`}>
          <button className="flex justify-center items-center hover:text-gray-300 transition-colors">
            <i className="fa fa-angle-left mr-4" aria-hidden="true"></i> All
            Providers
          </button>
        </Link>
      </div>

      <div className="m-5 lg:mx-28 mb-40">
        <img src={provider.logoUrl} className="ml-2 w-20 h-20" />

        <div className="xl:flex gap-5">
          <div className="w-full grow">
            <div className="grid grid-cols-3 gap-x-2 gap-y-4 mt-8">
              <div className="font-bold text-gray-900">Name</div>
              <div className="col-span-2 break-all">{provider.name}</div>
              <div className="font-bold">Address</div>
              <div
                className="col-span-2 break-all hover:text-blue-700 transition-colors hover:cursor-pointer"
                onClick={copy}
              >
                {provider.address}
              </div>

              <div className="font-bold">Availability</div>
              <div className="col-span-2">
                {provider.availability
                  ? `${(provider.availability * 100).toFixed(4)}%`
                  : "N/A"}
              </div>

              <div className="font-bold">Accuracy</div>
              <div className="col-span-2">
                {provider.accuracy !== null
                  ? `${(provider.accuracy * 100).toFixed(4)}%`
                  : "N/A"}
              </div>

              <div className="font-bold">Vote Power</div>
              <div className="col-span-2 tracking-wider">
                {provider.currentVotePower !== null
                  ? `${provider.currentVotePower.toLocaleString()}`
                  : "N/A"}{" "}
                <span className="text-sm text-gray-500">
                  (Locked:{" "}
                  {provider.lockedVotePower !== null
                    ? `${provider.lockedVotePower.toLocaleString()}`
                    : "N/A"}
                  )
                </span>
              </div>

              <div className="font-bold">Rewards</div>
              <div className="col-span-2 tracking-wider">
                {provider.currentReward !== null
                  ? `${provider.currentReward.toLocaleString()}`
                  : "N/A"}{" "}
                <span className="text-sm text-gray-500">
                  (Total:{" "}
                  {provider.totalReward !== null
                    ? `${provider.totalReward.toLocaleString()}`
                    : "N/A"}
                  )
                </span>
              </div>

              <div className="font-bold">Rewards Rate</div>
              <div className="col-span-2 tracking-wider">
                {provider.currentRewardRate !== null
                  ? `${provider.currentRewardRate * 100} / 100 SGB`
                  : "N/A"}{" "}
              </div>

              <div className="font-bold">Scheduled Fee Change</div>
              <div className="col-span-2">
                {provider.scheduledFeeChange !== null &&
                provider.scheduledFeeChange.length > 0
                  ? provider.scheduledFeeChange.map(
                      ({ fee, validFromEpoch }) => (
                        <p key={`${provider.address}-${validFromEpoch}`}>
                          {`${
                            fee * 100
                          }% effective from reward epoch ${validFromEpoch}`}
                        </p>
                      )
                    )
                  : "N/A"}
              </div>

              <div className="font-bold">Links</div>
              <div className="col-span-2">
                {provider.flareMetricsLink && (
                  <div className="hover:text-gray-500 transition-colors">
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
                  </div>
                )}

                {provider.ftsoMonitorLink && (
                  <div className="hover:text-gray-500 transition-colors">
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
                  </div>
                )}

                {provider.blockChainExplorerLink && (
                  <div className="hover:text-gray-500 transition-colors">
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
                  </div>
                )}
              </div>
              <div className="font-bold">Whitelisted</div>
              <div className="col-span-2 flex flex-wrap gap-2">
                {provider.whitelistedSymbols.map((symbol) => (
                  <p
                    key={symbol}
                    className="bg-white rounded-full px-2 hover:shadow-md"
                  >
                    {symbol}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 xl:mt-0">
            <h2 className="text-xl font-extrabold mb-3">Delegations</h2>
            <Table className="sm:table">
              <TableHead>
                <tr>
                  <TableColumn>Delegator</TableColumn>
                  <TableColumn>Amount</TableColumn>
                </tr>
              </TableHead>
              <TableBody>
                {delegations.data.map((delegation) => (
                  <TableRow key={delegation.fromAddress}>
                    <TableCell>{delegation.fromAddress}</TableCell>
                    <TableCell>
                      {Math.round(delegation.amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {delegations.totalCount > 11 && (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Link href={`/ftso/data-provider/${address}/delegations`}>
                        <div className="hover:text-blue-700 hover:cursor-pointer">
                          See {delegations.totalCount - 10} more...
                        </div>
                      </Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderPage;
