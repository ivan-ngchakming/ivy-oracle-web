import { useEffect, useState } from "react";
import { FixedSizeList as List } from 'react-window';
import Layout from "../../components/Layout";
import { fetchLeaderSchedule } from "../../lib/solana/queries/validators";
import { FullLeaderSchedule, LeaderSchedule, LeaderScheduleValidatorInfo } from "../../lib/solana/types";
import { SOLANA_LAMPORTS_PER_SOL } from "../../lib/solana/constants";
import { formatSol } from "../../utils/solana";
import Link from "next/link";

const ROW_HEIGHT = 48;
const MIN_WIDTH = 1000; // Added minimum width

const Row = ({ index, style, data }: { index: number; style: any; data: { schedules: LeaderSchedule[], validators: { [key: string]: LeaderScheduleValidatorInfo } } }) => {
	const schedule = data.schedules[index];
	const validator = schedule.validator_identity ? data.validators[schedule.validator_identity] : null;

	return (
		<div 
			style={style} 
			className={`flex items-center border-b border-gray-200 hover:bg-gray-50 min-w-[${MIN_WIDTH}px]`}
		>
			<div className="flex-1 px-6 py-2 whitespace-nowrap">
				{schedule.slot.toLocaleString()}
			</div>
			<div className="flex-1 px-6 py-2 whitespace-nowrap">
				{validator ? (
					<Link 
						href={`/solana/validators/${validator.vote_pubkey}`}
						className="text-blue-500 hover:text-blue-700"
					>
						{validator.identity.slice(0, 8) + '...' + validator.identity.slice(-8)}
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

	const filteredSchedule = leaderSchedule ? leaderSchedule.leader_schedule.filter(schedule =>
		schedule.slot.toString().includes(searchTerm)
	) : [];

	return (
		<Layout title="Leader Schedule" bannerTitle="Leader Schedule" chain="Solana">
			<div className="container mx-auto px-4 py-8 overflow-x-auto">
				{/* Search input */}
				<div className="mb-4">
					<input
						type="text"
						placeholder="Search by slot..."
						className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				{/* Virtualized Table */}
				<div className={`bg-white rounded-lg shadow overflow-hidden min-w-[${MIN_WIDTH}px]`}>
					{/* Table Header */}
					<div className={`flex bg-gray-50 border-b border-gray-200 min-w-[${MIN_WIDTH}px]`}>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Slot
						</div>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Validator Identity
						</div>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</div>
						<div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Stake
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
