import {create} from "zustand";
import {User, Post} from "../types/index";

interface DashboardState {
    users: User[];
    apiIsLoading: boolean;
    error: boolean;
    fetchUsers: () => Promise<void>;

    posts: Record<number, Post[]>;
    postsLoading: boolean;
    fetchPosts : (userId: number) => Promise<void>;
}

export const useStore = create<DashboardState>((set,get) => ({
    users: [],
    apiIsLoading: false,
    error: false,

    fetchUsers: async() => {
        set({apiIsLoading: true, error: false});
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/users');
            if(!res.ok) throw new Error("Network Error");
            const data = await res.json();
            set({ users: data, apiIsLoading: false });
        } catch (error) {
            set({ error: true, apiIsLoading: false });
        }
    },

    posts: {},
    postsLoading: false,
    fetchPosts: async(userId: number) => {
        if(get().posts[userId]) return ;

        set({postsLoading: true});
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
            const data = await res.json();
            set((state) => ({
                posts: {...state.posts, [userId]: data},
                postsLoading: false,
            }))
        } catch (error) {
            set({ postsLoading: false });
        }
    }



}))

