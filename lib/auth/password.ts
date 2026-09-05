import { randomBytes, scrypt as scryptCallback } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(scryptCallback)

const KEY_LENGTH = 64

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')

  const derivedKey = (await scrypt(
    password,
    salt,
    KEY_LENGTH
  )) as Buffer

  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, storedKey] = storedHash.split(':')

  if (!salt || !storedKey) {
    return false
  }

  const derivedKey = (await scrypt(
    password,
    salt,
    KEY_LENGTH
  )) as Buffer

  return derivedKey.toString('hex') === storedKey
}