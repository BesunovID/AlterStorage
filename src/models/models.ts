export interface IData {
    id?: number
}

export interface IUser {
    username: string
    email: string
    first_name: string
    last_name: string
    role: string
    password: string
}

export interface IFIOemploeey extends IData {
    surname: string
    name: string
    patronymic?: string
    post?: string
    telephone?: string
    email?: string
}

export interface IAssembling extends IData {
    item: number
    description: string
}

export interface IFinishedProduct extends IData {
    name: string
    description?: string
}

export interface IInvoiceNumber extends IData {
    number_invoice: string
    data?: string
    positions: [
        {
            id?: number
            name_of_the_invoice: string
            actual_quantity?: number
            price_per_unit: number
            manufacturer: string
            quantity_invoice?: number
            summa?: number
            number_invoice?: number
            storage_position?: number
            provider?: number 
        }
    ]
}

export interface IProvider extends IData {
    name: string
    refer_to?: string
    address?: string
    telephon?: string
    email?: string
}

export interface IRack extends IData {
    rack: string
}

export interface IShelf extends IData {
    shell: string
}

export interface IStoragePosition extends IData {
    marking: string
    name: string
    date?: string
    count?: number
    units?: number
    rack?: number
    shelf?: number
    box?: string
    price?: number
    comment?: string
    connectAssembling_Storage_Position: [{
        id?: number
        quantity?: number
        storage_position?: number
        assembling: number
    }]
}

export interface IUnitOfMeasur extends IData {
    name: string
    full_name?: string
}

export interface IWriteDown extends IData {
    date?: string
    count?: number
    storage_pos?: number
    fio_employee?: number
    purpose?: string
}

export type AnyDataTable = IFIOemploeey | IAssembling | IFinishedProduct | IInvoiceNumber | IProvider | IRack | IShelf | IStoragePosition | IUnitOfMeasur | IWriteDown

export enum urlList {
    main = '',
    FIO_emploeey = 'FIO_emploeey',
    assemblings = 'assemblings',
    finished_product = 'finished_product',
    invoice_number = 'invoice_number',
    provider = 'provider',
    rack = 'rack',
    shelf = 'shelf',
    storage_positions = 'storage_positions',
    unit_of_measure = 'unit_of_measure',
    write_down ='write_down'
}

export type ParticlesDots = {
    size: number
    x: number
    y: number
    deg: number
}
