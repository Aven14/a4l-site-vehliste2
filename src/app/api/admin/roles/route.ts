import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user?.canManageRoles) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const roles = await prisma.role.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(roles)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user?.canManageRoles) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const data = await req.json()

  const role = await prisma.role.create({
    data: {
      name: data.name,
      canAccessAdmin: data.canAccessAdmin || false,
      canEditBrands: data.canEditBrands || false,
      canEditVehicles: data.canEditVehicles || false,
      canDeleteBrands: data.canDeleteBrands || false,
      canDeleteVehicles: data.canDeleteVehicles || false,
      canImport: data.canImport || false,
      canManageUsers: data.canManageUsers || false,
      canManageRoles: data.canManageRoles || false,
      isSystem: false,
    },
  })

  return NextResponse.json(role)
}
