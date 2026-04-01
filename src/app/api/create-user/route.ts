import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { IUserLean } from "@/types";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, name, email } = await request.json();

    if (!id || !name || !email) {
      return Response.json(
        { message: "ID, Name, and email required" },
        { status: 400 },
      );
    }

    const doc = await User.findOneAndUpdate(
      { email },
      {
        $set: { name, email },
        $setOnInsert: { _id: id, role: "client", theme: "light" },
      },
      { upsert: true, new: true, runValidators: true },
    ).lean<IUserLean | null>();

    return Response.json(
      {
        id: String(doc!._id),
        name: doc!.name,
        email: doc!.email,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Server error:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
