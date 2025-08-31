"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const {playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id);
  console.log(templateData);
  console.log("play", playgroundData);
  
  
  return (
    <TooltipProvider>
      {/* templete tree */}

      <SidebarInset>
        <header className=" flex h-16 shrink-0 items-center gap-2 boredr-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center gap-2">
            <div className="flex flex-col flex-1">
                {playgroundData?.title || " Playgrond"}

            </div>
          </div>
        </header>
      </SidebarInset>
    </TooltipProvider>
  );
};

export default Page;
