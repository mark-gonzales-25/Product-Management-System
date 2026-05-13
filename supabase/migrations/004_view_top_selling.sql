-- Hope PMS — Sprint 3, PR-01: db/view-top-selling
DROP VIEW IF EXISTS public.top_selling_products;
CREATE VIEW public.top_selling_products AS
SELECT
  p.code         AS "prodCode",
  p.description,
  p.unit,
  SUM(sd.quantity)::INTEGER AS "totalQty"
FROM public.products p
JOIN public.sales_detail sd ON sd.product_code = p.code
GROUP BY p.code, p.description, p.unit
ORDER BY "totalQty" DESC;
GRANT SELECT ON public.top_selling_products TO authenticated;
