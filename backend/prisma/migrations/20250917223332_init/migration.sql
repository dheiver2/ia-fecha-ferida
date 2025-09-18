-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "specialty" VARCHAR(100),
    "crm" VARCHAR(20),
    "institution" VARCHAR(255),
    "phone" VARCHAR(20),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patients" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "birth_date" DATE,
    "gender" VARCHAR(10),
    "cpf" VARCHAR(14),
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "address" TEXT,
    "medical_history" TEXT,
    "allergies" TEXT,
    "current_medications" TEXT,
    "emergency_contact_name" VARCHAR(255),
    "emergency_contact_phone" VARCHAR(20),
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wound_analyses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "patient_id" INTEGER,
    "protocol_number" VARCHAR(50) NOT NULL,
    "image_filename" VARCHAR(255) NOT NULL,
    "image_path" VARCHAR(500) NOT NULL,
    "lesion_location" VARCHAR(255),
    "patient_context" TEXT,
    "analysis_result" TEXT NOT NULL,
    "diagnosis_primary" VARCHAR(500),
    "diagnosis_confidence" DECIMAL(5,2),
    "severity" VARCHAR(50),
    "healing_potential" VARCHAR(50),
    "wound_length" DECIMAL(8,2),
    "wound_width" DECIMAL(8,2),
    "wound_depth" DECIMAL(8,2),
    "wound_area" DECIMAL(10,2),
    "status" VARCHAR(50) NOT NULL DEFAULT 'completed',
    "processing_time" INTEGER,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wound_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "device_info" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(100) NOT NULL,
    "resource_type" VARCHAR(50),
    "resource_id" INTEGER,
    "details" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "patients_cpf_key" ON "public"."patients"("cpf");

-- CreateIndex
CREATE INDEX "patients_user_id_idx" ON "public"."patients"("user_id");

-- CreateIndex
CREATE INDEX "patients_cpf_idx" ON "public"."patients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "wound_analyses_protocol_number_key" ON "public"."wound_analyses"("protocol_number");

-- CreateIndex
CREATE INDEX "wound_analyses_user_id_idx" ON "public"."wound_analyses"("user_id");

-- CreateIndex
CREATE INDEX "wound_analyses_patient_id_idx" ON "public"."wound_analyses"("patient_id");

-- CreateIndex
CREATE INDEX "wound_analyses_protocol_number_idx" ON "public"."wound_analyses"("protocol_number");

-- AddForeignKey
ALTER TABLE "public"."patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wound_analyses" ADD CONSTRAINT "wound_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wound_analyses" ADD CONSTRAINT "wound_analyses_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
