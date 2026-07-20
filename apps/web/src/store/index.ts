/**
 * Global store placeholder.
 *
 * Choose a state management library based on project needs:
 * - Zustand (recommended for simplicity)
 * - Jotai (atomic state)
 * - Redux Toolkit (complex state)
 *
 * Server state is handled by TanStack Query.
 * This store is for client-only UI state.
 */

// Example Zustand store (uncomment when ready):
// import { create } from 'zustand';
//
// interface AppState {
//   sidebarOpen: boolean;
//   toggleSidebar: () => void;
// }
//
// export const useAppStore = create<AppState>((set) => ({
//   sidebarOpen: true,
//   toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
// }));

export {};
