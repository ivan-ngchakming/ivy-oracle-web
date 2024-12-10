import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "../../../components/Layout";
import { Validator, TimeSeries } from "../../../lib/solana/types";
import { fetchValidator, fetchValidatorRankHistory, fetchValidatorVoteDistance, fetchValidatorRootDistance } from "../../../lib/solana/queries/validators";
import { toast } from "react-toastify";
import { SOLANA_LAMPORTS_PER_SOL } from "../../../lib/solana/constants";
import Link from "next/link";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer
} from "recharts";

const ValidatorVoteDistancePanel = ({ vote_pubkey }: { vote_pubkey: string }) => {
	const [voteDistance, setVoteDistance] = useState<TimeSeries | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadVoteDistance = async () => {
			if (!vote_pubkey) return;
			
			try {
				setLoading(true);
				const data = await fetchValidatorVoteDistance(vote_pubkey as string);
				// Convert values from negative to positive
				data.series = data.series.map(point => ({
					...point,
					_value: point._value * -1
				}));
				setVoteDistance(data);
			} catch (err) {
				setError("Failed to load vote distance");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadVoteDistance();
	}, [vote_pubkey]);

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-xl font-semibold mb-4">Vote Distance</h2>
			
			{loading && <div>Loading vote distance...</div>}
			
			{error && <div className="text-red-500">{error}</div>}
			
			{voteDistance && voteDistance.series.length > 0 && (
				<div className="w-full h-[200px]">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={voteDistance.series}
							margin={{
								top: 5,
								right: 5,
								left: -20,
								bottom: 5,
							}}
						>
							<XAxis
								dataKey="_time"
								tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							/>
							<YAxis />
							<Tooltip
								labelFormatter={(label) => new Date(label).toLocaleString()}
								formatter={(value: number) => [value.toFixed(2), 'Vote Distance']}
							/>
							<Line type="monotone" dataKey="_value" stroke="#8884d8" dot={false} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
};

const ValidatorRootDistancePanel = ({ vote_pubkey }: { vote_pubkey: string }) => {
	const [rootDistance, setRootDistance] = useState<TimeSeries | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadRootDistance = async () => {
			if (!vote_pubkey) return;
			
			try {
				setLoading(true);
				const data = await fetchValidatorRootDistance(vote_pubkey as string);
				// Convert values from negative to positive
				data.series = data.series.map(point => ({
					...point,
					_value: point._value * -1
				}));
				setRootDistance(data);
			} catch (err) {
				setError("Failed to load root distance");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadRootDistance();
	}, [vote_pubkey]);

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-xl font-semibold mb-4">Root Distance</h2>
			
			{loading && <div>Loading root distance...</div>}
			
			{error && <div className="text-red-500">{error}</div>}
			
			{rootDistance && rootDistance.series.length > 0 && (
				<div className="w-full h-[200px]">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={rootDistance.series}
							margin={{
								top: 5,
								right: 5,
								left: -20,
								bottom: 5,
							}}
						>
							<XAxis
								dataKey="_time"
								tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							/>
							<YAxis />
							<Tooltip
								labelFormatter={(label) => new Date(label).toLocaleString()}
								formatter={(value: number) => [value.toFixed(2), 'Root Distance']}
							/>
							<Line type="monotone" dataKey="_value" stroke="#82ca9d" dot={false} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
};


const ValidatorRankHistoryPanel = ({ vote_pubkey }: { vote_pubkey: string }) => {
	const [rankHistory, setRankHistory] = useState<TimeSeries | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadRankHistory = async () => {
			if (!vote_pubkey) return;
			
			try {
				setLoading(true);
				const data = await fetchValidatorRankHistory(vote_pubkey as string);
				setRankHistory(data);
			} catch (err) {
				setError("Failed to load rank history");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadRankHistory();
	}, [vote_pubkey]);

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-xl font-semibold mb-4">Rank History</h2>
			
			{loading && <div>Loading rank history...</div>}
			
			{error && <div className="text-red-500">{error}</div>}
			
			{rankHistory && rankHistory.series.length > 0 && (
				<div className="w-full h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={rankHistory.series}
							margin={{
								top: 5,
								right: 5,
								left: -20,
								bottom: 5,
							}}
						>
							<XAxis
								dataKey="_time"
								tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							/>
							<YAxis />
							<Tooltip
								labelFormatter={(label) => new Date(label).toLocaleString()}
								formatter={(value) => [`Rank: ${value}`, '']}
							/>
							<Line
								type="monotone"
								dataKey="_value"
								stroke="#8884d8"
								dot={false}
								name="Rank"
							/>
							{rankHistory.series.length > 0 && (
								<>
									<text
										x="50%"
										y="45%"
										textAnchor="middle"
										dominantBaseline="middle"
										className="text-2xl font-bold"
									>
										Current Rank: {rankHistory.series[rankHistory.series.length - 1]._value}
									</text>
									<text
										x="50%"
										y="55%"
										textAnchor="middle"
										dominantBaseline="middle"
										className={`text-lg ${
											rankHistory.series[0]._value > rankHistory.series[rankHistory.series.length - 1]._value
												? 'fill-green-500'
												: rankHistory.series[0]._value < rankHistory.series[rankHistory.series.length - 1]._value
												? 'fill-red-500' 
												: 'fill-gray-500'
										}`}
									>
										{rankHistory.series[0]._value === rankHistory.series[rankHistory.series.length - 1]._value
											? 'No change'
											: `${(-(rankHistory.series[0]._value - rankHistory.series[rankHistory.series.length - 1]._value) / rankHistory.series[0]._value * 100).toFixed(2)}% ${
												rankHistory.series[0]._value > rankHistory.series[rankHistory.series.length - 1]._value
													? '↓'
													: '↑'
											}`
										}
									</text>
								</>
							)}
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}

			{rankHistory && rankHistory.series.length === 0 && (
				<div className="text-gray-500">No rank history data available</div>
			)}
		</div>
	)
}

const ValidatorHeader = ({ vote_pubkey }: { vote_pubkey: string }) => {
	const [validator, setValidator] = useState<Validator | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadValidator = async () => {
			if (!vote_pubkey) return;

			try {
				setLoading(true);
				const data = await fetchValidator(vote_pubkey as string);
				setValidator(data);
			} catch (err) {
				setError("Failed to load validator details");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadValidator();
	}, [vote_pubkey]);

	const copy = async (text: string) => {
		await navigator.clipboard.writeText(text);
		toast.info("Address copied");
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
			<div className="flex flex-col sm:flex-row justify-between gap-8 mb-8">
				<div className="flex flex-col sm:flex-row items-center gap-4">
					{validator?.logo_url && (
						<img
							src={validator.logo_url}
							alt={`${validator.name} logo`}
							className="w-16 h-16 rounded-full"
						/>
					)}
					<div className="text-center sm:text-left">
						<h1 className="text-2xl font-bold">
							{(() => {
								if (loading) return "Loading...";
								if (error) return "Error loading validator";
								if (!validator) return "Validator not found";
								return validator.name || "Unknown Validator"})()
							}
						</h1>
						<p className="text-gray-600">
							Rank #{validator?.stats?.epoch_credits_rank || "N/A"}
						</p>
					</div>
				</div>
				{validator && (
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="text-center">
							<h2 className="text-sm font-semibold text-gray-600 mb-1">Vote Skip Rate</h2>
							<p className="text-lg font-medium">
								{validator.vote_skip_rate !== null
									? `${(validator.vote_skip_rate * 100).toFixed(2)}%`
									: "N/A"
								}
							</p>
						</div>
						<div className="text-center">
							<h2 className="text-sm font-semibold text-gray-600 mb-1">Active Stake</h2>
							<p className="text-lg font-medium">
								{(() => {
									const sol = validator.activated_stake / SOLANA_LAMPORTS_PER_SOL;
									if (sol >= 1e9) return `${(sol / 1e9).toFixed(2)}B`;
									if (sol >= 1e6) return `${(sol / 1e6).toFixed(2)}M`;
									if (sol >= 1e3) return `${(sol / 1e3).toFixed(2)}K`;
									return sol.toFixed(2);
								})()}
							</p>
						</div>
						<div className="text-center">
							<h2 className="text-sm font-semibold text-gray-600 mb-1">Commission</h2>
							<p className="text-lg font-medium">
								{validator.commission !== null
									? `${validator.commission}%`
									: "N/A"
								}
							</p>
						</div>
					</div>
				)}
			</div>
			{/* Details Grid */}
			{validator && !loading && !error && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Identity */}
				<div className="border rounded-lg p-4">
					<h2 className="text-sm font-semibold text-gray-600 mb-2">
						Identity
					</h2>
					<p
						className="text-gray-800 hover:cursor-pointer hover:text-blue-600 truncate"
						onClick={() => copy(validator.identity)}
						title={validator.identity}
					>
						{validator.identity}
					</p>
				</div>

				{/* Vote Pubkey */}
				<div className="border rounded-lg p-4">
					<h2 className="text-sm font-semibold text-gray-600 mb-2">
						Vote Account
					</h2>
					<p
						className="text-gray-800 hover:cursor-pointer hover:text-blue-600 truncate"
						onClick={() => copy(validator.vote_pubkey)}
						title={validator.vote_pubkey}
					>
						{validator.vote_pubkey}
					</p>
				</div>

				{/* Description */}
				<div className="border rounded-lg p-4">
					<h2 className="text-sm font-semibold text-gray-600 mb-2">
						Description
					</h2>
					<p className="text-gray-800">
						{validator.description || "No description available"}
					</p>
				</div>

				{/* Website */}
				<div className="border rounded-lg p-4">
					<h2 className="text-sm font-semibold text-gray-600 mb-2">
						Website
					</h2>
					{validator.website ? (
						<a
							href={validator.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline"
						>
							{validator.website}
						</a>
					) : (
						<p className="text-gray-800">No website available</p>
					)}
				</div>
			</div>)}
		</div>
	);
};

export default function ValidatorDetailsPage() {
	const params = useParams();
	const vote_pubkey = params?.vote_pubkey as string;

  return (
    <Layout
      title={`Validator - ${vote_pubkey}`}
      bannerTitle="Validator Details"
      chain="Solana"
    >
      <div className="container mx-auto px-4 py-8 mb-24">
        <div className="mb-6 ml-4">
          <Link
            href="/solana/validators"
            className="inline-flex items-center text-blue-500 hover:text-blue-700"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Validators</span>
          </Link>
        </div>

        <ValidatorHeader key={`header-${vote_pubkey}`} vote_pubkey={vote_pubkey} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ValidatorVoteDistancePanel key={`vote-${vote_pubkey}`} vote_pubkey={vote_pubkey} />
          <ValidatorRootDistancePanel key={`root-${vote_pubkey}`} vote_pubkey={vote_pubkey} />
        </div>
        
        <ValidatorRankHistoryPanel key={`rank-${vote_pubkey}`} vote_pubkey={vote_pubkey} />

      </div>
    </Layout>
  );
}