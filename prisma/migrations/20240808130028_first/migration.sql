-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "tenantSpecific";

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."products" (
    "id" SERIAL NOT NULL,
    "shop_id" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "compare_at_price" DOUBLE PRECISION NOT NULL,
    "available_quantity" INTEGER NOT NULL,
    "incoming_quantity" INTEGER NOT NULL,
    "sold_number" INTEGER NOT NULL,
    "custom_product_type_id" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."products_images" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "uploaded_image_id" INTEGER NOT NULL,

    CONSTRAINT "products_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "compare_at_price" DOUBLE PRECISION NOT NULL,
    "available_quantity" INTEGER NOT NULL,
    "incoming_quantity" INTEGER NOT NULL,
    "sold_number" INTEGER NOT NULL,
    "image_id" INTEGER,

    CONSTRAINT "variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."variant_options" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "variant_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."option_values" (
    "id" SERIAL NOT NULL,
    "option_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."variant_has_option_with_value" (
    "id" SERIAL NOT NULL,
    "option_id" INTEGER NOT NULL,
    "value_id" INTEGER NOT NULL,

    CONSTRAINT "variant_has_option_with_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."custom_product_types" (
    "id" SERIAL NOT NULL,
    "shop_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "custom_product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."uploaded_images" (
    "id" SERIAL NOT NULL,
    "shop_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "uploaded_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "public"."accounts"("email");

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."shops" ADD CONSTRAINT "shops_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."products" ADD CONSTRAINT "products_custom_product_type_id_fkey" FOREIGN KEY ("custom_product_type_id") REFERENCES "tenantSpecific"."custom_product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."products_images" ADD CONSTRAINT "products_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."products_images" ADD CONSTRAINT "products_images_uploaded_image_id_fkey" FOREIGN KEY ("uploaded_image_id") REFERENCES "tenantSpecific"."uploaded_images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variants" ADD CONSTRAINT "variants_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "tenantSpecific"."uploaded_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variant_options" ADD CONSTRAINT "variant_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."option_values" ADD CONSTRAINT "option_values_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "tenantSpecific"."variant_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "tenantSpecific"."variant_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "tenantSpecific"."option_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."custom_product_types" ADD CONSTRAINT "custom_product_types_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "tenantSpecific"."shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."uploaded_images" ADD CONSTRAINT "uploaded_images_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "tenantSpecific"."shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
