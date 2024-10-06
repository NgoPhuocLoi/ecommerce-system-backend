
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
CREATE TABLE "tenantSpecific"."uploaded_images" (
    "id" SERIAL NOT NULL,
    "uploaded_public_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_images_pkey" PRIMARY KEY ("id")
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
    "uploaded_thumbnail_id" INTEGER,

    CONSTRAINT "variants_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "tenantSpecific"."product_attributes" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "recommend_attribute_id" INTEGER,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "tenantSpecific"."attribute_values" (
    "id" SERIAL NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "recommend_attribute_value_id" INTEGER,

    CONSTRAINT "attribute_values_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "tenantSpecific"."variant_has_option_with_value" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "value_id" INTEGER NOT NULL,

    CONSTRAINT "variant_has_option_with_value_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "tenantSpecific"."custom_product_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "custom_product_types_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "tenantSpecific"."shop_profiles" (
    "id" SERIAL NOT NULL,
    "shop_id" TEXT NOT NULL,
    "has_used_platform_before" BOOLEAN NOT NULL,
    "main_category_id_to_sell" INTEGER,
    "has_confirmed_email" BOOLEAN NOT NULL,
    "theme_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_profiles_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "tenantSpecific"."online_shop_pages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "layout" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "show_in_navigation" BOOLEAN NOT NULL,
    "created_by_default" BOOLEAN NOT NULL,

    CONSTRAINT "online_shop_pages_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "shop_profiles_shop_id_key" ON "tenantSpecific"."shop_profiles"("shop_id");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."shops" ADD CONSTRAINT "shops_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."recommend_attribute_values" ADD CONSTRAINT "recommend_attribute_values_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."recommend_attribute_of_category" ADD CONSTRAINT "recommend_attribute_of_category_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."recommend_attribute_of_category" ADD CONSTRAINT "recommend_attribute_of_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."themes" ADD CONSTRAINT "themes_recommended_for_category_id_fkey" FOREIGN KEY ("recommended_for_category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."pages_in_theme" ADD CONSTRAINT "pages_in_theme_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."products" ADD CONSTRAINT "products_custom_product_type_id_fkey" FOREIGN KEY ("custom_product_type_id") REFERENCES "tenantSpecific"."custom_product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."products_images" ADD CONSTRAINT "products_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."products_images" ADD CONSTRAINT "products_images_uploaded_image_id_fkey" FOREIGN KEY ("uploaded_image_id") REFERENCES "tenantSpecific"."uploaded_images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."variants" ADD CONSTRAINT "variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."variants" ADD CONSTRAINT "variants_uploaded_thumbnail_id_fkey" FOREIGN KEY ("uploaded_thumbnail_id") REFERENCES "tenantSpecific"."uploaded_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."product_attributes" ADD CONSTRAINT "product_attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."product_attributes" ADD CONSTRAINT "product_attributes_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."attribute_values" ADD CONSTRAINT "attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "tenantSpecific"."product_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."attribute_values" ADD CONSTRAINT "attribute_values_recommend_attribute_value_id_fkey" FOREIGN KEY ("recommend_attribute_value_id") REFERENCES "public"."recommend_attribute_values"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "tenantSpecific"."product_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "tenantSpecific"."attribute_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "tenantSpecific"."variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."shop_profiles" ADD CONSTRAINT "shop_profiles_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."shop_profiles" ADD CONSTRAINT "shop_profiles_main_category_id_to_sell_fkey" FOREIGN KEY ("main_category_id_to_sell") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tenantSpecific"."shop_profiles" ADD CONSTRAINT "shop_profiles_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;