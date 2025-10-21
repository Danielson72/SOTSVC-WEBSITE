-- Add special_details column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS special_details text;