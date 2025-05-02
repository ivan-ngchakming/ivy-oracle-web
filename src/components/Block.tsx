import CustomPortableText from "./PortableText";

type BlockProps = {
  block: {
    style: string;
    _key: string;
    markDefs: any[];
    children: any[];
    _type: string;
  };
  index: number;
};

export default function Block({ block }: BlockProps) {
  return (
    <CustomPortableText value={[block]} />
  );
}
