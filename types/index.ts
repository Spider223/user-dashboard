export interface User {
    id: number;
    name: string;
    email: string;
    company: {
        name: string;
    }
}

export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}