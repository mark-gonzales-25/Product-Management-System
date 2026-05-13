-- ============================================================
-- Hope PMS — Sprint 1: Initial Schema
-- PR: db/initial-schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. PROFILES TABLE ───────────────────────────────────────
-- Extends Supabase auth.users with application-level role/status data.
-- Equivalent to: user table + record_status + stamp columns from HopeDB spec.
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT NOT NULL,
  email         TEXT NOT NULL,
  user_type     TEXT NOT NULL DEFAULT 'USER'
                  CHECK (user_type IN ('SUPERADMIN','ADMIN','USER')),
  status        TEXT NOT NULL DEFAULT 'INACTIVE'
                  CHECK (status IN ('ACTIVE','INACTIVE')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: authenticated read"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Profiles: own update"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Profiles: service insert"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- ── 2. PRODUCTS TABLE ────────────────────────────────────────
-- record_status (active BOOLEAN) and stamp (deleted_by / deleted_at) columns
-- are included per Sprint 1 requirements.
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  unit        TEXT NOT NULL CHECK (unit IN ('ea','pc','mtr','pkg','ltr')),
  price       NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  active      BOOLEAN NOT NULL DEFAULT true,   -- record_status
  deleted_by  TEXT,                             -- stamp: who deleted
  deleted_at  DATE,                             -- stamp: when deleted
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products: authenticated read"
  ON public.products FOR SELECT TO authenticated USING (true);

CREATE POLICY "Products: admin insert"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type IN ('ADMIN','SUPERADMIN')
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "Products: admin update"
  ON public.products FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type IN ('ADMIN','SUPERADMIN')
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "Products: superadmin delete"
  ON public.products FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type = 'SUPERADMIN'
        AND status = 'ACTIVE'
    )
  );

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 3. SALES_DETAIL TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sales_detail (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code TEXT NOT NULL REFERENCES public.products(code) ON UPDATE CASCADE,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sales_detail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales: authenticated read"
  ON public.sales_detail FOR SELECT TO authenticated USING (true);

CREATE POLICY "Sales: admin insert"
  ON public.sales_detail FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type IN ('ADMIN','SUPERADMIN')
        AND status = 'ACTIVE'
    )
  );

-- ── 4. SEED: PRODUCTS ────────────────────────────────────────
INSERT INTO public.products (code, description, unit, price, active, deleted_by, deleted_at) VALUES
  ('AD0001','Toshiba Canvio 1 TB','ea',58.00,true,null,null),
  ('AD0002','WD Ultra 1TB','ea',69.99,true,null,null),
  ('AD0003','Seagate Bracuda 1TB','ea',54.44,true,null,null),
  ('AD0004','Transcend 1 TB','ea',71.99,false,'admin.santos','2024-03-01'),
  ('AK0001','HP Pavilion DV6000','pc',12.00,false,'admin.reyes','2024-01-15'),
  ('AK0002','Micro Innovations Kb','pc',8.37,true,null,null),
  ('AK0003','Steel APEX GAMING KB','pc',99.99,true,null,null),
  ('AM0001','MS Wireless Mouse','pc',38.27,true,null,null),
  ('AM0002','LOGITECH 910-002696','pc',72.72,true,null,null),
  ('AM0003','IMICRO KB-IM8911U','pc',21.45,true,null,null),
  ('AM0004','STEEL Rival Mouse','pc',92.55,true,null,null),
  ('AM0005','Logitech M500 USB','pc',51.73,true,null,null),
  ('AP0001','HDMI Pocket Proj','pc',314.99,true,null,null),
  ('AP0002','InFocus IN112 Proj','pc',319.70,true,null,null),
  ('AP0003','ViewSonic Projector','pc',367.49,true,null,null),
  ('MD0001','ASUS VS228H-P 22-In','ea',131.65,true,null,null),
  ('MD0002','ViewSonic VA2446M','ea',164.99,true,null,null),
  ('MD0003','Dell UltrShrp U2412M','ea',263.96,true,null,null),
  ('MD0004','Acer S231HL BBID 23','ea',145.43,true,null,null),
  ('MD0005','Apple Dsplay MC914','ea',907.50,false,'admin.santos','2024-02-20'),
  ('MD0006','Asus VE228H 21.5','ea',136.72,true,null,null),
  ('MP0001','Apple iPhone 4 16GB','ea',199.95,true,null,null),
  ('MP0002','Apple iPhone 3G','ea',126.72,true,null,null),
  ('MP0003','SAMSUNG GALAXY S4','ea',425.00,true,null,null),
  ('MP0004','SAMSUNG GALAXY S3','ea',302.00,true,null,null),
  ('NB0001','Dell Inspiron Laptop','ea',300.00,true,null,null),
  ('NB0002','ASUS Tformer Book','ea',298.00,true,null,null),
  ('NB0003','Acer C720 Chrome','ea',199.00,true,null,null),
  ('NB0004','HP Chromebook 11','ea',279.00,true,null,null),
  ('NB0005','Apple Mac Pro Laptop','ea',1184.72,true,null,null),
  ('NT0001','Apple iPad Retna 16G','ea',412.49,true,null,null),
  ('NT0002','Apple iPad 2 MC769LL','ea',324.99,true,null,null),
  ('NT0003','Apple iPad Mini','ea',287.00,true,null,null),
  ('NT0004','Samsung Galaxy Tab3','ea',219.89,true,null,null),
  ('NT0005','Samsung Galaxy Tab32G','ea',499.99,true,null,null),
  ('NT0006','DrgonTouch 7B 2Core','ea',57.99,true,null,null),
  ('PA0001','MS Ofc Business 2013','ea',219.00,true,null,null),
  ('PA0002','Office Mac Home 2011','ea',102.99,true,null,null),
  ('PC0001','CyberpowerPC Gamer','ea',454.54,true,null,null),
  ('PC0002','Dell 745 Opti Desk','ea',197.99,true,null,null),
  ('PC0003','Dell Inspiron Desk','ea',390.00,true,null,null),
  ('PC0004','Dell Inspiron 660','ea',538.00,true,null,null),
  ('PF0001','Win7 Pro SP1 64bit','ea',112.50,true,null,null),
  ('PF0002','Win7 Home Pre SP1 64','ea',58.41,true,null,null),
  ('PF0003','Mac OS X ver 10.6.3','ea',26.25,true,null,null),
  ('PF0004','Windows 8.1 64-Bit','ea',84.41,true,null,null),
  ('PF0005','Windows 8 Pro','ea',108.18,true,null,null),
  ('PF0006','RED HAT Prof Edition','ea',6.82,true,null,null),
  ('PR0001','Epson Expression','pc',81.72,true,null,null),
  ('PR0002','Canon PIXMA MX922','pc',99.99,true,null,null),
  ('PR0003','HP Envy 4500 Wireles','pc',123.00,true,null,null),
  ('PS0001','VirServ 12Core 128GB','pc',3200.00,true,null,null),
  ('PS0002','Ms WinServer 2012','pc',699.99,true,null,null),
  ('PS0003','Cisco Virt Hardware','pc',599.99,true,null,null),
  ('NH0001','NETGEAR ProSAFE 5-Port','pc',21.99,true,null,null),
  ('NH0002','TP-LINK 1000Mbps','pc',24.99,true,null,null),
  ('NH0003','Cisco 24-P G Switch','pc',171.69,true,null,null)
