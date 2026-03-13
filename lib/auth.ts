import bcrypt from 'bcryptjs'
import { getUserByEmail, type User } from './data'

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)
  if (!user) return null
  
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null
  
  return user
}

export function createSessionToken(userId: string): string {
  // Simple base64 encoded JSON for demo
  // In production, use proper JWT or session management
  return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64')
}

export function verifySessionToken(token: string): { userId: string } | null {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    if (data.exp < Date.now()) return null
    return { userId: data.userId }
  } catch {
    return null
  }
}
