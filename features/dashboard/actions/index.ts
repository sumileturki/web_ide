"use server";

import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Existing functions
export const createPlayground = async (data: {
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}) => {
  const { template, title, description } = data;
  const user = await currentUser();
  if (!user?.id) throw new Error("User not found");

  try {
    const playground = await db.playground.create({
      data: {
        title,
        description,
        template,
        userId: user.id,
      },
    });

    return playground;
  } catch (error) {
    console.error("Error creating playground:", error);
    throw error;
  }
};

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("User not found");

  try {
    const playground = await db.playground.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        Starmark: {
          where: { userId: user.id },
          select: { isMarked: true },
        },
      },
    });

    return playground;
  } catch (error) {
    console.error("Error fetching playgrounds:", error);
    throw error;
  }
};

export const deleteProjectById = async (id: string) => {
  try {
    await db.playground.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string }
) => {
  try {
    await db.playground.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Error editing project:", error);
    throw error;
  }
};

export const duplicateProjectById = async (id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: { id },
    });

    if (!originalPlayground) {
      throw new Error("Playground not found");
    }

    const duplicatePlayground = await db.playground.create({
      data: {
        title: `${originalPlayground.title} (copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,
      },
    });

    revalidatePath("/dashboard");
    return duplicatePlayground;
  } catch (error) {
    console.error("Error duplicating project:", error);
    return null;
  }
};

// ----------------------------
// New Starred/StarMark functions
// ----------------------------

// Toggle starred status for a playground
export const toggleStarPlayground = async (playgroundId: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("User not found");

  const existingStar = await db.starMark.findUnique({
    where: {
      userId_playgroundId: { userId: user.id, playgroundId },
    },
  });

  if (existingStar) {
    // Unmark
    await db.starMark.delete({
      where: { userId_playgroundId: { userId: user.id, playgroundId } },
    });
    return { starred: false };
  } else {
    // Mark
    await db.starMark.create({
      data: { userId: user.id, playgroundId, isMarked: true },
    });
    return { starred: true };
  }
};

// Get all starred playgrounds for current user
export const getStarredPlaygroundsForUser = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("User not found");

  const starredPlaygrounds = await db.starMark.findMany({
    where: { userId: user.id, isMarked: true },
    include: { playground: true },
  });

  return starredPlaygrounds.map((s) => s.playground);
};
