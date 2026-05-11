/*
  Warnings:

  - A unique constraint covering the columns `[name,section]` on the table `product_states` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LoadUnit" AS ENUM ('GRAMOS', 'KILOGRAMOS', 'LITROS', 'UNIDAD');

-- DropIndex
DROP INDEX "product_states_name_key";

-- AlterTable
ALTER TABLE "load_items" ADD COLUMN     "unit" "LoadUnit" NOT NULL DEFAULT 'GRAMOS';

-- AlterTable
ALTER TABLE "product_states" ADD COLUMN     "section" "LoadSection";

-- CreateIndex
CREATE UNIQUE INDEX "product_states_name_section_key" ON "product_states"("name", "section");
