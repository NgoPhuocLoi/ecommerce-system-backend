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
CREATE TABLE "public"."shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "has_used_platform_before" BOOLEAN NOT NULL,
    "main_category_id_to_sell" INTEGER,
    "has_confirmed_email" BOOLEAN NOT NULL,
    "theme_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_methods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "order_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommend_attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "recommend_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommend_attribute_values" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "recommend_attribute_id" INTEGER NOT NULL,

    CONSTRAINT "recommend_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommend_attribute_of_category" (
    "id" SERIAL NOT NULL,
    "recommend_attribute_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "recommend_attribute_of_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."themes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "default_header_layout" TEXT NOT NULL DEFAULT '',
    "default_footer_layout" TEXT NOT NULL DEFAULT '',
    "recommended_for_category_id" INTEGER,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pages_in_theme" (
    "id" SERIAL NOT NULL,
    "theme_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "layout" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "show_in_navigation" BOOLEAN NOT NULL,

    CONSTRAINT "pages_in_theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
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
    "uploaded_thumbnail_id" INTEGER,

    CONSTRAINT "variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."product_attributes" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "recommend_attribute_id" INTEGER,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."attribute_values" (
    "id" SERIAL NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "recommend_attribute_value_id" INTEGER,

    CONSTRAINT "attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."variant_has_option_with_value" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "value_id" INTEGER NOT NULL,

    CONSTRAINT "variant_has_option_with_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."custom_product_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "custom_product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."online_shops" (
    "id" SERIAL NOT NULL,
    "theme_id" INTEGER NOT NULL,
    "default_header_layout" TEXT NOT NULL,
    "default_footer_layout" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "online_shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."online_shop_pages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "layout" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "show_in_navigation" BOOLEAN NOT NULL,
    "created_by_default" BOOLEAN NOT NULL,

    CONSTRAINT "online_shop_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."delivery_addresses" (
    "delivery_address_id" SERIAL NOT NULL,
    "province_name" TEXT NOT NULL,
    "province_id" INTEGER NOT NULL,
    "district_name" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "ward_name" TEXT NOT NULL,
    "ward_code" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "detail_address" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "is_deleted" BOOLEAN NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "delivery_addresses_pkey" PRIMARY KEY ("delivery_address_id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."customers" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."payments" (
    "payment_id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatusId" INTEGER NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."orders" (
    "order_id" SERIAL NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "total_discount" DOUBLE PRECISION NOT NULL,
    "final_price" DOUBLE PRECISION NOT NULL,
    "shipping_fee" DOUBLE PRECISION NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "delivery_address_id" INTEGER NOT NULL,
    "current_status_id" INTEGER NOT NULL,
    "used_coupon_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."order_details" (
    "order_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("order_id","variant_id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."coupons" (
    "coupon_id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "collected_quantity" INTEGER NOT NULL DEFAULT 0,
    "current_use" INTEGER NOT NULL DEFAULT 0,
    "minumin_price_to_use" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("coupon_id")
);

-- CreateTable
CREATE TABLE "tenantSpecific"."collected_coupons" (
    "customer_id" INTEGER NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collected_coupons_pkey" PRIMARY KEY ("customer_id","coupon_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "public"."accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "shops_domain_key" ON "public"."shops"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "tenantSpecific"."customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "tenantSpecific"."payments"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "tenantSpecific"."coupons"("code");

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shops" ADD CONSTRAINT "shops_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shops" ADD CONSTRAINT "shops_main_category_id_to_sell_fkey" FOREIGN KEY ("main_category_id_to_sell") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shops" ADD CONSTRAINT "shops_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_values" ADD CONSTRAINT "recommend_attribute_values_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_of_category" ADD CONSTRAINT "recommend_attribute_of_category_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommend_attribute_of_category" ADD CONSTRAINT "recommend_attribute_of_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."themes" ADD CONSTRAINT "themes_recommended_for_category_id_fkey" FOREIGN KEY ("recommended_for_category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pages_in_theme" ADD CONSTRAINT "pages_in_theme_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."products" ADD CONSTRAINT "products_custom_product_type_id_fkey" FOREIGN KEY ("custom_product_type_id") REFERENCES "tenantSpecific"."custom_product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."products_images" ADD CONSTRAINT "products_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."products_images" ADD CONSTRAINT "products_images_uploaded_image_id_fkey" FOREIGN KEY ("uploaded_image_id") REFERENCES "tenantSpecific"."uploaded_images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variants" ADD CONSTRAINT "variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variants" ADD CONSTRAINT "variants_uploaded_thumbnail_id_fkey" FOREIGN KEY ("uploaded_thumbnail_id") REFERENCES "tenantSpecific"."uploaded_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."product_attributes" ADD CONSTRAINT "product_attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenantSpecific"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."product_attributes" ADD CONSTRAINT "product_attributes_recommend_attribute_id_fkey" FOREIGN KEY ("recommend_attribute_id") REFERENCES "public"."recommend_attributes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."attribute_values" ADD CONSTRAINT "attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "tenantSpecific"."product_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."attribute_values" ADD CONSTRAINT "attribute_values_recommend_attribute_value_id_fkey" FOREIGN KEY ("recommend_attribute_value_id") REFERENCES "public"."recommend_attribute_values"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "tenantSpecific"."product_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "tenantSpecific"."attribute_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."variant_has_option_with_value" ADD CONSTRAINT "variant_has_option_with_value_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "tenantSpecific"."variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."online_shops" ADD CONSTRAINT "online_shops_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "tenantSpecific"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."payments" ADD CONSTRAINT "payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."payments" ADD CONSTRAINT "payments_paymentStatusId_fkey" FOREIGN KEY ("paymentStatusId") REFERENCES "public"."payment_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "tenantSpecific"."orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."orders" ADD CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "tenantSpecific"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."orders" ADD CONSTRAINT "orders_current_status_id_fkey" FOREIGN KEY ("current_status_id") REFERENCES "public"."order_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."orders" ADD CONSTRAINT "orders_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "tenantSpecific"."delivery_addresses"("delivery_address_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."orders" ADD CONSTRAINT "orders_used_coupon_id_fkey" FOREIGN KEY ("used_coupon_id") REFERENCES "tenantSpecific"."coupons"("coupon_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "tenantSpecific"."orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."order_details" ADD CONSTRAINT "order_details_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "tenantSpecific"."variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."collected_coupons" ADD CONSTRAINT "collected_coupons_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "tenantSpecific"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenantSpecific"."collected_coupons" ADD CONSTRAINT "collected_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "tenantSpecific"."coupons"("coupon_id") ON DELETE RESTRICT ON UPDATE CASCADE;
