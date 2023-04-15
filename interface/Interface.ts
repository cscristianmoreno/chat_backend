export interface userStruct {
    user_id: string,
    user_name: string,
    user_lastname: string,
    user_photo: string
}

export interface contactStruct {
    id: number,
    contactOf?: number,
    name: string,
    photo: string,
}

export interface messageStruct {
    sender: number,
    received: number,
    message: string,
    date: string
}

export interface authStruct {
    code: number,
    status: boolean
}

export interface userRegisterStruct {
    id: number,
    email: string,
    password: string,
    name: string, 
    lastname: string, 
    photo: string
}

export interface initializeDatabase {
    initialize(): void
}

export interface queryStruct {
    query: string,
    values?: unknown
}