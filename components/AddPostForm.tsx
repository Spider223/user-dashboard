"use client";

import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import { Post } from '@/types';

const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 character long"),
    body: z.string().min(10, "Body must be at least 10 character long")
})

type FormData = z.infer<typeof postSchema>;

export default function AddPostForm({userId, onAdd} : {userId: number; onAdd: (post: Post) => void}) {
    const {register, handleSubmit, formState:{errors}, reset} = useForm<FormData>({
        resolver: zodResolver(postSchema)
    })

    const onSubmit = (data: FormData) => {
        const newPost : Post = {
            id: Date.now(),
            userId,
            title: data.title,
            body: data.body,
        }

        const existingPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
        localStorage.setItem('localPosts', JSON.stringify([newPost, ...existingPosts]));

        onAdd(newPost);
        reset()
    }

    return (
        <form>
            <h3 className="text-xl font-bold mb-4">Add New Post</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                    {...register('title')} 
                    className="w-full p-2 border rounded" 
                    placeholder="Post title" 
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Body</label>
                <textarea 
                    {...register('body')} 
                    className="w-full p-2 border rounded" 
                    rows={3} 
                    placeholder="Post body..." 
                />
                {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>}
            </div>

            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
                Submit Post
            </button>
        </form>
    )
}