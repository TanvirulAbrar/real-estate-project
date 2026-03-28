import supabase from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

