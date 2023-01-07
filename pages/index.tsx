import { toast } from "react-toastify";
import Card from "../components/Card";
import Layout from "../components/Layout";
import { CHAIN, FTSO_PROVIDER_ADDRESS } from "../lib/constants";
import { Route } from "../lib/constants/routes";

const IndexPage = () => {
  const copy = async () => {
    await navigator.clipboard.writeText(FTSO_PROVIDER_ADDRESS);
    toast.info("Address copied");
  };

  return (
    <Layout
      contentHeight="75vh"
      content={
        <div className="items-center flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
            <div>
              <h1 className="text-white font-semibold text-5xl">Ivy Oracle</h1>
              <p className="mt-4 text-lg text-gray-300">
                FTSO data provider on Flare Network.
              </p>
              <button
                className="px-4 py-1 text-gray-300 font-bold mt-2 break-all"
                onClick={copy}
              >
                {FTSO_PROVIDER_ADDRESS}
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="mx-20 mt-10 mb-40">
        {/* <h2 className="text-center mb-5 text-xl font-bold">Navigation</h2> */}
        <div className="flex justify-center gap-8 flex-wrap">
          <Card
            title="STSO Data Providers"
            actionLabel="View page"
            actionType="link"
            href={
              CHAIN === "songbird"
                ? Route.FTSODataProvider
                : "https://songbird.ivyoracle.xyz" + Route.FTSODataProvider
            }
          >
            <p className="pb-2">
              See performance overview of Songbird Time Series Oracle providers
              with metrics such accuracy, reward rates and vote power.
            </p>
            <p className="pb-2">
              You can also find the detail break down of each STSO
              provider&apos;s delegations, and their earnings for the current
              reward epoch.
            </p>
          </Card>
          <Card
            title="FTSO Data Providers"
            actionLabel="View page"
            actionType="link"
            href={
              CHAIN === "flare"
                ? Route.FTSODataProvider
                : "https://flare.ivyoracle.xyz" + Route.FTSODataProvider
            }
          >
            <p className="pb-2">
              See performance overview of Flare Time Series Oracle data
              providers with metrics such accuracy, reward rates and vote power.
            </p>
            <p className="pb-2">
              You can also find the detail break down of each FTSO
              provider&apos;s delegations, and their earnings for the current
              reward epoch.
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
