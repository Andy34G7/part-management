CREATE TABLE "dropdown_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form1_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"emp_no" text NOT NULL,
	"emp_name" text NOT NULL,
	"project_code" text NOT NULL,
	"part_number" text NOT NULL,
	"part_name" text NOT NULL,
	"supplier" text NOT NULL,
	"mfg_process" text NOT NULL,
	"type_of_issue" text NOT NULL,
	"issue" text NOT NULL,
	"failure_mode" text NOT NULL,
	"starting_date" date NOT NULL,
	"ending_date" date NOT NULL,
	"solution" text NOT NULL,
	"standardisation" text NOT NULL,
	"attachment_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form2_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_code" text NOT NULL,
	"part_number" text NOT NULL,
	"part_name" text NOT NULL,
	"vendor_code" text NOT NULL,
	"vendor_name" text NOT NULL,
	"applicability" text NOT NULL,
	"dhr_project" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
