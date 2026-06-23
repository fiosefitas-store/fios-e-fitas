/*
  Warnings:

  - You are about to drop the column `corImagens` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `prazoProducao` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tamanhosCm` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "corImagens",
DROP COLUMN "prazoProducao",
DROP COLUMN "tamanhosCm";
