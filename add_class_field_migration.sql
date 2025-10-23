-- Migration: Add 'class' field to materials table
-- Run this in your Supabase SQL Editor

-- Add class column to materials table
ALTER TABLE materials 
ADD COLUMN IF NOT EXISTS class TEXT DEFAULT 'Class 11';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_materials_class ON materials(class);

-- Update existing materials to have a default class (optional)
-- UPDATE materials SET class = 'Class 11' WHERE class IS NULL;

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'materials' AND column_name = 'class';
