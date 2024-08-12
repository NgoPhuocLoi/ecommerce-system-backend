CREATE TABLE "tenantSpecific"."products" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "compare_at_price" DOUBLE PRECISION NOT NULL,
    "available_quantity" INTEGER NOT NULL,
    "incoming_quantity" INTEGER NOT NULL,
    "sold_number" INTEGER NOT NULL,
    "custom_product_type_id" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenantSpecific"."products_images" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "uploaded_image_id" INTEGER NOT NULL,

    CONSTRAINT "products_images_pkey" PRIMARY KEY ("id")
);

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

CREATE TABLE "tenantSpecific"."product_options" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenantSpecific"."option_values" (
    "id" SERIAL NOT NULL,
    "option_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "option_values_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenantSpecific"."variant_has_option_with_value" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    "value_id" INTEGER NOT NULL,

    CONSTRAINT "variant_has_option_with_value_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenantSpecific"."custom_product_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "custom_product_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenantSpecific"."uploaded_images" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "uploaded_images_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenantSpecific"."online_shop_pages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "layout" TEXT NOT NULL,

    CONSTRAINT "online_shop_pages_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "tenantSpecific"."products" ADD CONSTRAINT "products_custom_product_type_id_fkey" FOREIGN KEY ("custom_product_type_id") REFERENCES "tenantSpecific"."custom_product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tenantSpecific"."products_images" ADD CONSTRAINT "products_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tenantSpecific"."products_images" ADD CONSTRAINT "products_images_uploaded_image_id_fkey" FOREIGN KEY ("uploaded_image_id") REFERENCES "tenantSpecific"."uploaded_images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tenantSpecific"."variants" ADD CONSTRAINT "variants_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "tenantSpecific"."uploaded_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tenantSpecific"."product_options" ADD CONSTRAINT "product_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tenantSpecific"."option_values" ADD CONSTRAINT "option_values_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "tenantSpecific"."product_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "tenantSpecific"."product_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "tenantSpecific"."option_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "tenantSpecific"."variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
