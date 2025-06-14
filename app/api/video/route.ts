import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch videos",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized access. Please log in",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body: IVideo = await req.json();

    if (
      !body.title ||
      !body.description ||
      !body.thumbnailUrl ||
      !body.videoUrl
    ) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create video",
      },
      { status: 500 }
    );
  }
}
