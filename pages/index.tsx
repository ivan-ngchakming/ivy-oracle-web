import { toast } from "react-toastify";
import Card from "../components/Card";
import Layout from "../components/Layout";
import { FTSO_PROVIDER_ADDRESS } from "../lib/constants";
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
          <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
            <div>
              <h1 className="text-white font-semibold text-5xl">Ivy Oracle</h1>
              <p className="mt-4 text-xl text-gray-300">
                Building Reliable Blockchain Infrastructure
              </p>
              <p className="mt-2 text-lg text-gray-400">
                Secure, Efficient, and Professional Blockchain Services
              </p>
              <div className="mt-8">
                <p className="text-lg text-gray-300">
                  Powering the Future of Decentralized Finance
                </p>
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
                    <div className="text-3xl font-bold text-white">3+</div>
                    <div className="text-sm text-gray-400">Networks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Vision Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Ivy Oracle, we strive to promote and advocate for the wide adoption of blockchain technology. 
            Our mission is to provide reliable and efficient blockchain infrastructure services while 
            maintaining transparency and trust within the ecosystem.
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card
              title="Flare Network"
              actionLabel="Learn More"
              actionType="link"
              href={Route.Flare}
            >
              <p className="pb-2">
                Professional FTSO data provider delivering accurate price feeds and optimized rewards
                for delegators. Low fees and transparent operations.
              </p>
            </Card>

            <Card
              title="Songbird Network"
              actionLabel="Learn More"
              actionType="link"
              href={Route.Songbird}
            >
              <p className="pb-2">
                Experienced signal provider on Songbird, offering reliable price oracle services
                and comprehensive analytics tools for the community.
              </p>
            </Card>

            <Card
              title="Solana Network"
              actionLabel="Learn More"
              actionType="link"
              href={Route.Solana}
            >
              <p className="pb-2">
                High-performance validator infrastructure ensuring network security
                and stability with enterprise-grade hardware.
              </p>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600 mb-4">
            Have questions? We&apos;d love to hear from you.
          </p>
          <div className="space-x-4 mb-8">
            <a
              href="mailto:info@ivyoracle.xyz"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="https://x.com/ivy_oracle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Follow Us
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
