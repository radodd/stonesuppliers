-- =============================================================================
-- BASELINE MIGRATION — Stone Suppliers
-- Generated: 2026-03-05
-- Description: Baseline schema representing the initial production state.
--              This migration is for reference and future diff tracking only.
--              DO NOT run against an existing production database.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Categories
-- Flat taxonomy labels (e.g. "Aggregate", "Boulders", "Rip Rap")
-- ---------------------------------------------------------------------------
CREATE TABLE public."Categories" (
  id   bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text                                NOT NULL,
  CONSTRAINT "Categories_pkey" PRIMARY KEY (id)
);

-- ---------------------------------------------------------------------------
-- Sizes
-- Physical dimension / spec identifiers (e.g. "3/4\"", "Class II Base")
-- ---------------------------------------------------------------------------
CREATE TABLE public."Sizes" (
  id        integer      NOT NULL DEFAULT nextval('"Sizes_id_seq"'::regclass),
  "sizeValue" character varying NOT NULL,
  CONSTRAINT "Sizes_pkey" PRIMARY KEY (id)
);

-- ---------------------------------------------------------------------------
-- Materials
-- Core catalog entity. One row per unique material offering.
--
-- ARRAY columns:
--   color      — display color labels          (e.g. {Brown, Grey})
--   texture    — texture descriptors           (e.g. {Angular, Round})
--   imagePath  — Supabase Storage object paths (e.g. {path/to/img1.jpg, ...})
--   company    — owning company labels         (e.g. {"MRC Rock & Sand"})
--   uses       — intended use descriptors      (e.g. {Drainage, Landscaping})
--
-- NOTE: slug must be unique and stable once published.
--       Changing a slug breaks external links and SEO.
-- ---------------------------------------------------------------------------
CREATE TABLE public."Materials" (
  id            bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  name          text,
  description   text,
  color         text[],
  texture       text[],
  "imagePath"   text[],
  "imagePrimary" text,
  company       text[]                             NOT NULL,
  uses          text[],
  slug          text                               UNIQUE,
  CONSTRAINT "Materials_pkey" PRIMARY KEY (id)
);

-- ---------------------------------------------------------------------------
-- MaterialCategories
-- Resolves M:N relationship between Materials and Categories.
-- A single material can belong to multiple categories.
-- ---------------------------------------------------------------------------
CREATE TABLE public."MaterialCategories" (
  id          bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  category_id bigint,
  material_id bigint,
  CONSTRAINT "MaterialCategories_pkey"             PRIMARY KEY (id),
  CONSTRAINT "MaterialCategories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Categories" (id),
  CONSTRAINT "MaterialCategories_material_id_fkey" FOREIGN KEY (material_id) REFERENCES public."Materials"  (id)
);

-- ---------------------------------------------------------------------------
-- MaterialCategorySizes
-- Resolves M:N relationship between MaterialCategories and Sizes.
-- Sizes are scoped per material-category pair, not globally per material.
-- (e.g. a stone available in 3/4" as Drain Rock but 1/4" as Aggregate)
-- ---------------------------------------------------------------------------
CREATE TABLE public."MaterialCategorySizes" (
  id                   bigint  GENERATED ALWAYS AS IDENTITY NOT NULL,
  material_category_id bigint,
  size_id              integer,
  CONSTRAINT "MaterialCategorySizes_pkey"                          PRIMARY KEY (id),
  CONSTRAINT "MaterailCategorySizes_material_category_id_fkey"     FOREIGN KEY (material_category_id) REFERENCES public."MaterialCategories" (id),
  CONSTRAINT "MaterailCategorySizes_size_id_fkey"                  FOREIGN KEY (size_id)              REFERENCES public."Sizes"              (id)
);

-- =============================================================================
-- RECOMMENDED INDICES (not yet applied to production — apply separately)
-- =============================================================================

-- Unique index on slug for fast detail-page lookups and collision prevention
-- CREATE UNIQUE INDEX idx_materials_slug ON public."Materials" (slug);

-- GIN indices on ARRAY columns for filter query performance at scale
-- CREATE INDEX idx_materials_color   ON public."Materials" USING GIN (color);
-- CREATE INDEX idx_materials_company ON public."Materials" USING GIN (company);
-- CREATE INDEX idx_materials_texture ON public."Materials" USING GIN (texture);
-- CREATE INDEX idx_materials_uses    ON public."Materials" USING GIN (uses);

-- Foreign key indices for JOIN performance
-- CREATE INDEX idx_materialcategories_material_id  ON public."MaterialCategories"     (material_id);
-- CREATE INDEX idx_materialcategories_category_id  ON public."MaterialCategories"     (category_id);
-- CREATE INDEX idx_materialcategorysizes_mc_id     ON public."MaterialCategorySizes"  (material_category_id);
-- CREATE INDEX idx_materialcategorysizes_size_id   ON public."MaterialCategorySizes"  (size_id);
