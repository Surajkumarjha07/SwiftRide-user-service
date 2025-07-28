
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

type deleteType = {
    userEmail: string,
    password: string
}

type updateType = {
    newEmail?: string,
    newName?: string,
    newPassword?: string,
    oldPassword: string,
    userEmail: string
}

export type { signUpType, logInType, updateType, deleteType };