import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as any
  if (!currentUser?.canManageUsers) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const data = await req.json()

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { roleId: data.roleId },
    include: { role: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as any
  if (!currentUser?.canManageUsers) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const user = await prisma.user.findUnique({ 
    where: { id: params.id },
    include: { role: true }
  })
  
  if (user?.role?.name === 'superadmin') {
    return NextResponse.json({ error: 'Impossible de supprimer un superadmin' }, { status: 403 })
  }

  await prisma.user.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
