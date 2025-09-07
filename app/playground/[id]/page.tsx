"use client";

import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
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
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TemplateFileTree from "@/features/playground/components/template-file-tree";
import ToggleAI from "@/features/playground/components/toggle-ai";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { findFilePath } from "@/features/playground/lib";
import { TemplateFile, TemplateFolder } from "@/features/playground/types";
import WebContainerPreview from "@/features/webContainers/components/webcontainer-preview";
import { useWebContainer } from "@/features/webContainers/hooks/useWebContrainer";
import {
  AlertCircle,
  Bot,
  FileText,
  Save,
  Settings,
  X,
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAISuggestions } from "@/features/ai/hooks/useAiSuggesstion";
import { editor } from "monaco-editor";
import { PlaygroundEditor } from "@/features/playground/components/playground-editor";

// Blended Page: keeps original logic, restores stable sidebar, and adds resizable panes + navigation bar
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);

  const aiSuggestion = useAISuggestions();

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

  const lastSyncedContent = useRef<Map<string, string>>(new Map());

  const [url, setUrl] = useState("/");
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const handleNavigate = useCallback(() => {
    if (!serverUrl) return;
    // Trim whitespace
    const trimmed = url.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      setCurrentUrl(trimmed);
    } else {
      const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
      setCurrentUrl(`${serverUrl}${normalized}`);
    }
  }, [url, serverUrl]);

  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);

      // Find README.md in templateData
      const findReadme = (
        items: (TemplateFile | TemplateFolder)[]
      ): TemplateFile | null => {
        for (const item of items) {
          if ("folderName" in item) {
            const found = findReadme(item.items);
            if (found) return found;
          } else if (
            item.filename.toLowerCase() === "readme" &&
            item.fileExtension === "md"
          ) {
            return item;
          }
        }
        return null;
      };

      const readmeFile = findReadme(templateData.items);
      if (readmeFile) {
        openFile(readmeFile); // automatically open README.md
        setActiveFileId(readmeFile.id);
      }
    }
  }, [
    templateData,
    setTemplateData,
    openFiles.length,
    openFile,
    setActiveFileId,
  ]);

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnSavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return handleAddFile(
        newFile,
        parentPath,
        writeFileSync!,
        instance,
        saveTemplateData
      );
    },
    [handleAddFile, writeFileSync, instance, saveTemplateData]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
    },
    [handleAddFolder, instance, saveTemplateData]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, saveTemplateData);
    },
    [handleDeleteFile, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, saveTemplateData);
    },
    [handleDeleteFolder, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFile, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFolder, saveTemplateData]
  );

  const handleSave = useCallback(
    async (fileId?: string) => {
      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const fileToSave = openFiles.find((f) => f.id === targetFileId);
      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      try {
        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error(
            `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`
          );
          return;
        }

        // Update file content in template data (clone for immutability)
        const updatedTemplateData = JSON.parse(
          JSON.stringify(latestTemplateData)
        );
        const updateFileContent = (items: any[]) =>
          items.map((item) => {
            if ("folderName" in item) {
              return { ...item, items: updateFileContent(item.items) };
            } else if (
              item.filename === fileToSave.filename &&
              item.fileExtension === fileToSave.fileExtension
            ) {
              return { ...item, content: fileToSave.content };
            }
            return item;
          });
        updatedTemplateData.items = updateFileContent(
          updatedTemplateData.items
        );

        // Sync with WebContainer
        if (writeFileSync) {
          await writeFileSync(filePath, fileToSave.content);
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
          if (instance && instance.fs) {
            await instance.fs.writeFile(filePath, fileToSave.content);
          }
        }

        // Use saveTemplateData to persist changes
        const newTemplateData = await saveTemplateData(updatedTemplateData);
        setTemplateData(newTemplateData || updatedTemplateData);

        // Update open files
        const updatedOpenFiles = openFiles.map((f) =>
          f.id === targetFileId
            ? {
                ...f,
                content: fileToSave.content,
                originalContent: fileToSave.content,
                hasUnsavedChanges: false,
              }
            : f
        );
        setOpenFiles(updatedOpenFiles);

        toast.success(
          `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(
          `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
        throw error;
      }
    },
    [
      activeFileId,
      openFiles,
      writeFileSync,
      instance,
      saveTemplateData,
      setTemplateData,
      setOpenFiles,
    ]
  );

  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
      toast.success(`Saved ${unsavedFiles.length} file(s)`);
    } catch (error) {
      toast.error("Failed to save some files");
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }

      // Ctrl+Shift+S -> Save All
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "s"
      ) {
        e.preventDefault();
        handleSaveAll();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleSaveAll]);

  // Support pressing Enter in the address input to navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        // If focus is inside an input with placeholder "Enter URL or path" (the address bar), trigger navigate
        const active = document.activeElement as HTMLElement | null;
        if (active && active.tagName === "INPUT") {
          const input = active as HTMLInputElement;
          if (input.placeholder === "Enter URL or path") {
            e.preventDefault();
            handleNavigate();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNavigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
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
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground
          </h2>
          <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddFile && handleAddFile()}
                      >
                        <FilePlus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddFolder && handleAddFolder()}
                      >
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* TemplateFileTree preserves previous interactions and visuals */}

                  <div className="overflow-auto max-h-[calc(100vh-6rem)]">
                    <TemplateFileTree
                      data={templateData!}
                      onFileSelect={handleFileSelect}
                      selectedFile={activeFile}
                      title="File Explorer"
                      onAddFile={wrappedHandleAddFile}
                      onAddFolder={wrappedHandleAddFolder}
                      onDeleteFile={wrappedHandleDeleteFile}
                      onDeleteFolder={wrappedHandleDeleteFolder}
                      onRenameFile={wrappedHandleRenameFile}
                      onRenameFolder={wrappedHandleRenameFolder}
                    />
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
                        <DropdownMenuItem
                          onClick={() => setOpenFiles && setOpenFiles([])}
                        >
                          Close All
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => saveTemplateData && saveTemplateData()}
                        >
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
                    <h1 className="text-sm font-medium truncate">
                      {playgroundData?.title || "Playground"}
                    </h1>
                    <p className="text-xs text-muted-foreground truncate">
                      {openFiles.length} File(s) open
                      {hasUnSavedChanges && ". Unsaved changes"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-sm text-muted-foreground p-4  "
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          onClick={() => handleSave()}
                          disabled={
                            !activeFile || !activeFile.hasUnsavedChanges
                          }
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
                          onClick={() => handleSaveAll()}
                          disabled={
                            !activeFile || !activeFile.hasUnsavedChanges
                          }
                        >
                          <Save className="size-4" /> All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
                    </Tooltip>

                    <ToggleAI
                      isEnabled={aiSuggestion.isEnabled}
                      onToggle={aiSuggestion.toggleEnabled}
                      suggestionLoading={aiSuggestion.isLoading}
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"sm"} variant={"outline"}>
                          <Settings className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                        >
                          {isPreviewVisible ? "Hide" : "Show"} Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={closeAllFiles}>
                          Close All Files
                        </DropdownMenuItem>
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
                      <Tabs
                        value={activeFileId || ""}
                        onValueChange={setActiveFileId}
                      >
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
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={closeAllFiles}
                              className="h-6 px-2 text-xs"
                            >
                              Close All
                            </Button>
                          )}
                        </div>
                      </Tabs>
                    </div>

                    {/* Editor + Preview */}
                    <div className="flex-1 min-h-0">
                      <ResizablePanelGroup
                        direction="horizontal"
                        className="h-full"
                      >
                        <ResizablePanel
                          defaultSize={isPreviewVisible ? 50 : 100}
                        >
                          <div className="h-full min-h-0">
                            <PlaygroundEditor
                              activeFile={activeFile}
                              content={activeFile?.content || ""}
                              onContentChange={(value) => {
                                activeFileId &&
                                  updateFileContent(activeFileId, value);
                              }}
                              suggestion={aiSuggestion.suggestion}
                              suggestionLoading={aiSuggestion.isLoading}
                              suggestionPosition={aiSuggestion.position}
                              onAcceptSuggestion={(editor, monaco) =>
                                aiSuggestion.acceptSuggestion(editor, monaco)
                              }
                              onRejectSuggestion={(editor, monaco) =>
                                aiSuggestion.rejectSuggestion(editor, monaco)
                              }
                              onTriggerSuggestion={(editor, monaco) =>
                                aiSuggestion.fetchSuggestion(editor, monaco)
                              }
                            />
                          </div>
                        </ResizablePanel>

                        {isPreviewVisible && (
                          <>
                            <ResizableHandle />
                            <ResizablePanel defaultSize={50} minSize={25}>
                              <div className="flex flex-col h-full">
                                {/* 🔑 Address/Search Bar */}
                                <div className="flex items-center gap-2 border-b p-2">
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                  <Input
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter URL or path"
                                  />
                                  <Button size="sm" onClick={handleNavigate}>
                                    Go
                                  </Button>
                                </div>

                                {/* WebContainerPreview */}
                                <div className="flex-1 min-h-0">
                                  <WebContainerPreview
                                    templateData={templateData!}
                                    instance={instance}
                                    writeFileSync={writeFileSync}
                                    isLoading={containerLoading}
                                    error={containerError}
                                    serverUrl={currentUrl || serverUrl!}
                                    forceResetup={false}
                                  />
                                </div>
                              </div>
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
                      <p className="text-sm text-gray-500">
                        Select a file from the sidebar to start editing
                      </p>
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
