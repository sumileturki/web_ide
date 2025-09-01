// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import LoadingStep from "@/components/ui/loader";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { Separator } from "@/components/ui/separator";
// import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import PlaygroundEditor from "@/features/playground/components/playground-editor";
// import TemplateFileTree from "@/features/playground/components/template-file-tree";
// import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
// import { usePlayground } from "@/features/playground/hooks/usePlayground";
// import { TemplateFile } from "@/features/playground/types";
// import WebContainerPreview from "@/features/webContainers/components/webcontainer-preview";
// import { useWebContainer } from "@/features/webContainers/hooks/useWebContrainer";
// import { AlertCircle, Bot, FileText, Save, Settings, X } from "lucide-react";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { file } from "zod";

// const Page = () => {
//   const { id } = useParams<{ id: string }>();
//   const [isPreviewVisible, setIsPreviewVisible] = useState(true);
//   const { playgroundData, templateData, isLoading, error, saveTemplateData } =
//     usePlayground(id);
//   console.log(templateData);
//   console.log("play", playgroundData);
//   const {
//     activeFileId,
//     closeAllFiles,
//     openFile,
//     closeFile,
//     editorContent,
//     updateFileContent,
//     handleAddFile,
//     handleAddFolder,
//     handleDeleteFile,
//     handleDeleteFolder,
//     handleRenameFile,
//     handleRenameFolder,
//     openFiles,
//     setTemplateData,
//     setActiveFileId,
//     setPlaygroundId,
//     setOpenFiles,
//   } = useFileExplorer();

//   const {
//     serverUrl,
//     isLoading: containerLoading,
//     error: containerError,
//     instance,
//     writeFileSync,

//     // @ts-ignore
//   } = useWebContainer({ templateData });

//   useEffect(() => {
//     setPlaygroundId(id);
//   }, [id, setPlaygroundId]);

//   useEffect(() => {
//     if (templateData && !openFiles.length) {
//       setTemplateData(templateData);
//     }
//   }, [templateData, setTemplateData, openFiles.length]);

//   const activeFile = openFiles.find((file) => file.id === activeFileId);
//   const hasUnSavedChanges = openFiles.some((file) => file.hasUnsavedChanges);
//   const handleFileSelect = (file: TemplateFile) => {
//     console.log("handle", file);

//     openFile(file);
//     console.log(openFiles);
//   };

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
//         <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
//         <h2 className="text-xl font-semibold text-red-600 mb-2">
//           Something went wrong
//         </h2>
//         <p className="text-gray-600 mb-4">{error}</p>
//         <Button onClick={() => window.location.reload()} variant="destructive">
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
//         <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
//           <h2 className="text-xl font-semibold mb-6 text-center">
//             Loading Playground
//           </h2>
//           <div className="mb-8">
//             <LoadingStep
//               currentStep={1}
//               step={1}
//               label="Loading playground data"
//             />
//             <LoadingStep
//               currentStep={2}
//               step={2}
//               label="Setting up environment"
//             />
//             <LoadingStep currentStep={3} step={3} label="Ready to code" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <TooltipProvider>
//       <>
//         {/* templete tree */}
//         <TemplateFileTree
//           data={templateData!}
//           onFileSelect={handleFileSelect}
//         />

//         <SidebarInset>
//           <header className=" flex h-16 shrink-0 items-center gap-2 boredr-b px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <div className="flex flex-1 items-center gap-2">
//               <div className="flex flex-col flex-1">
//                 <h1 className=" text-sm font-medium">
//                   {playgroundData?.title || " Playgrond"}
//                 </h1>
//                 <p>
//                   {openFiles.length} File(s) open
//                   {hasUnSavedChanges && ". Unsaved chnages"}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size={"sm"}
//                       variant={"outline"}
//                       onClick={() => {}}
//                       disabled={!activeFile || !activeFile.hasUnsavedChanges}
//                     >
//                       <Save className="size-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Save (Ctrl+S)</TooltipContent>
//                 </Tooltip>

//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size={"sm"}
//                       variant={"outline"}
//                       onClick={() => {}}
//                       disabled={!activeFile || !activeFile.hasUnsavedChanges}
//                     >
//                       <Save className="size-4" /> All
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
//                 </Tooltip>

