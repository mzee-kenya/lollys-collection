import create from 'zustand'

type User = { id: string; name: string } | null

type SessionState = {
  user: User
  login: (user: User) => void
  logout: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
