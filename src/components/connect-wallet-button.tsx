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

import metamaskIcon from "../assets/icons/metamask.svg";
import trustwalletIcon from "../assets/icons/trustwallet.svg";
import avatarImage from "../assets/avatar.svg";
import {
  ellipsizeAddress,
  formatBigIntToUnits,
  writeToClipboard,
} from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

const connectorIcons = new Map<string, string>([
  ["metaMaskSDK", metamaskIcon],
  ["com.trustwallet.app", trustwalletIcon],
]);

const ConnectWalletButton = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom">
        <DrawerTrigger className="md:hidden cursor-pointer">
          <Trigger />
        </DrawerTrigger>
        <DrawerContent className="md:hidden">
          <DrawerHeader>
            <DrawerTitle className="sr-only">Connected Wallet</DrawerTitle>
            <DrawerDescription className="sr-only">
              Connected Wallet Details
            </DrawerDescription>
          </DrawerHeader>
          <Content onOpenChange={setDrawerOpen} />
          <DrawerFooter>
            <DrawerClose asChild>
              <button className="py-2 rounded-lg bg-accent">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger className="hidden md:block cursor-pointer">
          <Trigger />
        </PopoverTrigger>
        <PopoverContent className="hidden md:block mt-1 w-xs min-h-72 py-4 bg-background rounded-lg border z-10">
          <Content onOpenChange={setPopoverOpen} />
        </PopoverContent>
      </Popover>
    </>
  );
};

const Trigger = () => {
  const { isConnected, connector: activeConnector } = useAccount();

  if (isConnected)
    return (
      <div>
        <div className="relative">
          <img
            src={avatarImage}
            alt=""
            className="size-9 rounded-full border-2 border-accent"
          />
          <img
            src={
              activeConnector!.icon || connectorIcons.get(activeConnector!.id)
            }
            alt={activeConnector!.name + "logo"}
            className="size-6 rounded-full absolute bottom-0 right-0"
          />
        </div>
      </div>
    );

  return (
    <button className="px-3 py-2 bg-accent rounded-xl font-bold transition-all duration-500 hover:scale-105 cursor-pointer">
      Connect
    </button>
  );
};

const Content = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  const connectWallet = async (connector: Connector) => {
    try {
      connect(
        { connector: connector },
        {
          onSuccess: () => {
            toast.success("Connected wallet");
            onOpenChange(false);
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
          onOpenChange(false);
        },
      },
    );
  };

  const { data: walletBalance } = useBalance({ address });
  const formattedWalletBalance = !!walletBalance
    ? formatBigIntToUnits(walletBalance.value, walletBalance.decimals)
    : "-";

  if (isConnected)
    return (
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
          <button className="cursor-pointer mt-1" onClick={disconnectWallet}>
            <Power className="size-5" />
          </button>
        </div>
      </div>
    );

  return (
    <div className="px-4">
      <h2 className="w-full font-semibold text-center">Connect a wallet</h2>
      <div className="mt-4 flex flex-col gap-2">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connectWallet(connector)}
            className="w-full h-16 py-3 pl-4 border rounded-lg bg-primary-foreground cursor-pointer flex items-center gap-4 hover:border-accent hover:bg-accent/25 transition-all duration-200"
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
  );
};

export default ConnectWalletButton;
