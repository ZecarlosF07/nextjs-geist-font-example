-- Table: public."Company"
CREATE TABLE public."Company" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ruc VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(255),
    sector VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    email VARCHAR(255),
    status VARCHAR(255) DEFAULT 'En proceso',
    "joinDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: public."Subscription"
CREATE TABLE public."Subscription" (
    id SERIAL PRIMARY KEY,
    plan VARCHAR(255) NOT NULL,
    status VARCHAR(255) DEFAULT 'Activo',
    "startDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP NOT NULL,
    "companyId" INTEGER NOT NULL REFERENCES public."Company"(id) ON DELETE CASCADE
);

-- Table: public."Event"
CREATE TABLE public."Event" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(255) DEFAULT 'Programado'
);

-- Table: public."Training"
CREATE TABLE public."Training" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    status VARCHAR(255) DEFAULT 'Programado'
);

-- Table: public."Certificate"
CREATE TABLE public."Certificate" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    "issueDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) DEFAULT 'Emitido',
    "companyId" INTEGER NOT NULL REFERENCES public."Company"(id) ON DELETE CASCADE
);

-- Table: public."Report"
CREATE TABLE public."Report" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    "generatedDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) DEFAULT 'Generado'
);
