import { Fragment, useState } from "react";
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
import { BriefcaseBusiness, Camera, Copy, Power, User } from "lucide-react";

import metamaskIcon from "../assets/icons/metamask.svg";
import trustwalletIcon from "../assets/icons/trustwallet.svg";
import avatarImage from "../assets/avatar.svg";
import {
  ellipsizeAddress,
  formatBigIntToUnits,
  writeToClipboard,
} from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import pepeImg from "../assets/images/pepe1.png";

const connectorIcons = new Map<string, string>([
  ["metaMaskSDK", metamaskIcon],
  ["com.trustwallet.app", trustwalletIcon],
]);

const ConnectWalletButton = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      {/* use drawer on mobile*/}
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        autoFocus={drawerOpen}
        direction="bottom"
      >
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

      {/* use popover on desktop */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger className="hidden md:block cursor-pointer z-20">
          <Trigger />
        </PopoverTrigger>
        <div
          className={`fixed inset-0 bg-black/50 ${popoverOpen ? "" : "hidden"} z-10`}
        />
        <PopoverContent className="hidden md:block mt-1 w-xs py-4 bg-background rounded-lg border z-10">
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
            className="size-11 rounded-full border-2 border-accent"
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
    <div className="px-3 py-2 bg-accent rounded-xl font-bold transition-all duration-500 hover:scale-105 cursor-pointer">
      Connect
    </div>
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
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);

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

  const menuItems = [
    {
      title: "Profile",
      icon: User,
      onClick: () => setProfileDialogOpen((prev) => !prev),
    },
    {
      title: "Portfolio",
      icon: BriefcaseBusiness,
      onClick: () => setPortfolioDialogOpen((prev) => !prev),
    },
    { title: "Disconnect", icon: Power, onClick: disconnectWallet },
  ];

  if (isConnected)
    return (
      <div className="px-4 md:px-0">
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
        </div>

        <Separator className="mt-4" />

        <div className="py-2 flex flex-col gap-1">
          {menuItems.map((item, idx, items) => (
            <Fragment key={idx}>
              <button
                key={idx}
                className="w-full px-2 py-2 flex items-center gap-4 hover:bg-neutral-800 rounded-lg cursor-pointer"
                onClick={item.onClick}
              >
                <item.icon className="size-6" />
                <span className="">{item.title}</span>
              </button>
              {idx + 1 < items.length && <Separator className="" />}
            </Fragment>
          ))}
        </div>

        <ProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
        />

        <PortfolioDialog
          open={portfolioDialogOpen}
          onOpenChange={setPortfolioDialogOpen}
        />
      </div>
    );

  return (
    <div className="px-4 md:px-0">
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

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={true} className="md:w-sm">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Update your profile
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-2">
          <div className="w-full flex justify-center">
            <div className="relative">
              <div className="size-24 rounded-full border-2 border-accent" />
              <Camera className="size-6 absolute right-1 bottom-1" />
            </div>
          </div>
          <div className="">
            <label htmlFor="bio" className="ml-1 font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              placeholder="Describe yourself"
              className="mt-1"
            />
            <button className="mt-2 px-3 py-1 bg-accent font-semibold rounded-md cursor-pointer">
              Save
            </button>
          </div>

          <p className="mt-4 text-lg font-medium">Social Links</p>
          <div className="flex flex-col gap-4">
            <div className="">
              <label
                htmlFor="x"
                className="ml-1 font-medium flex items-center gap-2"
              >
                <FaXTwitter />
                <span>X/Twitter</span>
              </label>
              <div className="mt-1 w-full flex items-center gap-2">
                <Input id="x" placeholder="X URL" className="" />
                <button className="px-3 py-1 bg-accent font-semibold rounded-md cursor-pointer">
                  Save
                </button>
              </div>
            </div>
            <div className="">
              <label
                htmlFor="telegram"
                className="ml-1 font-medium flex items-center gap-2"
              >
                <FaTelegram />
                <span>Telegram</span>
              </label>
              <div className="mt-1 w-full flex items-center gap-2">
                <Input id="telegram" placeholder="X URL" className="" />
                <button className="px-3 py-1 bg-accent font-semibold rounded-md cursor-pointer">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="h-4"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type PortfolioDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const PortfolioDialog = ({ open, onOpenChange }: PortfolioDialogProps) => {
  const tokenHoldings = [
    {
      id: "sei-mainnet", // Unique identifier for the holding
      tokenName: "SEI",
      symbol: "SEI",
      amount: 0.87654321,
      usdPrice: 3500.0, // Dummy current price
      usdValue: 3067.89, // amount * usdPrice
      contractAddress: "0x0000000000000000000000000000000000000000", // ETH has a zero address
      logoUrl: "https://cryptologos.cc/logos/sei-sei-logo.svg", // Placeholder for a logo
    },
    {
      id: "eth-mainnet", // Unique identifier for the holding
      tokenName: "Ethereum",
      symbol: "ETH",
      amount: 0.87654321,
      usdPrice: 3500.0, // Dummy current price
      usdValue: 3067.89, // amount * usdPrice
      contractAddress: "0x0000000000000000000000000000000000000000", // ETH has a zero address
      logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.svg", // Placeholder for a logo
    },
    {
      id: "usdt-erc20",
      tokenName: "Tether USD",
      symbol: "USDT",
      amount: 1250.75,
      usdPrice: 1.0,
      usdValue: 1250.75,
      contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Common ERC-20 USDT
      logoUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
    },
    {
      id: "wbtc-erc20",
      tokenName: "Wrapped Bitcoin",
      symbol: "WBTC",
      amount: 0.051234,
      usdPrice: 70000.0, // Dummy current price
      usdValue: 3586.38,
      contractAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // Common ERC-20 WBTC
      logoUrl:
        "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=026",
    },
    {
      id: "uni-erc20",
      tokenName: "Uniswap",
      symbol: "UNI",
      amount: 25.45,
      usdPrice: 12.5, // Dummy current price
      usdValue: 318.13,
      contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // Uniswap UNI token
      logoUrl: "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=026",
    },
    {
      id: "link-erc20",
      tokenName: "Chainlink",
      symbol: "LINK",
      amount: 150.0,
      usdPrice: 18.2, // Dummy current price
      usdValue: 2730.0,
      contractAddress: "0x514910771AF9Ca65E36535Ec39EDc287eB1703Cd", // Chainlink LINK token
      logoUrl: "https://cryptologos.cc/logos/chainlink-link-logo.png?v=026",
    },
    {
      id: "dai-erc20",
      tokenName: "Dai Stablecoin",
      symbol: "DAI",
      amount: 500.0,
      usdPrice: 1.0,
      usdValue: 500.0,
      contractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Dai Stablecoin
      logoUrl: "https://cryptologos.cc/logos/dai-dai-logo.png?v=026",
    },
    {
      id: "shib-erc20",
      tokenName: "Shiba Inu",
      symbol: "SHIB",
      amount: 5000000.0, // Large quantity for meme coins
      usdPrice: 0.000025, // Dummy current price
      usdValue: 125.0,
      contractAddress: "0x95aD61b0a150d79219dCEa232fB6a9F4dFd6Cb4a", // Shiba Inu token
      logoUrl: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png?v=026",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={true} className="md:w-sm">
        <DialogHeader>
          <DialogTitle>Portfolio</DialogTitle>
          <DialogDescription className="sr-only">
            View your portfolio
          </DialogDescription>
          <Separator className="my-2" />
          <div className="">
            <Tabs>
              <TabsList>
                <TabsTrigger
                  value="bought"
                  className="w-auto h-auto flex items-center gap-2 cursor-pointer data-[state=active]:text-accent dark:data-[state=active]:text-accent"
                >
                  Bought
                </TabsTrigger>
                <TabsTrigger
                  value="created"
                  className="w-auto h-auto flex items-center gap-2 cursor-pointer data-[state=active]:text-accent dark:data-[state=active]:text-accent"
                >
                  Created
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="bought"
                className="min-h-96 max-h-96 overflow-y-auto"
              >
                <div className="mt-2 pr-2 flex flex-col gap-2">
                  {tokenHoldings.map((token, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 flex justify-between bg-primary-foreground border rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={pepeImg}
                          alt=""
                          className="size-8 rounded-full border border-neutral-500"
                        />
                        <div className="flex flex-col items-start text-sm">
                          <span className="">{token.tokenName}</span>
                          <span className="text-neutral-500">
                            {token.symbol}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-sm">
                        <span className="">${token.usdValue}</span>
                        <span className="text-neutral-500">
                          {token.amount} {token.symbol}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent
                value="created"
                className="min-h-96 max-h-96 overflow-y-auto"
              >
                <div className="mt-2 pr-2 flex flex-col gap-2">
                  {tokenHoldings.reverse().map((token, idx) => (
                    <Fragment key={idx}>
                      <div className="px-4 py-2 flex justify-between rounded-xl">
                        <div className="flex items-center gap-2">
                          <img
                            src={pepeImg}
                            alt=""
                            className="size-8 rounded-full border border-neutral-500"
                          />
                          <div className="flex flex-col items-start text-sm">
                            <span className="">{token.tokenName}</span>
                            <span className="text-neutral-500">
                              {token.symbol}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end text-sm">
                          <span className="">${token.usdValue}</span>
                          <span className="text-neutral-500">
                            {token.amount} {token.symbol}
                          </span>
                        </div>
                      </div>
                      {idx + 1 < tokenHoldings.length && <Separator />}
                    </Fragment>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletButton;
