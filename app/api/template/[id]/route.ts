import { db } from "@/lib/db";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";
import { templatePaths } from "@/lib/template/template";
import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
} from "@/features/playground/lib/path-to-json";

// Helper to validate JSON structure
function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data)); // Ensures it's serializable
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  // Fetch playground from DB
  let playground;
  try {
    playground = await db.playground.findUnique({ where: { id } });
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const templateKey = playground.template as keyof typeof templatePaths;
  const templatePath = templatePaths[templateKey];

  if (!templatePath) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  // Prepare input and output paths
  const inputPath = path.join(process.cwd(), templatePath);
  const outputFile = path.join(process.cwd(), `output/${templateKey}.json`);

  try {
    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    console.log("Input Path:", inputPath);
    console.log("Output Path:", outputFile);

    // Save and read template JSON
    try {
      await saveTemplateStructureToJson(inputPath, outputFile);
    } catch (e) {
      console.error("Failed to save template structure:", e);
      return Response.json(
        { error: "Failed to save template structure" },
        { status: 500 }
      );
    }

    let result;
    try {
      result = await readTemplateStructureFromJson(outputFile);
    } catch (e) {
      console.error("Failed to read template JSON:", e);
      return Response.json(
        { error: "Failed to read template JSON" },
        { status: 500 }
      );
    }

    if (!validateJsonStructure(result.items)) {
      console.error("Template JSON structure invalid");
      return Response.json(
        { error: "Invalid JSON structure" },
        { status: 500 }
      );
    }

    // Delete temporary output file
    await fs.unlink(outputFile).catch(() => {});

    return Response.json({ success: true, templateJson: result }, { status: 200 });
  } catch (error) {
    console.error("Error generating template JSON:", error);
    return Response.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
