import { QueryClientProvider } from 'react-query';

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      { children }
    </QueryClientProvider>
  );
}