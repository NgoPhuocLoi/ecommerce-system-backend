/*
  Warnings:

  - You are about to drop the column `recommend_attribute_id` on the `recommend_attribute_values` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."recommend_attribute_values" DROP CONSTRAINT "recommend_attribute_values_recommend_attribute_id_fkey";

-- AlterTable
ALTER TABLE "public"."recommend_attribute_values" DROP COLUMN "recommend_attribute_id";

-- CreateTable
CREATE TABLE "public"."recommend_attribute_values_mapping" (
    "id" SERIAL NOT NULL,
    "recommend_attribute_id" INTEGER NOT NULL,
    "recommend_value_id" INTEGER NOT NULL,

    CONSTRAINT "recommend_attribute_values_mapping_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_values_mapping" ADD CONSTRAINT "recommend_attribute_values_mapping_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_values_mapping" ADD CONSTRAINT "recommend_attribute_values_mapping_recommend_value_id_fkey" FOREIGN KEY ("recommend_value_id") REFERENCES "public"."recommend_attribute_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
