import { sql } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import bcrypt from 'bcryptjs';

export const adminModel = pgTable("adminModel", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role : varchar({ length: 255 }).notNull(),
  created: timestamp({ withTimezone: true }).defaultNow(),
  updated: timestamp({ withTimezone: true }),
  tokenVersion : integer().default(0),

});



export class User {
  public email: string;
  public password: string;

  constructor(email: string , password: string) {
    this.email = email;
    this.password = password;
  }
  
  async hashPassword(): Promise<void> 
  {
    this.password = await bcrypt.hash(this.password,10)
  }
  async comparePassword(password: string): Promise<boolean>
  {
    return await bcrypt.compare(password,this.password)
  }

}
