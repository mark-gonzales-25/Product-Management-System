-- Hope PMS — Sprint 3, PR-01: db/view-top-selling
-- Creates the top_selling_products SQL view
-- JOIN product + sales_detail, GROUP BY prodCode, ORDER BY totalQty DESC

-- Drop and recreate to make this migration idempotent
DROP VIEW IF EXISTS public.top_selling_products;

CREATE VIEW public.top_selling_products AS
SELECT
  p.code         AS "prodCode",
  p.description,
  p.unit,
  SUM(sd.quantity)::INTEGER AS "totalQty"
FROM public.products p
JOIN public.sales_detail sd
  ON sd.product_code = p.code
GROUP BY p.code, p.description, p.unit
ORDER BY "totalQty" DESC;

-- Grant read access to authenticated users
GRANT SELECT ON public.top_selling_products TO authenticated;

COMMENT ON VIEW public.top_selling_products IS
  'REP_002 — Aggregated sales quantity per product, ordered by total units sold descending.';
