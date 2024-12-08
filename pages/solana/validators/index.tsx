import { useEffect, useState, useCallback } from "react";
import { fetchValidators } from "../../../lib/solana/queries/validators";
import { Validator } from "../../../lib/solana/types";
import Layout from "../../../components/Layout";
import Table, {
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../../../components/Table";
import { toast } from "react-toastify";
import { SOLANA_LAMPORTS_PER_SOL } from "../../../lib/solana/constants";
import Link from "next/link";
type SortField = 'identity' | 'vote_pubkey' | 'commission' | 'activated_stake' | 'epoch_credits' | 'epoch_credits_rank' | 'name' | 'vote_skip_rate';
type SortDirection = 'asc' | 'desc';

export default function ValidatorStatsPage() {
  const [validators, setValidators] = useState<Validator[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('epoch_credits_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchValidators();
        setValidators(data);
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
    return address ? `${address.slice(0, 8)}...${address.slice(-4)}` : '';
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
    if (!validators) return [];

    const filtered = validators.filter(validator => 
      validator.identity.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      validator.vote_pubkey.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (validator.name || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    
    return [...filtered].sort((a, b) => {
      let aValue, bValue;
      if (sortField === 'epoch_credits') {
        aValue = a.stats?.epoch_credits;
        bValue = b.stats?.epoch_credits;
      } else if (sortField === 'epoch_credits_rank') {
        aValue = a.stats?.epoch_credits_rank;
        bValue = b.stats?.epoch_credits_rank;
      } else if (sortField === 'vote_pubkey') {
        aValue = a.vote_pubkey;
        bValue = b.vote_pubkey;
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      // Handle null values - always sort them last
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
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
          placeholder="Search by name, identity or vote account..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-24">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <Table>
            <TableHead>
              <TableRow>
                <TableColumn className="w-8">
                  Logo
                </TableColumn>
                <TableColumn 
                  onClick={() => handleSort('name')}
                  sorted={sortField === 'name'}
                  asc={sortDirection === 'asc'}
                  className="w-32 max-w-[200px]"
                  align="left"
                >
                  Name
                </TableColumn>
                <TableColumn 
                  onClick={() => handleSort('identity')}
                  sorted={sortField === 'identity'}
                  asc={sortDirection === 'asc'}
                  className="w-32"
                  align="left"
                >
                  Identity
                </TableColumn>
                <TableColumn 
                  onClick={() => handleSort('vote_pubkey')}
                  sorted={sortField === 'vote_pubkey'}
                  asc={sortDirection === 'asc'}
                  className="w-32"
                  align="left"
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
                <TableColumn 
                  className="w-24"
                  onClick={() => handleSort('vote_skip_rate')}
                  sorted={sortField === 'vote_skip_rate'}
                  asc={sortDirection === 'asc'}
                >
                  Skip Rate (%)
                </TableColumn>
              </TableRow>
            </TableHead>
            <TableBody loading={loading} rowCount={10} columnCount={9}>
              {!loading && getSortedValidators().map((validator) => (
                <TableRow key={validator.identity}>
                  <TableCell>
                    {validator.logo_url && (
                      <img 
                        src={validator.logo_url} 
                        alt={`${validator.name} logo`}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-left text-blue-500 hover:underline !font-bold">
                    <Link 
                      href={`/solana/validators/${validator.identity}`}
                    >
                      {validator.name || 'Unknown'}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left">
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
                  <TableCell className="text-left">
                    <div className="relative group">
                      <span
                        className="cursor-pointer"
                        onClick={() => copy(validator.vote_pubkey)}
                      >
                        {truncateAddress(validator.vote_pubkey)}
                      </span>
                      <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white p-1 rounded text-xs mt-1 ml-0">
                        {validator.vote_pubkey}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {validator.stats.epoch_credits_rank ?? '-'}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const sol = validator.activated_stake / SOLANA_LAMPORTS_PER_SOL;
                      if (sol >= 1e9) return `${(sol / 1e9).toFixed(2)}B`;
                      if (sol >= 1e6) return `${(sol / 1e6).toFixed(2)}M`;
                      if (sol >= 1e3) return `${(sol / 1e3).toFixed(2)}K`;
                      return sol.toFixed(2);
                    })()}
                  </TableCell>
                  <TableCell>
                    {validator.stats.epoch_credits?.toLocaleString() ?? '-'}
                  </TableCell>
                  <TableCell>{validator.commission}</TableCell>
                  <TableCell>{(validator.vote_skip_rate * 100).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {error && (
        <div className="flex justify-center items-center min-h-[200px] text-red-500">
          Error: {error}
        </div>
      )}
      {!loading && !validators && (
        <div className="flex justify-center items-center min-h-[200px]">
          No validator stats available
        </div>
      )}
    </div>
  );

  return (
    <Layout title="Validators" bannerTitle="Solana Validators">
      {renderTable()}
    </Layout>
  );
}
