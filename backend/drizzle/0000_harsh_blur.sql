CREATE TABLE IF NOT EXISTS "urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"longurl" text NOT NULL,
	"shorthash" text NOT NULL,
	"user_id" uuid,
	"created_at" text NOT NULL,
	CONSTRAINT "urls_longurl_unique" UNIQUE("longurl")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" text NOT NULL,
	"email" text NOT NULL,
	"is_active" boolean,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"count" integer
);
