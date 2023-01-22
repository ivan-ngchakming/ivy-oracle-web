import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import Table, {
  TableBody,
  TableCell,
  TableRow,
} from "../../../components/Table";
import { fetchBlock } from "../../../lib/queries/explorer";
import { EthBlock } from "../../../lib/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const block = await fetchBlock(Number(context.query.blockNumber));

  return {
    props: {
      block,
    },
  };
};

const Page = ({ block }: { block: EthBlock | null }) => {
  const { query } = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <Layout
      title={`Block ${query.blockNumber}`}
      bannerTitle={`Block ${query.blockNumber}`}
    >
      <div className="m-5 lg:m-28 mb-40">
        {block ? (
          <Table className="sm:table">
            <TableBody className="text-left">
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>{block.blockNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell>{block.blockHash}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>
                  {hydrated && new Date(block.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p className="text-center">Block not yet indexed</p>
        )}
      </div>
    </Layout>
  );
};

export default Page;
