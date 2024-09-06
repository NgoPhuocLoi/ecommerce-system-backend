-- CreateTable
CREATE TABLE "public"."recommend_attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "recommend_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommend_attribute_values" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "recommend_attribute_id" INTEGER NOT NULL,

    CONSTRAINT "recommend_attribute_values_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."recommend_attributes" ADD CONSTRAINT "recommend_attributes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_values" ADD CONSTRAINT "recommend_attribute_values_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
