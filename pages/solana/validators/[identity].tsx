import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { Validator } from "../../../lib/solana/types";
import { fetchValidator } from "../../../lib/solana/queries/validators";
import { toast } from "react-toastify";

export default function ValidatorDetailsPage() {
  const router = useRouter();
  const { identity } = router.query;
  const [validator, setValidator] = useState<Validator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadValidator = async () => {
      if (!identity) return;
      
      try {
        setLoading(true);
        const data = await fetchValidator(identity as string);
        setValidator(data);
      } catch (err) {
        setError("Failed to load validator details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadValidator();
  }, [identity]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.info("Address copied");
  };

  if (loading) {
    return (
      <Layout title="Validator Details" bannerTitle="Validator Details">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !validator) {
    return (
      <Layout title="Validator Details" bannerTitle="Validator Details">
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500">{error || "Validator not found"}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`Validator - ${validator.name || validator.identity}`} 
      bannerTitle="Validator Details"
    >
      <div className="container mx-auto px-4 py-8 mb-24">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            {validator.logo_url && (
              <img 
                src={validator.logo_url} 
                alt={`${validator.name} logo`}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {validator.name || "Unknown Validator"}
              </h1>
              <p className="text-gray-600">
                Rank #{validator.stats?.epoch_credits_rank || "N/A"}
              </p>
            </div>
          </div>
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity */}
            <div className="border rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-600 mb-2">
                Identity
              </h2>
              <p 
                className="text-gray-800 hover:cursor-pointer hover:text-blue-600" 
                onClick={() => copy(validator.identity)}
                title="Click to copy"
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
                className="text-gray-800 hover:cursor-pointer hover:text-blue-600"
                onClick={() => copy(validator.vote_pubkey)}
                title="Click to copy"
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
          </div>
        </div>

        
      </div>
    </Layout>
  );
} 