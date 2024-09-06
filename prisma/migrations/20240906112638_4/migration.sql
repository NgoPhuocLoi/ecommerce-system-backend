/*
  Warnings:

  - You are about to drop the column `category_id` on the `recommend_attributes` table. All the data in the column will be lost.
  - You are about to drop the `recommend_attribute_values_mapping` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recommend_attribute_id` to the `recommend_attribute_values` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."recommend_attribute_values_mapping" DROP CONSTRAINT "recommend_attribute_values_mapping_recommend_attribute_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."recommend_attribute_values_mapping" DROP CONSTRAINT "recommend_attribute_values_mapping_recommend_value_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."recommend_attributes" DROP CONSTRAINT "recommend_attributes_category_id_fkey";

-- AlterTable
ALTER TABLE "public"."recommend_attribute_values" ADD COLUMN     "recommend_attribute_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."recommend_attributes" DROP COLUMN "category_id";

-- DropTable
DROP TABLE "public"."recommend_attribute_values_mapping";

-- CreateTable
CREATE TABLE "public"."recommend_attribute_ofcategory" (
    "id" SERIAL NOT NULL,
    "recommend_attribute_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "recommend_attribute_ofcategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_values" ADD CONSTRAINT "recommend_attribute_values_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_ofcategory" ADD CONSTRAINT "recommend_attribute_ofcategory_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_ofcategory" ADD CONSTRAINT "recommend_attribute_ofcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
