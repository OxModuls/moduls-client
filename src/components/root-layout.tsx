import { Outlet } from "react-router";
import Header from "./header";
import Footer from "./footer";
import { Toaster } from "./ui/sonner";
import { useIsMobile } from "@/hooks";

const RootLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full text-primary bg-background">
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position={isMobile ? "top-right" : "bottom-right"} />
    </div>
  );
};

export default RootLayout;
