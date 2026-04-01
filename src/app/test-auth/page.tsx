"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function TestAuth() {
  const { data: session, status } = useSession();

  console.log("Session:", session);
  console.log("Status:", status);

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="bg-white/10 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Session Status: {status}</h2>
        <pre className="text-sm bg-black/20 p-2 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="space-x-4">
        <button
          onClick={() => signIn("credentials", {
            email: "user@example.com",
            password: "123456",
          })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In (Demo User)
        </button>
        
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
