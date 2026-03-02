import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const { name, email, aadhar, number, location, soiltype, password, confirmPassword: _ } = await request.json();

    if (!name || !password || !location || !number || !soiltype || !aadhar || !email) {
      return NextResponse.json(
        { success: false, message: "Fill all the fields properly" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ number });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        exists: true,
        message: "User already exists. Try logging in.",
      });
    }

    const newUser = await User.create({ name, email, aadhar, number, location, soiltype, password });

    return NextResponse.json({
      success: true,
      exists: false,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