//                 {/* todo */}
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size={"sm"}
//                       variant={"outline"}
//                       onClick={() => {}}
//                       disabled={!activeFile || !activeFile.hasUnsavedChanges}
//                     >
//                       <Bot className="size-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Toggle Ai</TooltipContent>
//                 </Tooltip>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button size={"sm"} variant={"outline"}>
//                       <Settings className="size-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem
//                       onClick={() => setIsPreviewVisible(!isPreviewVisible)}
//                     >
//                       {isPreviewVisible ? "Hide" : "Show"} Preview
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={closeAllFiles}>
//                       Close All Files
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </header>
//           <div className="h-[calc(100vh-4rem)]">
//             {openFiles.length > 0 ? (
//               <div className="h-full flex flex-col">
//                 {/* File Tabs */}
//                 <div className="border-b bg-muted/30">
//                   <Tabs
//                     value={activeFileId || ""}
//                     onValueChange={setActiveFileId}
//                   >
//                     <div className="flex items-center justify-between px-4 py-2">
//                       <TabsList className="h-8 bg-transparent p-0">
//                         {openFiles.map((file) => (
//                           <TabsTrigger
//                             key={file.id}
//                             value={file.id}
//                             className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
//                           >
//                             <div className="flex items-center gap-2">
//                               <FileText className="h-3 w-3" />
//                               <span>
//                                 {file.filename}.{file.fileExtension}
//                               </span>
//                               {file.hasUnsavedChanges && (
//                                 <span className="h-2 w-2 rounded-full bg-orange-500" />
//                               )}
//                               <span
//                                 className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   closeFile(file.id);
//                                 }}
//                               >
//                                 <X className="h-3 w-3" />
//                               </span>
//                             </div>
//                           </TabsTrigger>
//                         ))}
//                       </TabsList>

//                       {openFiles.length > 1 && (
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           onClick={closeAllFiles}
//                           className="h-6 px-2 text-xs"
//                         >
//                           Close All
//                         </Button>
//                       )}
//                     </div>
//                   </Tabs>
//                 </div>

//                 {/* Editor and Preview */}
//                 <div className="flex-1">
//                   <ResizablePanelGroup
//                     direction="horizontal"
//                     className="h-full"
//                   >
//                     <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
//                       <PlaygroundEditor
//                         activeFile={activeFile}
//                         content={activeFile?.content || ""}
//                         onContentChange={(value) => {
//                           activeFileId &&
//                             updateFileContent(activeFileId, value);
//                         }}
//                       />
//                     </ResizablePanel>
//                     {isPreviewVisible && (
//                       <>
//                         <ResizableHandle />
//                         <ResizablePanel defaultSize={50} />
//                         <WebContainerPreview
//                           templateData={templateData!}
//                           instance={instance}
//                           writeFileSync={writeFileSync}
//                           isLoading={containerLoading}
//                           error={containerError}
//                           serverUrl={serverUrl!}
//                           forceResetup={false}
//                         />
//                       </>
//                     )}
//                   </ResizablePanelGroup>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
//                 <FileText className="h-16 w-16 text-gray-300" />
//                 <div className="text-center">
//                   <p className="text-lg font-medium">No files open</p>
//                   <p className="text-sm text-gray-500">
//                     Select a file from the sidebar to start editing
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </SidebarInset>
//       </>
//     </TooltipProvider>
//   );
// };

// export default Page;


