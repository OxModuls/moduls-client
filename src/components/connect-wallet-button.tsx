import { useState } from "react";
import { useConnect, type Connector } from "wagmi";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import metamaskIcon from "../assets/icons/metamask.svg";
import trustwalletIcon from "../assets/icons/trustwallet.svg";

// map connector icons
const connectorIcons = new Map<string, string>([
  ["metaMaskSDK", metamaskIcon],
  ["com.trustwallet.app", trustwalletIcon],
]);

const ConnectWalletButton = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const { connect, connectors } = useConnect();

  const connectWallet = async (connector: Connector) => {
    try {
      connect({ connector: connector });
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <button
            onClick={() => setShowWalletOptions(!showWalletOptions)}
            className="px-3 py-2 bg-accent rounded-xl font-bold transition-all duration-500 hover:scale-105"
          >
            Connect
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Connect a wallet</DrawerTitle>
            <DrawerDescription className="sr-only">
              Choose a wallet to connect
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <div className="flex flex-col gap-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connectWallet(connector)}
                  className="w-full h-16 py-3 pl-4 border rounded-lg bg-primary-foreground cursor-pointer flex items-center gap-4 hover:border-accent hover:bg-red-950"
                >
                  <img
                    src={connector.icon || connectorIcons.get(connector.id)}
                    alt={`${connector.name} icon`}
                    className="size-5"
                  />
                  <span>{connector.name}</span>
                </button>
              ))}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <button className="py-2 rounded-lg bg-accent">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ConnectWalletButton;
