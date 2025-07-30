import { useState } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  type Connector,
} from "wagmi";
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
import { Copy, Power } from "lucide-react";
import { useIsMobile } from "@/hooks";

import metamaskIcon from "../assets/icons/metamask.svg";
import trustwalletIcon from "../assets/icons/trustwallet.svg";
import avatarImage from "../assets/avatar.svg";
import {
  ellipsizeAddress,
  formatBigIntToUnits,
  writeToClipboard,
} from "@/lib/utils";
import { toast } from "sonner";

const connectorIcons = new Map<string, string>([
  ["metaMaskSDK", metamaskIcon],
  ["com.trustwallet.app", trustwalletIcon],
]);

const ConnectWalletButton = () => {
  const isMobile = useIsMobile();
  const { connect, connectors } = useConnect();
  8;
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const connectWallet = async (connector: Connector) => {
    try {
      connect(
        { connector: connector },
        {
          onSuccess: () => {
            toast.success("Connected wallet");
            setDrawerOpen(false);
          },
        },
      );
    } catch (err) {
      console.error("Failed to connect:", err);
      toast.error("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    disconnect(
      {},
      {
        onSuccess: () => {
          toast.success("Disconnected wallet");
          setDrawerOpen(false);
        },
      },
    );
  };

  const { data: walletBalance } = useBalance({ address });
  const formattedWalletBalance = !!walletBalance
    ? formatBigIntToUnits(walletBalance.value, walletBalance.decimals)
    : "-";

  return (
    <>
      {isConnected ? (
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          direction={isMobile ? "bottom" : "right"}
        >
          <DrawerTrigger className="cursor-pointer">
            <div>
              <div className="relative">
                <img
                  src={avatarImage}
                  alt=""
                  className="size-9 rounded-full border-2 border-accent"
                />
                <img
                  src={
                    activeConnector!.icon ||
                    connectorIcons.get(activeConnector!.id)
                  }
                  alt={activeConnector!.name + "logo"}
                  className="size-6 rounded-full absolute bottom-0 right-0"
                />
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="md:w-sm md:max-h-96 md:mt-16 md:mb-auto md:border-y md:rounded-l-lg">
            <DrawerHeader>
              <DrawerTitle className="sr-only">Connected Wallet</DrawerTitle>
              <DrawerDescription className="sr-only">
                Connected Wallet Details
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={avatarImage}
                      alt=""
                      className="size-12 rounded-full border-2 border-accent"
                    />
                    <img
                      src={
                        activeConnector!.icon ||
                        connectorIcons.get(activeConnector!.id)
                      }
                      alt={activeConnector!.name + "logo"}
                      className="size-6 rounded-full absolute bottom-0 right-0"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className=" font-medium">
                        {ellipsizeAddress(address!, 7, 7)}
                      </span>
                      <button
                        className="cursor-pointer"
                        onClick={() => writeToClipboard(address!)}
                      >
                        <Copy className="size-5" />
                      </button>
                    </div>
                    <div className="px-2 py-0.5 rounded-lg bg-neutral-800 font-medium">
                      <span>{formattedWalletBalance}</span> <span>SEI</span>
                    </div>
                  </div>
                </div>
                <button
                  className="cursor-pointer mt-1"
                  onClick={disconnectWallet}
                >
                  <Power className="size-5" />
                </button>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <button className="py-2 rounded-lg bg-accent">Close</button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          direction={isMobile ? "bottom" : "right"}
        >
          <DrawerTrigger asChild>
            <button className="px-3 py-2 bg-accent rounded-xl font-bold transition-all duration-500 hover:scale-105 cursor-pointer">
              Connect
            </button>
          </DrawerTrigger>
          <DrawerContent className="md:w-sm md:max-h-96 md:mt-16 md:mb-auto md:border-y md:rounded-l-lg">
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
                    className="w-full h-16 py-3 pl-4 border rounded-lg bg-primary-foreground cursor-pointer flex items-center gap-4 hover:border-accent hover:bg-red-950 transition-all duration-200"
                  >
                    <img
                      src={connector.icon || connectorIcons.get(connector.id)}
                      alt={`${connector.name} icon`}
                      className="size-10"
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
      )}
    </>
  );
};

export default ConnectWalletButton;
