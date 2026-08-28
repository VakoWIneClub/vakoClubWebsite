-- Registro de idempotencia para el sync Hostinger Ecommerce -> Printify (api/printify/sync-orders.js).
-- La API de fulfillment de Hostinger no está confirmada (su endpoint /orders/{id}/fulfill existe
-- pero no se pudo verificar el shape del body sin marcar como cumplido un pedido real), así que no
-- es confiable como única fuente de "ya procesado" — si el POST de fulfill falla en silencio, el
-- próximo polling reprocesaría el mismo pedido y crearía un segundo pedido físico en Printify. Esta
-- tabla es la fuente de verdad real: se inserta ANTES de llamar a Printify (reclama el pedido), así
-- que dos corridas superpuestas del sync no pueden procesar el mismo hostinger_order_id dos veces.
--
-- Igual que founder_claims: solo lo escribe/lee el server con la service-role key. Nadie necesita
-- verlo desde el sitio público, así que no hay política de RLS que dé acceso a anon/authenticated.
CREATE TABLE IF NOT EXISTS "public"."printify_synced_orders" (
    "hostinger_order_id" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "printify_order_id" "text",
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."printify_synced_orders" OWNER TO "postgres";

ALTER TABLE ONLY "public"."printify_synced_orders"
    ADD CONSTRAINT "printify_synced_orders_pkey" PRIMARY KEY ("hostinger_order_id");

ALTER TABLE ONLY "public"."printify_synced_orders"
    ADD CONSTRAINT "printify_synced_orders_status_check"
    CHECK ("status" = ANY (ARRAY['pending'::"text", 'sent'::"text", 'failed'::"text"]));

ALTER TABLE "public"."printify_synced_orders" ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON TABLE "public"."printify_synced_orders" TO "service_role";
