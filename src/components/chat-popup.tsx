import { useBalance } from "wagmi";
import { useState } from "react";
import { ellipsizeAddress, writeToClipboard } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  ChevronDown,
  Copy,
  Menu,
  MessageSquare,
  MessageSquarePlus,
  PanelLeft,
  Search,
  Trash2,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import pepeImg from "../assets/images/pepe.png";
import { Input } from "./ui/input";

type ChatPopupProps = {
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  agentAddress: `0x${string}`;
};

const ChatPopup = ({
  popoverOpen,
  onPopoverOpenChange,
  agentAddress,
}: ChatPopupProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: agentWalletBalance } = useBalance({
    address: agentAddress,
  });
  const prevChats = [
    { title: "What's the most effective way to use you" },
    { title: "Check my SEI balance" },
  ];
  const promptSuggestions = [
    "What Can I Do? 🤔",
    "Get Trading Alpha 📈",
    "Defi Execution ⚡",
    "Defi Research 🔍",
    "Goal-oriented Tasks 🎯",
  ];

  return (
    <Popover open={popoverOpen} onOpenChange={onPopoverOpenChange}>
      <PopoverTrigger asChild>
        <button className="fixed z-10 right-4 bottom-8 rounded-full border-2 border-accent cursor-pointer">
          <img
            src={pepeImg}
            alt="agent-pepe"
            className="size-12 rounded-full object-cover"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-screen md:w-sm">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Menu className="size-6" />
              </SheetTrigger>

              <SheetContent side="left" className="p-4">
                <SheetHeader className="sr-only">
                  <SheetTitle>Agent Chat Sidebar</SheetTitle>
                  <SheetDescription>Sidebar for agent chat</SheetDescription>
                </SheetHeader>

                <div className="flex justify-between items-center gap-4">
                  <div className="relative">
                    <Input placeholder="Search Chats" />
                    <Search className="size-5 absolute right-2 top-[50%] translate-y-[-50%]" />
                  </div>
                  <SheetClose asChild>
                    <button title="Close sidebar cursor-pointer">
                      <PanelLeft className="size-6" />
                    </button>
                  </SheetClose>
                </div>

                <button className="w-full px-2 py-2 rounded-lg hover:bg-neutral-800 flex items-center gap-2 cursor-pointer">
                  <MessageSquarePlus className="size-5" />
                  <span>New Chat</span>
                </button>
                <div className="w-full h-0.25 bg-neutral-700" />

                <div>
                  <div className="flex flex-col gap-1">
                    {prevChats.map((chat, idx) => (
                      <div
                        key={idx}
                        className="w-full py-2 px-2 flex justify-between items-center gap-2 rounded-lg hover:bg-neutral-800 cursor-pointer"
                      >
                        <MessageSquare className="size-5 shrink-0" />
                        <span className="flex-grow text-left whitespace-nowrap overflow-hidden text-ellipsis">
                          {chat.title}
                        </span>
                        <Trash2 className="size-4 shrink-0" />
                      </div>
                    ))}
                  </div>
                  <p className="w-full mt-4 text-center text-xs font-light">
                    {prevChats.length} chats loaded
                  </p>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex gap-3 items-center">
              <img src={pepeImg} alt="pepe" className="size-10 rounded-full" />

              <div className="flex gap-0.5 flex-col">
                <p className="font-medium">Moduls Agent</p>
                <div className="flex items-center gap-1">
                  <span className="font-mono">
                    {ellipsizeAddress(agentAddress)}
                  </span>
                  <button
                    className="cursor-pointer"
                    onClick={() => writeToClipboard(agentAddress)}
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="px-2 py-1 rounded-xl bg-neutral-700">
                <span>{agentWalletBalance?.value}</span> SEI
              </div>
            </div>
          </div>

          <div
            onClick={() => onPopoverOpenChange(false)}
            className="mt-1 cursor-pointer"
          >
            <ChevronDown className="size-7" />
          </div>
        </div>
        <div className="my-4 w-full h-0.25 bg-neutral-700" />
        <div className="">
          <div className="px-4 flex flex-col gap-5 items-center justify-center">
            <div className="mt-12">
              <h2 className="text-xl font-semibold">
                What can I help you with?
              </h2>
            </div>
            <div className="w-full">
              <Textarea placeholder="Ask me anything" className="" />
              <button className="w-full mt-3 py-2 bg-accent rounded-lg font-medium">
                Start Chat
              </button>
            </div>
          </div>

          <div className="w-full mt-8 flex justify-center">
            <div className="w-full p-4 flex justify-center flex-wrap gap-1">
              {promptSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="px-2 py-1 bg-neutral-800 rounded-xl cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChatPopup;
