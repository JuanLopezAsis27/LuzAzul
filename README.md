# Sistema Luz Azul — Control de Stock

Sistema integral de control de stock para la cadena Luz Azul. Permite registrar mermas, donaciones y consumo interno (refrigerio) por sucursal, con historial, reportes y exportación Excel.

## Quick Start

### Prerrequisitos

- Node.js >= 20
- pnpm >= 9
- Docker y Docker Compose

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Levantar base de datos

```bash
docker-compose up -d
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Variables requeridas en `.env`:

```env
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET="..."
JWT_REFRESH_SECRET="..."
```

### 4. Inicializar base de datos

```bash
pnpm db:generate   # Genera el cliente Prisma
pnpm db:push       # Sincroniza el schema con la DB
pnpm db:seed       # Carga datos iniciales
```

### 5. Iniciar servidor de desarrollo

```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### Credenciales iniciales

| Rol | Email | Contraseña |
|-----|-------|------------|
| Super Admin | ruben@luzazul.com | LuzAzul2026! |

---

## Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Rutas protegidas
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard con estadísticas del día
│   │       ├── layout.tsx        # Layout con auth guard
│   │       ├── cargas/           # Carga diaria de stock
│   │       ├── estados/          # Estados de productos
│   │       ├── historial/        # Historial de cargas
│   │       ├── perfil/           # Perfil del usuario
│   │       ├── productos/        # ABM de productos
│   │       ├── reportes/         # Reportes y gráficos
│   │       ├── sucursales/       # ABM de sucursales
│   │       └── usuarios/         # ABM de usuarios
│   ├── (public)/
│   │   └── login/                # Página de login
│   ├── api/                      # Route Handlers (Next.js)
│   │   ├── auth/                 # login, logout, refresh
│   │   ├── branches/             # CRUD sucursales
│   │   ├── daily-loads/          # CRUD cargas diarias
│   │   ├── dashboard/stats/      # Estadísticas del dashboard
│   │   ├── products/             # CRUD productos
│   │   ├── reports/              # history, summary
│   │   ├── states/               # CRUD estados
│   │   └── users/                # CRUD usuarios
│   ├── providers.tsx             # TanStack Query provider
│   ├── layout.tsx                # Root layout
│   └── manifest.ts               # PWA manifest
│
├── features/                     # Módulos por dominio
│   ├── auth/
│   │   ├── context.tsx           # AuthContext + useAuth hook
│   │   ├── hooks/
│   │   │   └── use-auth-fetch.ts # Fetch autenticado con auto-refresh
│   │   ├── api/handlers.ts       # Login / logout / refresh
│   │   └── index.ts              # Re-exports públicos
│   │
│   ├── branches/
│   │   ├── components/
│   │   │   └── BranchesPage.tsx
│   │   ├── hooks/
│   │   │   └── use-branches.ts   # useBranches, useBranchMutations
│   │   ├── api/
│   │   │   ├── handlers.ts
│   │   │   └── handlers-id.ts
│   │   └── types.ts
│   │
│   ├── users/
│   │   ├── components/
│   │   │   └── UsersPage.tsx
│   │   ├── hooks/
│   │   │   └── use-users.ts      # useUsers, useBranchesForSelect, useUserMutations
│   │   ├── api/
│   │   │   ├── handlers.ts
│   │   │   └── handlers-id.ts
│   │   └── types.ts
│   │
│   ├── products/
│   │   ├── components/
│   │   │   └── ProductsPage.tsx
│   │   ├── hooks/
│   │   │   └── use-products.ts   # useProducts, useActiveProducts, useProductMutations
│   │   ├── api/
│   │   │   ├── handlers.ts
│   │   │   └── handlers-id.ts
│   │   └── types.ts
│   │
│   ├── states/
│   │   ├── components/
│   │   │   └── StatesPage.tsx
│   │   ├── hooks/
│   │   │   └── use-states.ts     # useStates, useActiveStates, useStateMutations
│   │   ├── api/
│   │   │   ├── handlers.ts
│   │   │   └── handlers-id.ts
│   │   └── types.ts
│   │
│   ├── loads/
│   │   ├── components/
│   │   │   ├── LoadsPage.tsx
│   │   │   ├── BarcodeScannerModal.tsx
│   │   │   └── AdminLoadsCalendar.tsx
│   │   ├── hooks/
│   │   │   └── use-loads.ts      # useDailyLoad, usePendingItems, useLoadMutations
│   │   ├── api/
│   │   │   ├── handlers.ts
│   │   │   └── handlers-id.ts
│   │   └── types.ts
│   │
│   ├── reports/
│   │   ├── components/
│   │   │   └── ReportsPage.tsx
│   │   ├── hooks/
│   │   │   └── use-reports.ts    # useReportHistory, useReportAllData, useBranchesForReports
│   │   ├── api/
│   │   │   ├── history.ts
│   │   │   └── summary.ts
│   │   └── types.ts
│   │
│   └── dashboard/
│       ├── hooks/
│       │   └── use-dashboard-stats.ts  # useDashboardStats (auto-refresh 60s)
│       └── api/stats.ts
│
├── components/
│   ├── shared/
│   │   ├── sidebar.tsx           # Navegación principal
│   │   └── PWAInstallButton.tsx
│   ├── ui/                       # Componentes Shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   └── ServiceWorkerRegistration.tsx
│
├── hooks/
│   └── use-toast.ts              # Notificaciones toast
│
├── lib/
│   ├── auth.ts                   # Generación/verificación JWT
│   ├── auth-middleware.ts        # Protección de rutas de API
│   ├── db.ts                     # Singleton Prisma client
│   ├── validations.ts            # Schemas Zod
│   └── utils.ts                  # cn() utility
│
└── middleware.ts                 # Redirecciones auth (Next.js)

