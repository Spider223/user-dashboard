"use client";

import {useEffect, useState} from "react";
import {useStore} from "../store/useStore";
import Link from "next/link";

export default function UserList() {
  const {users, apiIsLoading, error, fetchUsers} = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if(apiIsLoading){
    return <div className="p-10 text-xl font-semibold text-center text-blue-600">Loading users...</div>;
  }

  if (error) {
    return <div className="p-10 text-xl font-semibold text-center text-red-600">Something went wrong</div>;
  }

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User & Post Dashboard</h1>

      <input 
        type="text"
        placeholder="Search by Name or Email..."
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-5 bg-white shadow-md border rounded-xl flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <p className="text-sm text-gray-500 mb-4 grow">
              Company: <span className="font-medium">{user.company.name}</span>
            </p>

            <Link 
              href={`/users/${user.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center transition-colors"
            >
              View Posts
            </Link>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <p className="text-gray-500 col-span-2">No users match your search</p>
        )}
      </div>
    </div>
  )


}