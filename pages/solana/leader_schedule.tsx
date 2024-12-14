import { useEffect, useMemo, useState } from "react";
import { FixedSizeList as List } from 'react-window';
import Layout from "../../components/Layout";
import { fetchLeaderSchedule } from "../../lib/solana/queries/validators";
import { FullLeaderSchedule, LeaderSchedule, LeaderScheduleValidatorInfo } from "../../lib/solana/types";
import { SOLANA_LAMPORTS_PER_SOL } from "../../lib/solana/constants";
import { formatSol } from "../../utils/solana";
import Link from "next/link";

const ROW_HEIGHT = 48;
const MIN_WIDTH = 1000; // Added minimum width

type LeaderScheduleWithValidator = LeaderSchedule & { validator?: LeaderScheduleValidatorInfo };

const Row = ({ index, style, data }: { index: number; style: any; data: { schedules: LeaderSchedule[], validators: { [key: string]: LeaderScheduleValidatorInfo } } }) => {
	const schedule = data.schedules[index];
	const validator = schedule.validator_identity ? data.validators[schedule.validator_identity] : null;

	return (
		<div
			style={style}
			className={`flex items-start border-b border-gray-200 hover:bg-gray-50 min-w-[${MIN_WIDTH}px]`}
		>
			<div className="flex-1 px-6 py-2 whitespace-nowrap">
				{schedule.absolute_slot.toLocaleString()}
			</div>
			<div className="flex-1 px-6 py-2 whitespace-nowrap">
				{schedule.slot.toLocaleString()}
			</div>
			<div className="flex-1 px-6 py-2 whitespace-nowrap">
				{validator ? (
					<Link
						href={`/solana/validators/${validator.vote_pubkey}`}
						className="text-blue-500 hover:text-blue-700"
					>
						{validator.identity.slice(0, 8) + '...' + validator.identity.slice(-4)}
					</Link>
				) : 'N/A'}
			</div>
			<div className="flex-1 px-6 py-2 whitespace-nowrap">
				<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
					${schedule.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
						schedule.status === 'MISSED' ? 'bg-red-100 text-red-800' :
							'bg-yellow-100 text-yellow-800'}`}>
					{schedule.status}
				</span>
			</div>
			<div className="flex-1 px-6 py-2 whitespace-nowrap">
				{validator ? formatSol(validator.previous_epoch_stake) : 'N/A'}
			</div>
		</div>
	);
};

const LeaderSchedulePage = () => {
	const [leaderSchedule, setLeaderSchedule] = useState<FullLeaderSchedule | null>(null);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const loadLeaderSchedule = async () => {
			try {
				const data = await fetchLeaderSchedule();
				setLeaderSchedule(data);
			} catch (error) {
				console.error('Error loading leader schedule:', error);
			} finally {
				setLoading(false);
			}
		};

		loadLeaderSchedule();
	}, []);


	const summary = useMemo(() => {
		const validators = leaderSchedule?.validators ?? {};
		const validatorScheduleMap: { [key: string]: LeaderScheduleWithValidator[] } = {};
		const schedules: LeaderScheduleWithValidator[] = (leaderSchedule?.leader_schedule ?? []).map(schedule => {
			if (!schedule.validator_identity || !validators[schedule.validator_identity]) {
				return schedule;
			}
			return {
				...schedule,
				validator: validators[schedule.validator_identity]
			};
		});

		schedules.forEach(schedule => {
			if (schedule.validator) {
				if (!validatorScheduleMap[schedule.validator.vote_pubkey]) {
					validatorScheduleMap[schedule.validator.vote_pubkey] = [];
				}
				validatorScheduleMap[schedule.validator.vote_pubkey].push(schedule);
			}
		});

		const total = schedules.length;
		const confirmed = schedules.filter(s => s.status === 'CONFIRMED').length;
		const missed = schedules.filter(s => s.status === 'MISSED').length;
		const pending = schedules.filter(s => s.status === 'PENDING').length;

		const validatorStakes = Object.entries(validatorScheduleMap).filter(([_, schedules]) => schedules.length === 4).map(([_, schedules]) => {
			if (schedules[0]?.validator?.previous_epoch_stake) {
				return schedules[0].validator.previous_epoch_stake;
			}
			return 0;
		}).filter(stake => stake > 0);

		const minBlockValidatorStat = {
			count: validatorStakes.length,
			minStake: Math.min(...validatorStakes),
			maxStake: Math.max(...validatorStakes),
			avgStake: validatorStakes.reduce((a, b) => a + b, 0) / validatorStakes.length,
		}

		return {
			overall: {
				total,
				confirmed,
				missed,
				pending,
				confirmedPercentage: total ? ((confirmed / total) * 100).toFixed(1) : '0',
				missedPercentage: total ? ((missed / total) * 100).toFixed(1) : '0',
				pendingPercentage: total ? ((pending / total) * 100).toFixed(1) : '0'
			},
			minBlock: minBlockValidatorStat,
		};
	}, [leaderSchedule]);

	const filteredSchedule = leaderSchedule ? leaderSchedule.leader_schedule.filter(schedule => {
		const validator = schedule.validator_identity ? leaderSchedule.validators[schedule.validator_identity] : null;
		return schedule.slot.toString() === searchTerm ||
			schedule.absolute_slot.toString() === searchTerm ||
			(validator && (
				validator.vote_pubkey.toLowerCase().includes(searchTerm.toLowerCase()) ||
				validator.identity.toLowerCase().includes(searchTerm.toLowerCase())
			));
	}) : [];

	return (
		<Layout title="Leader Schedule" bannerTitle="Leader Schedule" chain="Solana">
			<div className="container mx-auto px-4 py-8 overflow-x-auto mb-16">
				{/* Summary Section */}
				<div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Overall Stats */}
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Overall Statistics</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500">Total Slots</p>
								<p className="text-2xl font-semibold">{summary.overall.total.toLocaleString()}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Confirmed</p>
								<p className="text-2xl font-semibold text-green-600">
									{summary.overall.confirmed.toLocaleString()} ({summary.overall.confirmedPercentage}%)
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Missed</p>
								<p className="text-2xl font-semibold text-red-600">
									{summary.overall.missed.toLocaleString()} ({summary.overall.missedPercentage}%)
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Pending</p>
								<p className="text-2xl font-semibold text-yellow-600">
									{summary.overall.pending.toLocaleString()} ({summary.overall.pendingPercentage}%)
								</p>
							</div>
						</div>
					</div>

					{/* Validator Stats */}
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Validator With Minimum Blocks</h3>
						<p className="text-sm text-gray-600 mb-4">Shows statistics for validators that have been assigned the minimum number of leader slots (4 blocks) in the current schedule. These validators typically have lower stake amounts.</p>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500">Validators with 4 Blocks</p>
								<p className="text-2xl font-semibold">{summary.minBlock.count}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Average Stake</p>
								<p className="text-2xl font-semibold">{formatSol(summary.minBlock.avgStake)}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Min Stake</p>
								<p className="text-2xl font-semibold">{formatSol(summary.minBlock.minStake)}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Max Stake</p>
								<p className="text-2xl font-semibold">{formatSol(summary.minBlock.maxStake)}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Search and filter inputs */}
				<div className="flex gap-4 mb-4">
					<div className="flex-1">
						<input
							type="text"
							placeholder="Search by slot, slot index or validator identity/vote account..."
							className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{/* Filtered Stats */}
				{filteredSchedule.length > 0 && (
					<div className="bg-white rounded-lg shadow p-6 mb-4">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Filtered Results Statistics</h3>
						<div className="grid grid-cols-3 gap-4">
							<div>
								<p className="text-sm text-gray-500">Total Slots</p>
								<p className="text-2xl font-semibold">
									{filteredSchedule.length.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Unique Validators</p>
								<p className="text-2xl font-semibold">
									{new Set(filteredSchedule.map(s => s.validator_identity)).size.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Average Validator Stake</p>
								<p className="text-2xl font-semibold">
									{formatSol(
										filteredSchedule.reduce((acc, slot) =>
											acc + (slot.validator_identity && leaderSchedule?.validators[slot.validator_identity]?.previous_epoch_stake || 0), 0
										) / new Set(filteredSchedule.map(s => s.validator_identity)).size
									)}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Confirmed</p>
								<p className="text-2xl font-semibold text-green-600">
									{filteredSchedule.filter(s => s.status === 'CONFIRMED').length.toLocaleString()} (
									{((filteredSchedule.filter(s => s.status === 'CONFIRMED').length / filteredSchedule.length) * 100).toFixed(1)}%)
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Missed</p>
								<p className="text-2xl font-semibold text-red-600">
									{filteredSchedule.filter(s => s.status === 'MISSED').length.toLocaleString()} (
									{((filteredSchedule.filter(s => s.status === 'MISSED').length / filteredSchedule.length) * 100).toFixed(1)}%)
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Pending</p>
								<p className="text-2xl font-semibold text-yellow-600">
									{filteredSchedule.filter(s => s.status === 'PENDING').length.toLocaleString()} (
									{((filteredSchedule.filter(s => s.status === 'PENDING').length / filteredSchedule.length) * 100).toFixed(1)}%)
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Virtualized Table */}
				<div className={`bg-white rounded-lg shadow overflow-hidden min-w-[${MIN_WIDTH}px]`}>
					{/* Table Header */}
					<div className={`flex bg-gray-50 border-b border-gray-200 min-w-[${MIN_WIDTH}px]`}>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Slot
						</div>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Slot Index
						</div>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Validator Identity
						</div>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</div>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Previous Epoch Stake
						</div>
					</div>

					{/* Table Body */}
					{loading ? (
						<div className={`px-6 py-4 text-center min-w-[${MIN_WIDTH}px]`}>Loading...</div>
					) : filteredSchedule.length > 0 ? (
						<List
							height={600}
							itemCount={filteredSchedule.length}
							itemSize={ROW_HEIGHT}
							width="100%"
							itemData={{
								schedules: filteredSchedule,
								validators: leaderSchedule?.validators || {}
							}}
						>
							{Row}
						</List>
					) : (
						<div className={`px-6 py-4 text-center min-w-[${MIN_WIDTH}px]`}>No results found</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default LeaderSchedulePage;
