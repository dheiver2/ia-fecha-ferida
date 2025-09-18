-- ESQUEMA DO BANCO DE DADOS - FECHA FERIDA IA
-- SQLite Database Schema

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin', 'doctor', 'nurse', 'user'
    specialty VARCHAR(100), -- Especialidade médica
    crm VARCHAR(20), -- Registro profissional
    institution VARCHAR(255), -- Instituição de trabalho
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Tabela de Pacientes
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, -- Usuário que cadastrou o paciente
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    gender VARCHAR(10), -- 'M', 'F', 'Other'
    cpf VARCHAR(14) UNIQUE, -- CPF do paciente (opcional)
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    medical_history TEXT, -- Histórico médico
    allergies TEXT, -- Alergias conhecidas
    current_medications TEXT, -- Medicações atuais
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    notes TEXT, -- Observações gerais
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Análises de Feridas
CREATE TABLE IF NOT EXISTS wound_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, -- Usuário que fez a análise
    patient_id INTEGER, -- Paciente (opcional para análises anônimas)
    protocol_number VARCHAR(50) UNIQUE NOT NULL, -- Número do protocolo
    image_filename VARCHAR(255) NOT NULL, -- Nome do arquivo da imagem
    image_path VARCHAR(500) NOT NULL, -- Caminho completo da imagem
    
    -- Contexto da análise
    lesion_location VARCHAR(255), -- Localização da lesão
    patient_context TEXT, -- Contexto do paciente em JSON
    
    -- Resultado da análise
    analysis_result TEXT NOT NULL, -- JSON completo da análise do Gemini
    diagnosis_primary VARCHAR(500), -- Diagnóstico principal
    diagnosis_confidence DECIMAL(5,2), -- Confiança do diagnóstico (0-100)
    severity VARCHAR(50), -- Gravidade: 'Leve', 'Moderada', 'Grave'
    healing_potential VARCHAR(50), -- Potencial de cicatrização
    
    -- Medidas da ferida
    wound_length DECIMAL(8,2), -- Comprimento em cm
    wound_width DECIMAL(8,2), -- Largura em cm
    wound_depth DECIMAL(8,2), -- Profundidade em cm
    wound_area DECIMAL(10,2), -- Área em cm²
    
    -- Status e metadados
    status VARCHAR(50) DEFAULT 'completed', -- 'processing', 'completed', 'error'
    processing_time INTEGER, -- Tempo de processamento em ms
    error_message TEXT, -- Mensagem de erro se houver
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

-- Tabela de Sessões (para controle de login)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash VARCHAR(255) NOT NULL, -- Hash do JWT token
    device_info TEXT, -- Informações do dispositivo
    ip_address VARCHAR(45), -- IPv4 ou IPv6
    user_agent TEXT, -- User agent do browser
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'create_analysis', 'view_patient', etc.
    resource_type VARCHAR(50), -- 'user', 'patient', 'analysis'
    resource_id INTEGER, -- ID do recurso afetado
    details TEXT, -- Detalhes da ação em JSON
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_cpf ON patients(cpf);
CREATE INDEX IF NOT EXISTS idx_wound_analyses_user_id ON wound_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_wound_analyses_patient_id ON wound_analyses(patient_id);
CREATE INDEX IF NOT EXISTS idx_wound_analyses_protocol ON wound_analyses(protocol_number);
CREATE INDEX IF NOT EXISTS idx_wound_analyses_created_at ON wound_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_patients_timestamp 
    AFTER UPDATE ON patients
    BEGIN
        UPDATE patients SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_wound_analyses_timestamp 
    AFTER UPDATE ON wound_analyses
    BEGIN
        UPDATE wound_analyses SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Inserir usuário administrador padrão (senha: admin123)
-- Hash bcrypt para 'admin123': $2a$12$3n8I/gW5oiIkARsRmQPiZO09VPWrB0a0H3gqHZc7k.ooy9eDVe.p6
INSERT OR IGNORE INTO users (
    email, 
    password_hash, 
    name, 
    role, 
    specialty, 
    crm, 
    institution,
    is_active,
    email_verified
) VALUES (
    'admin@fechaferida.com',
    '$2a$12$3n8I/gW5oiIkARsRmQPiZO09VPWrB0a0H3gqHZc7k.ooy9eDVe.p6',
    'Administrador Sistema',
    'admin',
    'Administração',
    'ADMIN-2024',
    'Sistema Fecha Ferida IA',
    1,
    1
);