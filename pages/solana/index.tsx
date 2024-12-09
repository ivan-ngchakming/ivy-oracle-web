import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { useTokenPrice } from "../../hooks/useTokenPrice";

const SolanaLandingPage = () => {
	const { price: solPrice, isLoading } = useTokenPrice({
		coinGeckoId: 'solana'
	});
	
	return (
		<Layout
			contentHeight="75vh"
			chain="Solana"
			content={
				<div className="items-center flex flex-wrap">
					<div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
						<div>
							<h1 className="text-white font-semibold text-5xl">Solana Network</h1>
							<p className="mt-4 text-xl text-gray-300">
								High-Performance Validator Infrastructure
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
										<div className="text-3xl font-bold text-white">Enterprise</div>
										<div className="text-sm text-gray-400">Hardware</div>
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
					<div className="grid md:grid-cols-1 gap-8">
						<Card
							title="Validator Services"
							actionLabel="View Stats"
							actionType="link"
							href="/solana/validators"
						>
							<p className="pb-2">
								High-performance validator infrastructure ensuring network security
								and stability with enterprise-grade hardware and monitoring.
							</p>
						</Card>
					</div>
				</div>

				{/* Stats Section */}
				<div className="text-center mb-20">
					<h2 className="text-3xl font-bold mb-8">Validator Statistics</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="bg-white rounded-lg p-6 shadow">
							<div className="text-3xl font-bold text-gray-800">
								{isLoading ? (
									<span className="animate-pulse">Loading...</span>
								) : (
									`$${solPrice.toFixed(2)}`
								)}
							</div>
							<div className="text-sm text-gray-600">SOL Price</div>
						</div>
						<div className="bg-white rounded-lg p-6 shadow">
							<div className="text-3xl font-bold text-gray-800">
								{7.38}%
							</div>
							<div className="text-sm text-gray-600">APY</div>
						</div>
						<div className="bg-white rounded-lg p-6 shadow">
							<div className="text-3xl font-bold text-gray-800">
								{Number(51).toLocaleString()}
							</div>
							<div className="text-sm text-gray-600">Total Stake</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default SolanaLandingPage;
