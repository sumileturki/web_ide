import React, { useState } from "react";
import {
  TemplateFile,
  TemplateFolder,
  TemplateItem,
} from "../lib/path-to-json";
import {
  Sidebar,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  Edit3,
  File,
  FilePlus,
  Folder,
  FolderPlus,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Chevron } from "react-day-picker";
import { DeleteDialog, NewFileDialog, NewFolderDialog, RenameFolderDialog } from "./template-file-tree";

interface TemplateNodeProps {
  item: TemplateItem;
  onFileSelect?: (file: TemplateFile) => void;
  selectedFile?: TemplateFile;
  level: number;
  path?: string;
  onAddFile?: (file: TemplateFile, parentPath: string) => void;
  onAddFolder?: (folder: TemplateFolder, parentPath: string) => void;
  onDeleteFile?: (file: TemplateFile, parentPath: string) => void;
  onDeleteFolder?: (folder: TemplateFolder, parentPath: string) => void;
  onRenameFile?: (
    file: TemplateFile,
    newFilename: string,
    newExtension: string,
    parentPath: string
  ) => void;
  onRenameFolder?: (
    folder: TemplateFolder,
    newFolderName: string,
    parentPath: string
  ) => void;
}

const TemplateNode = ({
  item,
  onFileSelect,
  selectedFile,
  level,
  path = "",
  onAddFile,
  onAddFolder,
  onDeleteFile,
  onDeleteFolder,
  onRenameFile,
  onRenameFolder,
}: TemplateNodeProps) => {
  const isValidItem = item && typeof item === "object";

  const isFolder = isValidItem && "folderName" in item;
    const [isNewFileDialogOpen, setIsNewFileDialogOpen] = React.useState(false)
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = React.useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  const [isOpen, setIsOpen] = useState(level < 2);
  if (!isValidItem) return null;

  if (!isFolder) {
    const file = item as TemplateFile;
    const fileName = `${file.filename}.${file.fileExtension}`;

const isSelected =
      selectedFile && selectedFile.filename === file.filename && selectedFile.fileExtension === file.fileExtension

    const handleRename = () => {
      setIsRenameDialogOpen(true)
    }

    const handleDelete = () => {
      setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
      onDeleteFile?.(file, path)
      setIsDeleteDialogOpen(false)
    }

    const handleRenameSubmit = (newFilename: string, newExtension: string) => {
      onRenameFile?.(file, newFilename, newExtension, path)
      setIsRenameDialogOpen(false)
    }

    return (
      <SidebarMenuItem>
        <div className="flex items-center group">
          <SidebarMenuButton isActive={isSelected} onClick={()=>onFileSelect?.(file)}nclassName="flex-1">
            <File className="h-4 w-4 mr-2 shrink-0" />
            <span>{fileName}</span>
          </SidebarMenuButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="border-2 rounded-md p-1 "
              align="end"
            >
              <DropdownMenuItem onClick={handleRename}>
                <Edit3 className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    );
  } else {
    const folder = item as TemplateFolder;
    const folderName = folder.folderName;
    const currentPath = path ? `${path}/${folderName}` : folderName;

    const handleAddFile = () => {
      setIsNewFileDialogOpen(true)
    }

    const handleAddFolder = () => {
      setIsNewFolderDialogOpen(true)
    }

    const handleRename = () => {
      setIsRenameDialogOpen(true)
    }

    const handleDelete = () => {
      setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
      onDeleteFolder?.(folder, path)
      setIsDeleteDialogOpen(false)
    }

    const handleCreateFile = (filename: string, extension: string) => {
      if (onAddFile) {
        const newFile: TemplateFile = {
          filename,
          fileExtension: extension,
          content: "",
        }
        onAddFile(newFile, currentPath)
      }
      setIsNewFileDialogOpen(false)
    }

    const handleCreateFolder = (folderName: string) => {
      if (onAddFolder) {
        const newFolder: TemplateFolder = {
          folderName,
          items: [],
        }
        onAddFolder(newFolder, currentPath)
      }
      setIsNewFolderDialogOpen(false)
    }

    const handleRenameSubmit = (newFolderName: string) => {
      onRenameFolder?.(folder, newFolderName, path)
      setIsRenameDialogOpen(false)
    }

    return (
      <SidebarMenuItem>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="group/collapsible [&[data-state=open]>div>button>svg:first-child]:rotate-90"
        >
          <div className="flex items-center group ">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="flex-1">
                <ChevronRight className="transition-transform" />
                <Folder className="h-4 w-4 mr-2 shrink-0" />
                <span>{folderName}</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddFile}>
                  <FilePlus className="h-4 w-4 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAddFolder}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRename}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CollapsibleContent>
            <SidebarMenuSub>
              {folder.items.map((childItem, index) => (
                <TemplateNode
                  key={index}
                  item={childItem}
                  onFileSelect={onFileSelect}
                  selectedFile={selectedFile}
                  level={level + 1}
                  path={currentPath}
                  onAddFile={onAddFile}
                  onAddFolder={onAddFolder}
                  onDeleteFile={onDeleteFile}
                  onDeleteFolder={onDeleteFolder}
                  onRenameFile={onRenameFile}
                  onRenameFolder={onRenameFolder}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
        <NewFileDialog
          isOpen={isNewFileDialogOpen}
          onClose={() => setIsNewFileDialogOpen(false)}
          onCreateFile={handleCreateFile}
        />

        <NewFolderDialog
          isOpen={isNewFolderDialogOpen}
          onClose={() => setIsNewFolderDialogOpen(false)}
          onCreateFolder={handleCreateFolder}
        />

        <RenameFolderDialog
          isOpen={isRenameDialogOpen}
          onClose={() => setIsRenameDialogOpen(false)}
          onRename={handleRenameSubmit}
          currentFolderName={folderName}
        />

      <DeleteDialog
      isOpen={isDeleteDialogOpen}
      setIsOpen={setIsDeleteDialogOpen}
      onConfirm={confirmDelete}
      title="Delete Folder"
      description={`Are you sure you want to delete "${folderName}" and all its contents? This action cannot be undone.`}
      itemName={folderName}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      />
        
      </SidebarMenuItem>
    );
  }

  // return ÷<h2>Folder</h2>;
};

export default TemplateNode;
