const { NODE_ENV } = process.env

export function getCorsURL() {
    return NODE_ENV === 'production'
        ? 'https://www.student.bth.se'
        : 'http://localhost:3000'
}