ON CONFLICT (code) DO NOTHING;

-- ── 5. SEED: SALES DETAIL ───────────────────────────────────
INSERT INTO public.sales_detail (product_code, quantity) VALUES
  ('AK0002',10),('AM0003',10),('MD0001',10),('PC0002',10),
  ('NB0001',5),('PR0001',1),('PF0006',1),('AK0003',6),
  ('AM0004',6),('MD0004',6),('NB0002',4),('PC0003',6),
  ('PR0003',2),('AK0003',1),('NB0001',5),
  ('PF0005',5),('PF0003',2),('AP0002',3),('MD0002',2),
  ('NB0004',1),('AM0002',1),('MD0003',1),('AP0001',2),
  ('PA0001',5),('AK0003',3),('AM0004',3),('MD0003',3),
  ('PC0004',3),('PR0002',2),('NB0003',7),('AM0005',2),
  ('AP0002',1),('PF0004',10),('AK0003',1),('AM0001',1),
  ('MD0002',1),('PC0001',1),('AP0002',2),('NB0002',7),
  ('PF0006',1),('PR0002',1),('PA0001',3),('PA0002',4),
  ('MD0001',9),('PC0004',9),('AP0002',2),
  ('AM0002',3),('NB0002',3),('MD0006',5),('PA0002',1),
  ('PC0002',5),('NB0001',1),('PA0002',1),('AP0002',1),
  ('AM0005',1),('MD0003',1),('PC0001',1),('NB0003',3),
  ('PF0003',1),('AM0001',2),('PF0004',5),('PF0001',3),
  ('AM0001',5),('PA0001',5),('PF0006',1),('PR0003',2),
  ('AM0003',20),('NB0004',3),('PA0002',2),('NB0001',3),
  ('MD0003',1),('PC0001',1),('NH0003',3),('PC0004',10),
  ('PR0002',2),('AM0002',10),('PC0004',5),
  ('AD0003',1),('AK0001',3),('PA0001',3),('PC0003',3),
  ('NB0004',10),('NH0002',2),('PF0001',1),('PF0006',1),
  ('NB0002',15),('NB0001',5),('PR0002',2),('AM0005',3),
  ('AP0003',1),('AD0003',3),('NB0004',5),('NH0003',2),
  ('PA0001',5),('PF0001',2),('AD0002',2),('AD0003',5);
