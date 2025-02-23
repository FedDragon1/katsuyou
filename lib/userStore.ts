import { create } from 'zustand'

interface UserStore {
    name: string,
    email: string,
    avatar: string,
    validated: boolean,
    platform: "email" | "google" | "github"
}

const userStore = create<UserStore>((set) => ({
    name: '',
    email: '',
    avatar: '',
    validated: false,
    platform: "email",
    set: (user: UserStore) => set(() => user)
}))

export default userStore