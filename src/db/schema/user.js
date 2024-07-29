const { pgTable, serial, text, timestamp } = require("drizzle-orm/pg-core");

const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique(),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

module.exports = {
  accounts,
};
