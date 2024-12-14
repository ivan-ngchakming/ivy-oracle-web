import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { useTokenPrice } from "../../hooks/useTokenPrice";
import { useEffect, useState } from "react";
import { fetchValidator } from "../../lib/solana/queries/validators";
import { Validator } from "../../lib/solana/types";
import { formatSol } from "../../utils/solana";
import { SOLANA_VALIDATOR_IDENTITY, SOLANA_VALIDATOR_VOTE_ACCOUNT } from "../../lib/solana/constants";
import { toast } from "react-toastify";

const SolanaLandingPage = () => {
	const { price: solPrice, isLoading: priceLoading } = useTokenPrice({
		coinGeckoId: 'solana'
	});

	const [validators, setValidators] = useState<Validator | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadValidators = async () => {
			try {
				const data = await fetchValidator(SOLANA_VALIDATOR_VOTE_ACCOUNT);
				setValidators(data);
			} catch (error) {
				console.error('Error loading validators:', error);
			} finally {
				setLoading(false);
			}
		};

		loadValidators();
	}, []);
	const totalStake = validators?.activated_stake || 0;
	const avgSkipRate = validators?.vote_skip_rate || 0;
	const uptime = avgSkipRate ? (100 - (avgSkipRate * 100)).toFixed(2) : '99.9';

	const copy = async (text: string) => {
		await navigator.clipboard.writeText(text);
		toast.info("Address copied");
	};

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
										<div className="text-3xl font-bold text-white">{uptime}%</div>
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
					<div className="grid md:grid-cols-3 gap-4">
						<Card
							title="Our Validator"
							actionLabel="View Stats"
							actionType="link"
							href={`/solana/validators/${SOLANA_VALIDATOR_VOTE_ACCOUNT}`}
						>
							<p className="pb-2">
								View detailed statistics about our Solana validator, including stake,
								uptime, commission rate, and historical performance data. Track our
								validator's contributions to the network in real-time.
							</p>
						</Card>
						<Card
							title="Validator Dashboard"
							actionLabel="View Dashboard"
							actionType="link"
							href="/solana/validators"
						>
							<p className="pb-2">
								Monitor all validators&apos; performance metrics, including stake, uptime,
								and commission rates. View detailed statistics and historical data
								for our Solana network participation.
							</p>
						</Card>
						<Card
							title="Leader Schedule"
							actionLabel="View Schedule"
							actionType="link"
							href="/solana/leader_schedule"
						>
							<p className="pb-2">
								Track block production schedule and performance metrics for all validators
								in the Solana network.
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
								{priceLoading ? (
									<span className="animate-pulse">Loading...</span>
								) : (
									`$${solPrice.toFixed(2)}`
								)}
							</div>
							<div className="text-sm text-gray-600">SOL Price</div>
						</div>
						<div className="bg-white rounded-lg p-6 shadow">
							<div className="text-3xl font-bold text-gray-800">
								{loading ? (
									<span className="animate-pulse">Loading...</span>
								) : (
									`${uptime}%`
								)}
							</div>
							<div className="text-sm text-gray-600">Uptime</div>
						</div>
						<div className="bg-white rounded-lg p-6 shadow">
							<div className="text-3xl font-bold text-gray-800">
								{loading ? (
									<span className="animate-pulse">Loading...</span>
								) : (
									formatSol(totalStake)
								)}
							</div>
							<div className="text-sm text-gray-600">Total Stake (SOL)</div>
						</div>
					</div>
				</div>

				{/* Delegation Section */}
				<div className="text-center mb-20">
					<h2 className="text-3xl font-bold mb-8">Delegate to Us</h2>
					<div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
						<div className="grid md:grid-cols-2 gap-8 mb-8">
							<div>
								<h3 className="text-lg font-semibold mb-2">Vote Account</h3>
								<div 
									className="bg-gray-100 p-4 rounded break-all cursor-pointer hover:bg-gray-200"
									onClick={() => copy(SOLANA_VALIDATOR_VOTE_ACCOUNT)}
								>
									{SOLANA_VALIDATOR_VOTE_ACCOUNT}
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Identity</h3>
								<div 
									className="bg-gray-100 p-4 rounded break-all cursor-pointer hover:bg-gray-200"
									onClick={() => copy(SOLANA_VALIDATOR_IDENTITY)}
								>
									{SOLANA_VALIDATOR_IDENTITY}
								</div>
							</div>
						</div>
						
						<div className="space-y-4">
							<p className="text-gray-600">
								Delegate your SOL tokens to our validator to earn staking rewards and help secure the network.
							</p>
							<div className="flex justify-center space-x-4">
								<a 
									href={`https://solstake.io/#/app/validator/${SOLANA_VALIDATOR_VOTE_ACCOUNT}`}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
								>
									Stake via SolStake
								</a>
								<a
									href="https://staking.kiwi/app/5eJQDSbgTZSEmH3zSWDEdAKgjavUUn9BkouCFNLz1x93"
									target="_blank"
									rel="noopener noreferrer"
									className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
								>
									Stake via Kiwi
								</a>
								<a
									href={`https://stake.solblaze.org/app/?validator=${SOLANA_VALIDATOR_VOTE_ACCOUNT}`}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
								>
									Stake via Blaze
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default SolanaLandingPage;
