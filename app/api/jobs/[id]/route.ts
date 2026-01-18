import { NextRequest, NextResponse } from "next/server";
import { mockJobs } from "../data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const job = mockJobs.find(j => j.id === id);

  if (!job) {
    return NextResponse.json(
      { message: "Job not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: job,
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const jobIndex = mockJobs.findIndex(j => j.id === id);

  if (jobIndex === -1) {
    return NextResponse.json(
      { message: "Job not found" },
      { status: 404 }
    );
  }

  const updatedJob = {
    ...mockJobs[jobIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  mockJobs[jobIndex] = updatedJob;

  return NextResponse.json({
    data: updatedJob,
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const jobIndex = mockJobs.findIndex(j => j.id === id);

  if (jobIndex === -1) {
    return NextResponse.json(
      { message: "Job not found" },
      { status: 404 }
    );
  }

  const deletedJob = mockJobs[jobIndex];
  mockJobs.splice(jobIndex, 1);

  return NextResponse.json({
    data: deletedJob,
  });
}
