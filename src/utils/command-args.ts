const MAX_COMMAND_QUANTITY = 1_000_000_000;

export interface QuantityArgs {
  item: string;
  quantity: number;
}

export function parseQuantity(args: string[], defaultItem: string): QuantityArgs | null {
  if (args.length === 0) return { item: defaultItem, quantity: 1 };
  if (args.length === 1) {
    const maybeNumber = Number(args[0]);
    if (Number.isSafeInteger(maybeNumber) && maybeNumber > 0 && maybeNumber <= MAX_COMMAND_QUANTITY) return { item: defaultItem, quantity: maybeNumber };
    return { item: args[0]!.toLowerCase(), quantity: 1 };
  }

  const item = args[0]!.toLowerCase();
  const quantity = Number(args[1]);
  if (!Number.isSafeInteger(quantity) || quantity <= 0 || quantity > MAX_COMMAND_QUANTITY) return null;
  return { item, quantity };
}
