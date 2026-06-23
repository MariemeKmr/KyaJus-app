-- CreateTable
CREATE TABLE "LotProduction" (
    "id" TEXT NOT NULL,
    "produitId" TEXT NOT NULL,
    "reference" TEXT,
    "bouteillesProduites" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LotProduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneLot" (
    "id" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "LigneLot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LotProduction" ADD CONSTRAINT "LotProduction_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneLot" ADD CONSTRAINT "LigneLot_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "LotProduction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
