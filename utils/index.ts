export * from "./address";
export * from "./tokens";

export function range(start: number, end: number) {
  return (
    Array(end - start + 1)
      // @ts-ignore
      .fill()
      .map((_, idx) => start + idx)
  );
}
