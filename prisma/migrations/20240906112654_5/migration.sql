/*
  Warnings:

  - You are about to drop the `recommend_attribute_ofcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."recommend_attribute_ofcategory" DROP CONSTRAINT "recommend_attribute_ofcategory_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."recommend_attribute_ofcategory" DROP CONSTRAINT "recommend_attribute_ofcategory_recommend_attribute_id_fkey";

-- DropTable
DROP TABLE "public"."recommend_attribute_ofcategory";

-- CreateTable
CREATE TABLE "public"."recommend_attribute_of_category" (
    "id" SERIAL NOT NULL,
    "recommend_attribute_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "recommend_attribute_of_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_of_category" ADD CONSTRAINT "recommend_attribute_of_category_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_of_category" ADD CONSTRAINT "recommend_attribute_of_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
