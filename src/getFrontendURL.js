const { NODE_ENV } = process.env

export function getFrontendURL() {
    return NODE_ENV === 'production'
        ? 'https://www.student.bth.se/~pene14/editor/'
        : 'http://localhost:3000'
}
