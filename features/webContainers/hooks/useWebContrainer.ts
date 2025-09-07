import { useState, useEffect, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';
import { TemplateFolder } from '@/features/playground/lib/path-to-json';

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

// ✅ Global singleton (only one instance allowed)
let globalWebContainer: WebContainer | null = null;

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeWebContainer() {
      try {
        if (!globalWebContainer) {
          // boot only once
          globalWebContainer = await WebContainer.boot();
        }

        if (!mounted) return;

        setInstance(globalWebContainer);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize WebContainer:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize WebContainer');
          setIsLoading(false);
        }
      }
    }

    initializeWebContainer();

    return () => {
      mounted = false;
      // ❌ don’t teardown automatically, only when destroy() is called
      // otherwise new mounts will fail to boot again
    };
  }, []);

  const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
    if (!instance) throw new Error('WebContainer instance is not available');

    try {
      const pathParts = path.split('/');
      const folderPath = pathParts.slice(0, -1).join('/');

      if (folderPath) {
        await instance.fs.mkdir(folderPath, { recursive: true });
      }

      await instance.fs.writeFile(path, content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to write file';
      console.error(`Failed to write file at ${path}:`, err);
      throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
    }
  }, [instance]);

  const destroy = useCallback(() => {
    if (globalWebContainer) {
      globalWebContainer.teardown();
      globalWebContainer = null;
      setInstance(null);
      setServerUrl(null);
    }
  }, []);

  return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
};
