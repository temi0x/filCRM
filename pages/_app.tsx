import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  filecoin,
  base,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "filCRM",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [mainnet, filecoin, polygon, optimism, arbitrum, base],
  ssr: true,
});

export default function App({ Component, pageProps }: AppProps) {
  return <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        coolMode
        theme={lightTheme({
          accentColor: "#ff5555",
        })}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>;
}
