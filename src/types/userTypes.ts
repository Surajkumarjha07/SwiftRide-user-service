
type signUpType = {
    email: string,
    name: string,
    password: string,
    role: string
}

type logInType = {
    email: string,
    password: string
}

type updateType = {
    newEmail: string,
    newName: string,
    newPassword: string,
    newRole: string,
    oldPassword: string,
    email: string
}

export type {signUpType, logInType, updateType};