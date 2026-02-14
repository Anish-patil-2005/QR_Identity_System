CREATE TABLE IF NOT EXISTS faculty (
    employee_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    department VARCHAR(100) DEFAULT 'ENTC',
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    linkedin VARCHAR(255),
    whatsapp VARCHAR(20),
    website VARCHAR(255),
    google_scholar VARCHAR(255),
    profile_photo_url TEXT,
    research JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
    is_first_login BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    qr_code TEXT,
    public_slug VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

