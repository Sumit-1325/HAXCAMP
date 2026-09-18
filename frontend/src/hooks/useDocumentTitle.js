import { useEffect } from 'react';

const BASE_TITLE = 'NEXORA — Smart gear for modern workspaces';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · NEXORA` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
};
