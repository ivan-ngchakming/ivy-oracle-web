import { useEffect, useState } from "react";
import { fetchValidatorStats } from "../../lib/solana/queries/validators";
import { ValidatorStats } from "../../lib/solana/types";
import Layout from "../../components/Layout";
import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../../components/Table";
import { toast } from "react-toastify";

type SortField = 'identity' | 'vote_account' | 'commission' | 'activated_stake' | 'epoch_credits' | 'epoch_credits_rank';
type SortDirection = 'asc' | 'desc';

export default function ValidatorStatsPage() {
  const [stats, setStats] = useState<ValidatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('epoch_credits_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchValidatorStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load validator stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.info("Address copied");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedValidators = () => {
    if (!stats) return [];
    
    const filtered = stats.stats.filter(validator => 
      validator.identity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      validator.vote_account.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  };

  const renderTable = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by identity or vote account..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-24">
        <Table>
          <TableHead>
            <TableRow>
              <TableColumn 
                onClick={() => handleSort('identity')}
                sorted={sortField === 'identity'}
                asc={sortDirection === 'asc'}
                className="w-32"
              >
                Identity
              </TableColumn>
              <TableColumn 
                onClick={() => handleSort('vote_account')}
                sorted={sortField === 'vote_account'}
                asc={sortDirection === 'asc'}
                className="w-32"
              >
                Vote Account
              </TableColumn>
              <TableColumn 
                className="w-24"
                onClick={() => handleSort('epoch_credits_rank')}
                sorted={sortField === 'epoch_credits_rank'}
                asc={sortDirection === 'asc'}
              >
                Credits Rank
              </TableColumn>
              <TableColumn 
                onClick={() => handleSort('activated_stake')}
                sorted={sortField === 'activated_stake'}
                asc={sortDirection === 'asc'}
              >
                Activated Stake
              </TableColumn>
              <TableColumn 
                onClick={() => handleSort('epoch_credits')}
                sorted={sortField === 'epoch_credits'}
                asc={sortDirection === 'asc'}
              >
                Epoch Credits
              </TableColumn>
              <TableColumn 
                className="w-24"
                onClick={() => handleSort('commission')}
                sorted={sortField === 'commission'}
                asc={sortDirection === 'asc'}
              >
                Commission (%)
              </TableColumn>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedValidators().map((validator) => (
              <TableRow key={validator.identity}>
                <TableCell>
                  <div className="relative group">
                    <span 
                      className="cursor-pointer"
                      onClick={() => copy(validator.identity)}
                    >
                      {truncateAddress(validator.identity)}
                    </span>
                    <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white p-1 rounded text-xs mt-1 ml-0">
                      {validator.identity}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative group">
                    <span
                      className="cursor-pointer"
                      onClick={() => copy(validator.vote_account)}
                    >
                      {truncateAddress(validator.vote_account)}
                    </span>
                    <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white p-1 rounded text-xs mt-1 ml-0">
                      {validator.vote_account}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {validator.epoch_credits_rank}
                </TableCell>
                <TableCell>
                  {validator.activated_stake.toLocaleString()}
                </TableCell>
                <TableCell>
                  {validator.epoch_credits.toLocaleString()}
                </TableCell>
                <TableCell>{validator.commission}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout title="Validators" bannerTitle="Solana Validators">
        {renderTable()}
        <div className="flex justify-center items-center min-h-[200px]">
          Loading validator stats...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Validators" bannerTitle="Solana Validators">
        {renderTable()}
        <div className="flex justify-center items-center min-h-[200px] text-red-500">
          Error: {error}
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout title="Validators" bannerTitle="Solana Validators">
        {renderTable()}
        <div className="flex justify-center items-center min-h-[200px]">
          No validator stats available
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Validators" bannerTitle="Solana Validators">
      {renderTable()}
    </Layout>
  );
}
