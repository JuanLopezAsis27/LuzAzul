import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const roleEnum = z.enum(["SUPER_ADMIN", "ADMIN", "EMPLOYEE"]);

export const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(1, "El nombre es requerido"),
  role: roleEnum,
  branchId: z.string().optional().nullable(),
});
export const updateUserSchema = z.object({
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(1).optional(),
  role: roleEnum.optional(),
  branchId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createBranchSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().optional().nullable(),
});
export const updateBranchSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;

export const createProductSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
});
export const updateProductSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const loadSectionEnum = z.enum(["MERMA", "DONACION", "REFRIGERIO"]);
export const loadUnitEnum = z.enum(["GRAMOS", "KILOGRAMOS", "LITROS", "UNIDAD"]);

export const createProductStateSchema = z.object({
  name: z.string().min(1, "El nombre del estado es requerido"),
  section: loadSectionEnum.optional().nullable(),
});
export const updateProductStateSchema = z.object({
  name: z.string().min(1).optional(),
  section: loadSectionEnum.optional().nullable(),
  isActive: z.boolean().optional(),
});
export type CreateProductStateInput = z.infer<typeof createProductStateSchema>;
export type UpdateProductStateInput = z.infer<typeof updateProductStateSchema>;

export const createLoadItemSchema = z.object({
  section: loadSectionEnum,
  quantity: z.number().positive("La cantidad debe ser mayor a 0"),
  unit: loadUnitEnum.optional().default("GRAMOS"),
  productId: z.string().min(1, "El producto es requerido"),
  stateId: z.string().optional().nullable(),
});
export const createDailyLoadSchema = z.object({
  items: z.array(createLoadItemSchema).min(1, "Debe agregar al menos un item"),
});
export const updateLoadItemSchema = z.object({
  id: z.string().optional(),
  section: loadSectionEnum,
  quantity: z.number().positive("La cantidad debe ser mayor a 0"),
  unit: loadUnitEnum.optional().default("GRAMOS"),
  productId: z.string().min(1, "El producto es requerido"),
  stateId: z.string().optional().nullable(),
});
export const updateDailyLoadSchema = z.object({
  items: z.array(updateLoadItemSchema),
  isClosed: z.boolean().optional(),
});
export type CreateLoadItemInput = z.infer<typeof createLoadItemSchema>;
export type CreateDailyLoadInput = z.infer<typeof createDailyLoadSchema>;
export type UpdateDailyLoadInput = z.infer<typeof updateDailyLoadSchema>;

export const reportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  branchId: z.string().optional(),
  section: loadSectionEnum.optional(),
  userId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(5000).default(20),
});
export type ReportFilterInput = z.infer<typeof reportFilterSchema>;
