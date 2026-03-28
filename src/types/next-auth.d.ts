import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: "client" | "agent" | "admin";
      theme: "light" | "dark";
      is_demo: boolean;
    };
  }
}

