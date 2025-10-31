-- Add completed_at column to payments table
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Add payment_id column to material_downloads table
ALTER TABLE public.material_downloads ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Update existing completed payments to have completed_at
UPDATE public.payments SET completed_at = updated_at WHERE status = 'completed' AND completed_at IS NULL;
