-- ============================================================
-- Sprint 2 — SQL View: current_product_price
-- Returns the most recent unit_price per product code.
-- Used by REP_001 in Sprint 3 and optionally by ProductsPage.
-- ============================================================

-- Create price_history table if not yet created
CREATE TABLE IF NOT EXISTS public.price_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code TEXT NOT NULL REFERENCES public.products(code) ON UPDATE CASCADE ON DELETE CASCADE,
  unit_price   NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
  eff_date     DATE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read price history
CREATE POLICY "PriceHist: authenticated read"
  ON public.price_history FOR SELECT
  TO authenticated
  USING (true);

-- Only ADMIN / SUPERADMIN can insert price history
CREATE POLICY "PriceHist: admin insert"
  ON public.price_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type IN ('ADMIN', 'SUPERADMIN')
        AND status = 'ACTIVE'
    )
  );

-- ── View: current_product_price ─────────────────────────────
-- Returns one row per product with its latest effective price.
CREATE OR REPLACE VIEW public.current_product_price AS
SELECT DISTINCT ON (ph.product_code)
  ph.product_code,
  ph.unit_price,
  ph.eff_date
FROM public.price_history ph
ORDER BY ph.product_code, ph.eff_date DESC, ph.created_at DESC;

-- Verification:
-- SELECT * FROM current_product_price LIMIT 10;
-- Should return one row per product_code with the latest eff_date.
