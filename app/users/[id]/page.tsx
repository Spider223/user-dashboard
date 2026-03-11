"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "../../../store/useStore";
import AddPostForm from "@/components/AddPostForm";
import { Post } from "@/types";

export default function UserPostsPage() {
    const params = useParams();
    const router = useRouter();
    const userId = Number(params.id);

    const {posts, postsLoading, fetchPosts} = useStore();
    const fetchedPosts = posts[userId] || [];

    const[localPosts, setLocalPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        fetchPosts(userId);
    }, [userId, fetchPosts]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('localPosts') || '[]');
        setLocalPosts(stored.filter((p: Post) => p.userId === userId));
    }, [userId]);

    const handleAddPost = (newPost: Post) => {
        setLocalPosts([newPost, ...localPosts]);
        setCurrentPage(1); 
    };

    const allPosts = [...localPosts, ...fetchedPosts];
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

    if (postsLoading && fetchedPosts.length === 0) {
        return <div className="p-10 text-center">Loading posts...</div>;
    }
  
    return (
        <div className="max-w-3xl mx-auto p-6">
            <button onClick={() => router.push('/')} className="text-blue-600 mb-6 hover:underline">
                &larr; Back to Users
            </button>

            <h1 className="text-3xl font-bold mb-6">User {userId} Posts</h1>
            <AddPostForm userId={userId} onAdd={handleAddPost} />

            <div className="space-y-4">
                {currentPosts.map(post => (
                    <div key={post.id} className="p-5 bg-white border shadow-sm rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">{post.title}</h3>
                        <p className="text-gray-700">{post.body}</p>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-lg">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}