CREATE TABLE `debtors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`picture` text,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`birthday` text NOT NULL,
	`phone_number` text,
	`email` text,
	`facebook` text,
	`last_reminded` text
);
--> statement-breakpoint
CREATE TABLE `debts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`debtor_id` integer NOT NULL,
	`amount` real NOT NULL,
	`created_at` text NOT NULL,
	`due_date` text,
	`status` text DEFAULT 'UNPAID' NOT NULL,
	FOREIGN KEY (`debtor_id`) REFERENCES `debtors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`debtor_id` integer NOT NULL,
	`debt_id` integer NOT NULL,
	`amount` real NOT NULL,
	`paid_at` text NOT NULL,
	`method` text,
	FOREIGN KEY (`debtor_id`) REFERENCES `debtors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`debt_id`) REFERENCES `debts`(`id`) ON UPDATE no action ON DELETE cascade
);
