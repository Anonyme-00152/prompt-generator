import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Variable {
  id: string;
  name: string;
  value: string;
}

export interface Favorite {
  id: string;
  name: string;
  timestamp: number;
  values: Record<string, string>;
  techniques: Record<string, boolean>;
  verbosity: 'low' | 'medium' | 'high';
  confidenceEnabled: boolean;
}

export interface PlaygroundState {
  apiKey: string;
  provider: 'openai' | 'anthropic';
  isLoading: boolean;
  response: string;
  error: string | null;
}

interface PromptStore {
  // Variables
  variables: Variable[];
  addVariable: (variable: Variable) => void;
  updateVariable: (id: string, variable: Partial<Variable>) => void;
  deleteVariable: (id: string) => void;
  
  // Favorites
  favorites: Favorite[];
  addFavorite: (favorite: Favorite) => void;
  deleteFavorite: (id: string) => void;
  loadFavorite: (id: string) => Favorite | undefined;
  
  // Playground
  playground: PlaygroundState;
  setPlaygroundApiKey: (key: string) => void;
  setPlaygroundProvider: (provider: 'openai' | 'anthropic') => void;
  setPlaygroundLoading: (loading: boolean) => void;
  setPlaygroundResponse: (response: string) => void;
  setPlaygroundError: (error: string | null) => void;
  
  // A/B Testing
  abTestMode: boolean;
  setAbTestMode: (enabled: boolean) => void;
  
  // Focus Mode
  focusMode: boolean;
  setFocusMode: (enabled: boolean) => void;
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      variables: [],
      addVariable: (variable) =>
        set((state) => ({
          variables: [...state.variables, variable],
        })),
      updateVariable: (id, updates) =>
        set((state) => ({
          variables: state.variables.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        })),
      deleteVariable: (id) =>
        set((state) => ({
          variables: state.variables.filter((v) => v.id !== id),
        })),

      favorites: [],
      addFavorite: (favorite) =>
        set((state) => ({
          favorites: [...state.favorites, favorite],
        })),
      deleteFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
      loadFavorite: (id) => {
        const favorite = get().favorites.find((f) => f.id === id);
        return favorite;
      },

      playground: {
        apiKey: '',
        provider: 'openai',
        isLoading: false,
        response: '',
        error: null,
      },
      setPlaygroundApiKey: (apiKey) =>
        set((state) => ({
          playground: { ...state.playground, apiKey },
        })),
      setPlaygroundProvider: (provider) =>
        set((state) => ({
          playground: { ...state.playground, provider },
        })),
      setPlaygroundLoading: (isLoading) =>
        set((state) => ({
          playground: { ...state.playground, isLoading },
        })),
      setPlaygroundResponse: (response) =>
        set((state) => ({
          playground: { ...state.playground, response },
        })),
      setPlaygroundError: (error) =>
        set((state) => ({
          playground: { ...state.playground, error },
        })),

      abTestMode: false,
      setAbTestMode: (enabled) => set({ abTestMode: enabled }),

      focusMode: false,
      setFocusMode: (enabled) => set({ focusMode: enabled }),
    }),
    {
      name: 'prompt-store',
    }
  )
);
