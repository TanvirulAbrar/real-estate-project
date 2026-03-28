import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Key exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { id, name, email } = await request.json();

    if (!id || !name || !email) {
      return Response.json(
        { message: "ID, Name, and email required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([{ id, name, email }])
      .select();

    if (error) {
      console.error("Admin insert error:", error);
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(data[0], { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
