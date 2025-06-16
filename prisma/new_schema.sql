-- Drop existing tables if they exist
DROP TABLE IF EXISTS public."AreaContact";
DROP TABLE IF EXISTS public."Representative";
DROP TABLE IF EXISTS public."Company";
DROP TABLE IF EXISTS public."Subscription";

-- Company table with expanded fields
CREATE TABLE public."Company" (
    id SERIAL PRIMARY KEY,
    "businessName" VARCHAR(255) NOT NULL,
    "tradeName" VARCHAR(255),
    ruc VARCHAR(20) UNIQUE NOT NULL,
    "fiscalAddress" TEXT NOT NULL,
    activity TEXT NOT NULL,
    "anniversaryDate" DATE,
    "corporatePhone" VARCHAR(50),
    "corporateEmail" VARCHAR(255),
    "facebookUrl" VARCHAR(255),
    "instagramUrl" VARCHAR(255),
    "tiktokUrl" VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Activo',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Representatives table (Legal, Chamber, Business)
CREATE TABLE public."Representative" (
    id SERIAL PRIMARY KEY,
    "companyId" INTEGER REFERENCES public."Company"(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'LEGAL', 'CHAMBER', 'BUSINESS'
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    dni VARCHAR(20),
    phone VARCHAR(50),
    "birthDate" DATE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Area Contacts table
CREATE TABLE public."AreaContact" (
    id SERIAL PRIMARY KEY,
    "companyId" INTEGER REFERENCES public."Company"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    area VARCHAR(100) NOT NULL, -- e.g., 'Marketing', 'Sales', 'Finance', etc.
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription table linked to companies
CREATE TABLE public."Subscription" (
    id SERIAL PRIMARY KEY,
    "companyId" INTEGER REFERENCES public."Company"(id) ON DELETE CASCADE,
    plan VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Activo',
    "startDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    "paymentStatus" VARCHAR(50) DEFAULT 'Pendiente',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_company_ruc ON public."Company"(ruc);
CREATE INDEX idx_representative_company ON public."Representative"("companyId");
CREATE INDEX idx_areacontact_company ON public."AreaContact"("companyId");
CREATE INDEX idx_subscription_company ON public."Subscription"("companyId");

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_updated_at
    BEFORE UPDATE ON public."Company"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_representative_updated_at
    BEFORE UPDATE ON public."Representative"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_areacontact_updated_at
    BEFORE UPDATE ON public."AreaContact"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_updated_at
    BEFORE UPDATE ON public."Subscription"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
