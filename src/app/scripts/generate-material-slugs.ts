import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";
// import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Set up Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function generateSlugs() {
  const { data: materials, error } = await supabase
    .from("Materials")
    .select("id, name");

  if (error) {
    console.error("Error fetching materials:", error);
    return;
  }

  if (!materials || materials.length === 0) {
    console.log("No materials found.");
    return;
  }

  for (const material of materials) {
    const slug = slugify(material.name, {
      lower: true,
      strict: true, // removes special characters
    });

    const { error: updateError } = await supabase
      .from("Materials")
      .update({ slug })
      .eq("id", material.id);

    if (updateError) {
      console.error(`Failed to update slug for ${material.name}:`, updateError);
    } else {
      console.log(`✅ Updated slug for ${material.name} → ${slug}`);
    }
  }

  console.log("🎉 Slug generation complete.");
}

generateSlugs();
