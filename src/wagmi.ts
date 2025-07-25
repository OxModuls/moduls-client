import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

// Sei Mainnet settings
const seiMainnet = {
  ...mainnet, // using mainnet as a base
  id: 1329,
  name: "Sei Mainnet",
  rpcUrls: {
    default: { http: ["https://evm-rpc.sei-apis.com"] },
  },
};

// Sei Testnet settings
const seiTestnet = {
  ...mainnet, // using mainnet as a base, then override
  id: 1328,
  name: "Sei Testnet",
  rpcUrls: {
    default: { http: ["https://evm-rpc-testnet.sei-apis.com"] },
  },
};

export const config = createConfig({
  chains: [seiMainnet, seiTestnet],
  connectors: [metaMask()],
  transports: {
    [seiMainnet.id]: http(),
    [seiTestnet.id]: http(),
  },
});
