-- CreateTable
CREATE TABLE "SISIdentifiers" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "SISIdentifiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SISIdentifiers_identifier_key" ON "SISIdentifiers"("identifier");
