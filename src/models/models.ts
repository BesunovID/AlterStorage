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
export type BaseElement = {
    [field: string]: { 
        key: string
        value: string | undefined
        type: string
        required: boolean
        readonly?: boolean
        maxLength?: number
        minLength?: number
    } | [{
        [field: string]: { 
            key: string
            value: string | undefined
            type: string
            required: boolean
            readonly?: boolean
            maxLength?: number
            minLength?: number
        }
    }]
}

type TableOfBaseElement = {
    [table: string]: BaseElement | Function
}

export const defaultElementOfTable: TableOfBaseElement = {
    'FIO_emploeey': {
        id: {
            key: 'ID',
            value: undefined,
            required: false,
            type: 'number',
        },
        surname: {
            key: 'Фамилия',
            value: '',
            required: true,
            type: 'text',
            minLength: 1,
            maxLength: 255,
        },
        name: {
            key: 'Имя',
            value: '',
            type: 'text',
            required: false,
            minLength: 1,
            maxLength: 255,
        },
        patronymic: {
            key: 'Отчество',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 255,
        },
        post: {
            key: 'Должность',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 255,
        },
        telephone: {
            key: 'Телефон',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 255,
        },
        email: {
            key: 'Email',
            value: '',
            type: 'email',
            required: false,
            minLength: 0,
            maxLength: 254,
        },
    },
    'assemblings': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
        },
        item: {
            key: 'Готовый продукт',
            value: undefined,
            type: 'number',
            required: true,
        },
        description: {
            key: 'Описание сборки',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 1000,
        },
    },
    'finished_product': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
        },
        name: {
            key: 'Наименование',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 100,
        },
        description: {
            key: 'Описание сборки',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 1000,
        },
    },
    'invoice_number': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
        },
        number_invoice: {
            key: 'Номер накладной',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 255,
        },
        date: {
            key: 'Дата',
            value: '',
            type: 'datetime-local',
            required: false,
            readonly: true,
        },
        positions: [
            {
                id: {
                    key: 'ID',
                    value: undefined,
                    type: 'number',
                    required: false,
                    readonly: true,
                },
                name_of_the_invoice: {
                    key: 'Наименование по накладной',
                    value: '',
                    type: 'text',
                    required: true,
                    minLength: 1,
                    maxLength: 255,
                },
                actual_quantity: {
                    key: 'Фактическое число',
                    value: undefined,
                    type: 'number',
                    required: false,
                },
                price_per_unit: {
                    key: 'Цена за единицу',
                    value: undefined,
                    type: 'number',
                    required: true,
                },
                manufacturer: {
                    key: 'Производитель',
                    value: '',
                    type: 'text',
                    required: true,
                    minLength: 1,
                    maxLength: 255,
                },
                quantity_invoice: {
                    key: 'Количество по накладной',
                    value: undefined,
                    type: 'text',
                    required: false,
                },
                summa: {
                    key: 'Сумма',
                    value: undefined,
                    type: 'text',
                    required: false,
                },
                number_invoice: {
                    key: 'Номер накладной',
                    value: undefined,
                    type: 'text',
                    required: false,
                },
                storage_position: {
                    key: 'Складская позиция',
                    value: undefined,
                    type: 'text',
                    required: false,
                },
                provider: {
                    key: 'Поставщик',
                    value: undefined,
                    type: 'text',
                    required: false,
                },
            },
        ],
    },
    'provider': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
            readonly: true,
        },
        name: {
            key: 'Наименование',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 255,
        },
        refer_to: {
            key: 'Обращаться к ...',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 255,
        },
        address: {
            key: 'Адрес',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 255,
        },
        telephon: {
            key: 'Телефон',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 255,
        },
        email: {
            key: 'Email',
            value: '',
            type: 'email',
            required: false,
            minLength: 0,
            maxLength: 255,
        },
    },
    'rack': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
            readonly: true,
        },
        rack: {
            key: 'Номер',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 50,
        },
    },
    'shelf': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
            readonly: true,
        },
        shell: {
            key: 'Номер',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 50,
        },
    },
    'storage_positions': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
        },
        marking: {
            key: 'Обозначение',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 100,
        },
        name: {
            key: 'Наименование',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 200,
        },
        date: {
            key: 'Дата',
            value: '',
            type: 'datetime-local',
            required: false,
            readonly: true,
        },
        count: {
            key: 'Общее количество',
            value: undefined,
            type: 'number',
            required: false,
        },
        units: {
            key: 'Единицы измерения',
            value: undefined,
            type: 'number',
            required: false,
        },
        rack: {
            key: 'Стеллаж',
            value: undefined,
            type: 'number',
            required: false,
        },
        shelf: {
            key: 'Полка',
            value: undefined,
            type: 'number',
            required: false,
        },
        box: {
            key: 'Коробка',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 100,
        },
        price: {
            key: 'Цена за единицу',
            value: undefined,
            type: 'number',
            required: false,
        },
        comment: {
            key: 'Комментарий',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 200,
        },
        connectAssembling_Storage_Position: [{
            id: {
                key: 'ID',
                value: undefined,
                type: 'number',
                required: false,
            },
            quantity: {
                key: 'Количество в сборке',
                value: undefined,
                type: 'number',
                required: false,
            },
            storage_position: {
                key: 'Номер складской позиции',
                value: undefined,
                type: 'number',
                required: false,
            },
            assembling: {
                key: 'Номер сборки',
                value: undefined,
                type: 'number',
                required: true,
            },
        }]
    },
    'unit_of_measure': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
        },
        name: {
            key: 'Наименование',
            value: '',
            type: 'text',
            required: true,
            minLength: 1,
            maxLength: 100,
        },
        full_name: {
            key: 'Полное наименование',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 100,
        },
    },
    'write_down': {
        id: {
            key: 'ID',
            value: undefined,
            type: 'number',
            required: false,
            readonly: true,
        },
        date: {
            key: 'Дата списания',
            value: '',
            type: 'datetime-local',
            required: false,
            readonly: true
        },
        count: {
            key: 'Количество',
            value: undefined,
            type: 'number',
            required: false,
        },
        storage_pos: {
            key: 'Позиция на складе',
            value: undefined,
            type: 'number',
            required: false,
        },
        fio_employee: {
            key: 'Сотрудник',
            value: undefined,
            type: 'number',
            required: false,
        },
        purpose: {
            key: 'Цель списания',
            value: '',
            type: 'text',
            required: false,
            minLength: 0,
            maxLength: 100,
        },
    },
    'get': function(url: string): BaseElement {
        if ()
        return this[url as string]
    }
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
