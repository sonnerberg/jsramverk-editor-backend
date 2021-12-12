const { NODE_ENV } = process.env

export function getFrontendURL() {
    return NODE_ENV === 'production'
        ? 'http://www.student.bth.se'
        : 'http://localhost:3000'
}
