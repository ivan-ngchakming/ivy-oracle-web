import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { Route } from "../../lib/constants/routes";

const FlareLandingPage = () => {
  return (
    <Layout
      contentHeight="75vh"
      content={
        <div className="items-center flex flex-wrap">
          <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
            <div>
              <h1 className="text-white font-semibold text-5xl">Flare Network</h1>
              <p className="mt-4 text-xl text-gray-300">
                Enterprise-Grade FTSO Data Provider
              </p>
              <div className="mt-8">
                <div className="mt-6 flex justify-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-sm text-gray-400">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">12+</div>
                    <div className="text-sm text-gray-400">Price Pairs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Services Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
          {/* <div className="grid md:grid-cols-2 gap-8">
            <Card
              title="FTSO Data Provider"
              actionLabel="Learn More"
              actionType="link"
              href={Route.FTSODataProvider}
            >
              <p className="pb-2">
                Enterprise-grade price oracle delivering accurate data feeds and optimized
                rewards for delegators. Competitive fees and transparent operations.
              </p>
            </Card>

            <Card
              title="Validator Services"
              actionLabel="View Stats"
              actionType="link"
              href={Route.Validator}
            >
              <p className="pb-2">
                Secure and reliable validator infrastructure ensuring network stability
                with enterprise-grade hardware and monitoring.
              </p>
            </Card>
          </div> */}
        </div>

        {/* Stats Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-8">Network Statistics</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-gray-800">$0.00</div>
              <div className="text-sm text-gray-600">FLR Price</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-gray-800">0.00%</div>
              <div className="text-sm text-gray-600">APY</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">Total Delegators</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FlareLandingPage;