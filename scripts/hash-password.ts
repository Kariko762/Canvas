import bcrypt from 'bcryptjs'

async function hashPassword() {
  const password = 'password'
  const hashed = await bcrypt.hash(password, 10)
  console.log('Hashed password:', hashed)
}

hashPassword()
