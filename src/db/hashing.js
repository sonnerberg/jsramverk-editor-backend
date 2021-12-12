import bcrypt from 'bcrypt'

const saltRounds = 12
export async function hashPassword(plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
    return hashedPassword
}

export async function comparePasswords(plainPassword, hashedPassword) {
    const match = await bcrypt.compare(plainPassword, hashedPassword)
    return match
}