"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingStep from "@/components/ui/loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PlaygroundEditor from "@/features/playground/components/playground-editor";
import TemplateFileTree from "@/features/playground/components/template-file-tree";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { TemplateFile } from "@/features/playground/types";
import WebContainerPreview from "@/features/webContainers/components/webcontainer-preview";
import { useWebContainer } from "@/features/webContainers/hooks/useWebContrainer";
import { AlertCircle, Bot, FileText, Save, Settings, X, FilePlus, FolderPlus, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Blended Page: keeps original logic, restores stable sidebar, and adds resizable panes
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id);

  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  const {
    serverUrl,
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
  } = useWebContainer({ templateData });

  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnSavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">Loading Playground</h2>
          <div className="mb-8">
            <LoadingStep currentStep={1} step={1} label="Loading playground data" />
            <LoadingStep currentStep={2} step={2} label="Setting up environment" />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full">
        {/* Left: Stable Sidebar with file tree + controls (keeps old behavior) */}
        <Sidebar className="border-r w-64 flex-shrink-0">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Files</SidebarGroupLabel>
              <SidebarGroupContent>
                {/* Keep the file tree component here for previous behavior */}
                <div className="px-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-medium">Template Files</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleAddFile && handleAddFile()}>
                        <FilePlus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleAddFolder && handleAddFolder()}>
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* TemplateFileTree preserves previous interactions and visuals */}
                  <div className="overflow-auto max-h-[calc(100vh-6rem)]">
                    <TemplateFileTree data={templateData!} onFileSelect={handleFileSelect} />
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Button variant="ghost" className="w-full justify-between">
                    Workspace
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setOpenFiles && setOpenFiles([])}>
                          Close All
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => saveTemplateData && saveTemplateData()}>
                          Save Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Button>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarRail />
        </Sidebar>

        {/* Right: Main area with header, tabs, editor and preview */}
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0">
          <ResizablePanel defaultSize={100}>
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                <div className="flex flex-1 items-center gap-2">
                  <div className="flex flex-col flex-1 min-w-0">
                    <h1 className="text-sm font-medium truncate">{playgroundData?.title || "Playground"}</h1>
                    <p className="text-xs text-muted-foreground truncate">
                      {openFiles.length} File(s) open{hasUnSavedChanges && ". Unsaved changes"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          onClick={() => {}}
                          disabled={!activeFile || !activeFile.hasUnsavedChanges}
                        >
                          <Save className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save (Ctrl+S)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          onClick={() => {}}
                          disabled={!activeFile || !activeFile.hasUnsavedChanges}
                        >
                          <Save className="size-4" /> All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          onClick={() => {}}
                        >
                          <Bot className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle Ai</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"sm"} variant={"outline"}>
                          <Settings className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsPreviewVisible(!isPreviewVisible)}>
                          {isPreviewVisible ? "Hide" : "Show"} Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={closeAllFiles}>Close All Files</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>

              <div className="h-[calc(100vh-4rem)] min-h-0">
                {openFiles.length > 0 ? (
                  <div className="h-full flex flex-col min-h-0">
                    {/* Tabs */}
                    <div className="border-b bg-muted/30">
                      <Tabs value={activeFileId || ""} onValueChange={setActiveFileId}>
                        <div className="flex items-center justify-between px-4 py-2">
                          <TabsList className="h-8 bg-transparent p-0 overflow-x-auto">
                            {openFiles.map((file) => (
                              <TabsTrigger
                                key={file.id}
                                value={file.id}
                                className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-3 w-3" />
                                  <span className="truncate max-w-[12rem]">
                                    {file.filename}.{file.fileExtension}
                                  </span>

                                  {file.hasUnsavedChanges && (
                                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                                  )}

                                  <span
                                    className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      closeFile(file.id);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </span>
                                </div>
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {openFiles.length > 1 && (
                            <Button size="sm" variant="ghost" onClick={closeAllFiles} className="h-6 px-2 text-xs">
                              Close All
                            </Button>
                          )}
                        </div>
                      </Tabs>
                    </div>

                    {/* Editor + Preview */}
                    <div className="flex-1 min-h-0">
                      <ResizablePanelGroup direction="horizontal" className="h-full">
                        <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                          <div className="h-full min-h-0">
                            <PlaygroundEditor
                              activeFile={activeFile}
                              content={activeFile?.content || ""}
                              onContentChange={(value) => {
                                activeFileId && updateFileContent(activeFileId, value);
                              }}
                            />
                          </div>
                        </ResizablePanel>

                        {isPreviewVisible && (
                          <>
                            <ResizableHandle />
                            <ResizablePanel defaultSize={50} minSize={25}>
                              <WebContainerPreview
                                templateData={templateData!}
                                instance={instance}
                                writeFileSync={writeFileSync}
                                isLoading={containerLoading}
                                error={containerError}
                                serverUrl={serverUrl!}
                                forceResetup={false}
                              />
                            </ResizablePanel>
                          </>
                        )}
                      </ResizablePanelGroup>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                    <FileText className="h-16 w-16 text-gray-300" />
                    <div className="text-center">
                      <p className="text-lg font-medium">No files open</p>
                      <p className="text-sm text-gray-500">Select a file from the sidebar to start editing</p>
                    </div>
                  </div>
                )}
              </div>
            </SidebarInset>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
};

export default Page;
