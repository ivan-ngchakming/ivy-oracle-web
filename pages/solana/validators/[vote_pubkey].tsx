import DOMPurify from 'dompurify';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
import { SOLANA_LAMPORTS_PER_SOL } from "../../../lib/solana/constants";
import { fetchValidator, fetchValidatorLeaderSchedule, fetchValidatorRankHistory, fetchValidatorRootDistance, fetchValidatorVoteDistance, fetchValidatorVotes } from "../../../lib/solana/queries/validators";
import { LeaderSchedule, TimeSeries, Validator, Vote, VotesData } from "../../../lib/solana/types";

import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
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
								return (
									<span
										dangerouslySetInnerHTML={{
											__html: validator.name ? 
												DOMPurify.sanitize(decodeURIComponent(escape(validator.name))) :
												'Unknown Validator'
										}}
									/>
								);
							})()}
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
						<span
							dangerouslySetInnerHTML={{
								__html: validator.description ? 
									DOMPurify.sanitize(decodeURIComponent(escape(validator.description))) :
									"No description available"
							}}
						/>
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

const ValidatorVotesPanel = ({ vote_pubkey }: { vote_pubkey: string }) => {
	const [votesData, setVotesData] = useState<VotesData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!vote_pubkey) return;

			try {
				setIsLoading(true);
				const data = await fetchValidatorVotes(vote_pubkey);
				setVotesData(data);
				setError(null);
			} catch (err) {
				setError(err as Error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [vote_pubkey]);

	const votes = votesData?.votes || [];
	const avgLatency = votes.reduce((sum: number, vote: Vote) => sum + vote.latency, 0) / votes.length;
	const maxLatency = Math.max(...votes.map((vote: Vote) => vote.latency));
	const minLatency = Math.min(...votes.map((vote: Vote) => vote.latency));

	return (
		<div className="border bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-xl font-semibold mb-4">Vote Latency</h2>
			
			<div className="grid grid-cols-3 gap-4 mb-6">
				<div className="bg-gray-50 p-4 rounded-lg">
					<p className="text-sm text-gray-600">Average Latency</p>
					<p className="text-lg font-semibold text-gray-800">{isLoading ? "Loading..." : avgLatency.toFixed(2) + " slots"}</p>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg">
					<p className="text-sm text-gray-600">Max Latency</p>
					<p className="text-lg font-semibold text-gray-800">{isLoading ? "Loading..." : maxLatency + " slots"}</p>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg">
					<p className="text-sm text-gray-600">Min Latency</p>
					<p className="text-lg font-semibold text-gray-800">{isLoading ? "Loading..." : minLatency + " slots"}</p>
				</div>
			</div>

			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart 
						data={votes}
						margin={{
							top: 35,
							right: 35,
							left: 35,
							bottom: 45
						}}
					>
						<XAxis 
							dataKey="slot" 
							type="number"
							domain={['auto', 'auto']}
							tickFormatter={(value) => value.toLocaleString()}
							angle={-25}
							dy={35}
							dx={-40}
						/>
						<YAxis 
							dataKey="latency"
							label={{ value: 'Latency (slots)', angle: -90, position: 'insideLeft' }}
							domain={[1, 'auto']}
						/>
						<Tooltip
							formatter={(value: any) => [`${value} slots`, 'Latency']}
							labelFormatter={(label) => `Slot ${label.toLocaleString()}`}
						/>
						<Line 
							type="monotone" 
							dataKey="latency" 
							stroke="#6366f1" 
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

const ValidatorLeaderSchedulePanel = ({ vote_pubkey }: { vote_pubkey: string }) => {
	const [leaderSchedule, setLeaderSchedule] = useState<LeaderSchedule[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadLeaderSchedule = async () => {
			if (!vote_pubkey) return;
			
			try {
				const data = await fetchValidatorLeaderSchedule(vote_pubkey);
				setLeaderSchedule(data);
			} catch (error) {
				console.error('Error loading leader schedule:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadLeaderSchedule();
	}, [vote_pubkey]);

	const getScheduleSummary = () => {
		const total = leaderSchedule.length;
		const confirmed = leaderSchedule.filter(s => s.status === 'CONFIRMED').length;
		const missed = leaderSchedule.filter(s => s.status === 'MISSED').length;
		const pending = leaderSchedule.filter(s => s.status === 'PENDING').length;

		return {
			total,
			confirmed,
			missed,
			pending,
			confirmedRate: total ? ((confirmed / total) * 100).toFixed(1) : '0',
			missedRate: total ? ((missed / total) * 100).toFixed(1) : '0',
			pendingRate: total ? ((pending / total) * 100).toFixed(1) : '0'
		};
	};

	return (
		<div className="border bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-xl font-semibold mb-4">Leader Schedule</h2>

			{isLoading ? (
				<div className="flex justify-center items-center h-48">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
				</div>
			) : leaderSchedule && leaderSchedule.length > 0 ? (
				<div>
					<div className="grid lg:grid-cols-4 gap-4 mb-6 grid-cols-2">
						<div className="bg-gray-50 p-4 rounded-lg">
							<p className="text-sm text-gray-600">Total Slots</p>
							<p className="text-lg font-semibold text-gray-800">{getScheduleSummary().total}</p>
						</div>
						<div className="bg-green-50 p-4 rounded-lg">
							<p className="text-sm text-green-600">Confirmed</p>
							<p className="text-lg font-semibold text-green-800">
								{getScheduleSummary().confirmed} ({getScheduleSummary().confirmedRate}%)
							</p>
						</div>
						<div className="bg-red-50 p-4 rounded-lg">
							<p className="text-sm text-red-600">Missed</p>
							<p className="text-lg font-semibold text-red-800">
								{getScheduleSummary().missed} ({getScheduleSummary().missedRate}%)
							</p>
						</div>
						<div className="bg-yellow-50 p-4 rounded-lg">
							<p className="text-sm text-yellow-600">Pending</p>
							<p className="text-lg font-semibold text-yellow-800">
								{getScheduleSummary().pending} ({getScheduleSummary().pendingRate}%)
							</p>
						</div>
					</div>
					<div className="overflow-x-auto h-[200px]">
						<table className="min-w-full">
							<thead className="sticky top-0 bg-white">
								<tr>
									<th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Slot Index</th>
									<th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Slot</th>
									<th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
								</tr>
							</thead>
							<tbody>
								{leaderSchedule.map((schedule: LeaderSchedule, index: number) => (
									<tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
										<td className="px-4 py-2 text-sm">{schedule.slot.toLocaleString()}</td>
										<td className="px-4 py-2 text-sm">{schedule.absolute_slot.toLocaleString()}</td>
										<td className="px-4 py-2">
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
												${schedule.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
													schedule.status === 'MISSED' ? 'bg-red-100 text-red-800' :
														'bg-yellow-100 text-yellow-800'}`}>
												{schedule.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<p className="text-gray-500 text-center py-8">No leader schedule data available</p>
			)}
		</div>
	);
}

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
			<ValidatorVotesPanel key={`votes-${vote_pubkey}`} vote_pubkey={vote_pubkey} />
			<ValidatorLeaderSchedulePanel key={`leader-schedule-${vote_pubkey}`} vote_pubkey={vote_pubkey} />
		</div>
        
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ValidatorVoteDistancePanel key={`vote-${vote_pubkey}`} vote_pubkey={vote_pubkey} />
          <ValidatorRootDistancePanel key={`root-${vote_pubkey}`} vote_pubkey={vote_pubkey} />
        </div>
        
        <ValidatorRankHistoryPanel key={`rank-${vote_pubkey}`} vote_pubkey={vote_pubkey} />

      </div>
    </Layout>
  );
}