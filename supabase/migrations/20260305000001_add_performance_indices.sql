-- =============================================================================
-- MIGRATION: Add performance indices
-- Generated: 2026-03-05
-- Description: GIN indices on ARRAY columns for server-side filter performance,
--              unique B-tree index on slug, and FK indices for JOIN performance.
--
-- APPLY BEFORE: adding server-side filtering or search to the materials API.
-- SAFE TO APPLY: these are additive-only. No data is modified.
--
-- NOTE: CREATE INDEX CONCURRENTLY cannot run inside a transaction block.
--       Apply each statement individually via the Supabase dashboard or CLI.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Unique index on slug
-- Enforces slug uniqueness at the DB level and accelerates detail-page lookups.
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_materials_slug
  ON public."Materials" (slug);

-- ---------------------------------------------------------------------------
-- GIN indices on ARRAY columns
-- Required for efficient @> (contains) and && (overlap) filter operators.
-- Without these, filter queries degrade to sequential scans as data grows.
-- ---------------------------------------------------------------------------
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materials_color
  ON public."Materials" USING GIN (color);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materials_company
  ON public."Materials" USING GIN (company);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materials_texture
  ON public."Materials" USING GIN (texture);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materials_uses
  ON public."Materials" USING GIN (uses);

-- ---------------------------------------------------------------------------
-- B-tree indices on foreign key columns
-- Speeds up JOINs across MaterialCategories and MaterialCategorySizes.
-- Postgres does not auto-create indices on FK columns.
-- ---------------------------------------------------------------------------
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materialcategories_material_id
  ON public."MaterialCategories" (material_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materialcategories_category_id
  ON public."MaterialCategories" (category_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materialcategorysizes_mc_id
  ON public."MaterialCategorySizes" (material_category_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materialcategorysizes_size_id
  ON public."MaterialCategorySizes" (size_id);
