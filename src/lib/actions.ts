"use server"

import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

/** Add a new SMTP account to the pool */
export async function addSmtpAccount(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return

  const label      = (formData.get("label") as string) || "Gmail Account"
  const host       = formData.get("host") as string
  const portStr    = formData.get("port") as string
  const port       = parseInt(portStr, 10)
  const userString = formData.get("userString") as string
  let   passString = formData.get("passString") as string

  passString = passString.replace(/\s+/g, "")

  if (!host || !port || !userString || !passString) return

  await prisma.smtpSettings.create({
    data: { userId: user.id, label, host, port, userString, passString, isActive: true }
  })

  revalidatePath("/dashboard/settings")
}

/** Preserve old name as alias so existing callers still work during migration */
export const saveSmtpSettings = addSmtpAccount

/** Toggle isActive on/off for a given SMTP account */
export async function toggleSmtpAccount(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return

  const id = formData.get("id") as string
  if (!id) return

  const existing = await prisma.smtpSettings.findUnique({ where: { id } })
  if (!existing) return

  await prisma.smtpSettings.update({
    where: { id },
    data: { isActive: !existing.isActive }
  })

  revalidatePath("/dashboard/settings")
}

/** Hard-delete an SMTP account */
export async function deleteSmtpAccount(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return

  const id = formData.get("id") as string
  if (!id) return

  await prisma.smtpSettings.delete({ where: { id } })
  revalidatePath("/dashboard/settings")
}