prisma/
├── schema.prisma                 # Modelos: User, Branch, Product, ProductState, DailyLoad, LoadItem, RefreshToken
├── migrations/
├── seed.ts
└── seed-dev.ts
```

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Shadcn/ui + Tailwind CSS |
| Estado servidor | TanStack Query 5 |
| Formularios | React Hook Form + Zod |
| ORM | Prisma 7 + PostgreSQL |
| Auth | JWT (access 15min + refresh 7d en httpOnly cookie) |
| Gráficos | Recharts |
| Exportación | xlsx |
| Barcode | BarcodeDetector API / ZXing fallback |
| PWA | Service Worker + Web Manifest |
| Bundler | Turbopack (dev) |
| Paquetes | pnpm 9+ |

---

## Arquitectura

### Feature modules

Cada feature es autocontenida con tres capas:

```
features/<nombre>/
├── hooks/         ← Lógica de datos (TanStack Query)
├── components/    ← UI (solo renderizado + estado local)
├── api/           ← Route handlers del servidor
└── types.ts       ← Interfaces TypeScript
```

Los **hooks** encapsulan todas las operaciones de red:
- `useXxx(params)` → consultas paginadas/filtradas
- `useXxxMutations()` → create/update/delete/reactivate con toast + cache invalidation

Los **componentes** solo manejan estado de UI: dialogs, formularios, paginación local.

### Roles y permisos

| Rol | Acceso |
|-----|--------|
| `SUPER_ADMIN` | Todo el sistema, todas las sucursales |
| `ADMIN` | Su sucursal: usuarios, cargas, reportes |
| `EMPLOYEE` | Solo carga diaria de su sucursal |

### Autenticación

- **Access token** (JWT, 15 min) en memoria del cliente
- **Refresh token** (JWT, 7 días) en cookie `httpOnly` + tabla `RefreshToken` en DB
- El hook `useAuthFetch` agrega el Bearer automáticamente y reintenta tras un 401
- Auto-refresh proactivo cada 13 minutos

### Base de datos

```
User ──→ Branch ──→ DailyLoad ──→ LoadItem ──→ Product
                                            └──→ ProductState
RefreshToken ──→ User
```

---

## Scripts disponibles

```bash
pnpm dev          # Servidor de desarrollo con Turbopack
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # ESLint

pnpm db:generate  # prisma generate
pnpm db:push      # prisma db push
pnpm db:migrate   # prisma migrate dev
pnpm db:seed      # ts-node prisma/seed.ts
pnpm db:studio    # prisma studio
```
