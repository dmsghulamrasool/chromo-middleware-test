-- Add palette_code column to palettes table
alter table palettes add column palette_code text;

-- Add index on palette_code for lookups
create index palettes_palette_code_idx on palettes(palette_code);
