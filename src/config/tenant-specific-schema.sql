

CREATE TABLE "tenantSpecific"."shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "tenantSpecific"."shops" ADD CONSTRAINT "shops_accountId_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;