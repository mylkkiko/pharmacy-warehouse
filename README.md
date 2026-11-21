# Pharmacy Warehouse

A web app for running a hospital pharmacy warehouse. It tracks medicines, the batches they arrive in, and every movement of stock: receipts from suppliers, issues to hospital departments and write-offs of expired batches. It also shows what is about to expire, what is running low, and how much the warehouse has spent.

## Features

- **Sign-in with roles.** Admins and pharmacists sign in with email and password. Admin-only pages are protected, and deactivated users cannot sign in.
- **Dashboard.** Shows medicines below their minimum stock, batches expiring within 30 days, and expired batches.
- **Medicines.** A searchable catalogue with current stock per medicine. You can add and edit medicines.
- **Receipts.** Receive a new batch with its batch number, expiry date, quantity, unit price and supplier. Each receipt creates the batch and a movement in one transaction.
- **Stock.** Every batch currently in stock, with its expiry status (Expired, Expiring soon, OK). You can filter by status, search by medicine, and write off expired batches.
- **Issue (FEFO).** Dispense a medicine to a department. Stock is taken from the batches that expire first, expired batches are skipped, and a batch can never go below zero, even if two requests arrive at the same time.
- **Movements.** A journal of every receipt, issue and write-off.
- **Finance.** Money spent on receipts and value lost to write-offs, for this month, last month or all time.
- **User management (admins only).** Create and edit users, change roles, and deactivate or reactivate accounts. You cannot deactivate yourself or remove the last active admin.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, server components, server actions), React 19, TypeScript
- [Mantine](https://mantine.dev) 9 for the UI, [Tabler Icons](https://tabler.io/icons)
- [Prisma](https://www.prisma.io) 7 with PostgreSQL (Neon), using the `@prisma/adapter-pg` driver adapter
- [Auth.js](https://authjs.dev) v5 (credentials provider, JWT sessions), passwords hashed with bcryptjs
- [Zod](https://zod.dev) 4 and React Hook Form for validation
- dayjs for dates

## Architecture

The data layer follows the Dependency Inversion Principle. The business logic depends on repository interfaces, not on Prisma.

```
page / server action  →  service  →  repository interface  ←  Prisma implementation
                                                                    ↑
                                    container.ts wires them together (composition root)
```

| Layer | Location | Responsibility |
| --- | --- | --- |
| Pages and server actions | `src/app`, `src/lib/actions` | Auth checks, input validation with Zod, calling services, revalidating and redirecting. They never import Prisma. |
| Services | `src/server/services` | Business rules: FEFO issue, write-off checks, password hashing, the "last admin" rule, finance totals. They import only the repository interfaces and domain errors. |
| Repository interfaces | `src/server/repositories/types.ts` | Domain types (`StockRecord`, `ReceiptRecord`, `UserRecord`, …) and interfaces (`BatchRepository`, `MovementRepository`, `MedicineRepository`, `UserRepository`, `TransactionRunner`). They don't depend on Prisma. |
| Prisma implementations | `src/server/repositories/prisma` | The only code that queries the database. Maps Prisma rows to domain types and turns Prisma errors into domain errors (for example a unique-constraint error becomes `DuplicateBatchError` or `DuplicateEmailError`). |
| Composition root | `src/server/container.ts` | Builds the Prisma repositories and passes them into the services. Pages and actions import ready-made services from here. |

Multi-step writes (receipt, issue, write-off) go through `TransactionRunner`. It hands the service a set of repositories bound to one database transaction, so the service never deals with Prisma's transaction API.

## Test accounts

`npx prisma db seed` creates these accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@pharmacy.test | admin123 |
| Pharmacist | pharmacist@pharmacy.test | pharm123 |

## Running locally

You need Node.js 20 or later and a PostgreSQL database (for example a free [Neon](https://neon.tech) project).

1. Copy `.env.example` to `.env` and fill it in:

   ```env
   DATABASE_URL=   # connection string used by the app and the seed (pooled on Neon)
   DIRECT_URL=     # direct connection string used by Prisma migrations
   AUTH_SECRET=    # random secret, e.g. from `npx auth secret`
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Apply the database migrations and generate the Prisma client (it is written to `src/generated/prisma`, which isn't committed):

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. Fill the database with test data:

   ```bash
   npx prisma db seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) and sign in with one of the test accounts.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the code with Prettier |
