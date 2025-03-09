import { Prompt } from "@/components/Prompt";
import { Appbar } from "@/components/Appbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <SidebarInset className="bg-transparent">
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-0">
        <Appbar />
        
        <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto w-full">
          <div className="space-y-8 w-full">
            <Hero />

            <div className="pt-4 w-full">
              <Prompt />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
