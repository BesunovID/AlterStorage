export interface IUser {
    id?: number
    username: string
    email: string
    first_name?: string
    last_name?: string
    role?: string
    password: string
}

export enum UserEnumField {
    id = 'ID',
    username = 'Логин',
    email = 'Email',
    first_name = 'Имя',
    last_name = 'Фамилия',
    role = 'Роль',
    password = 'Пароль',
}

export type BaseField = {
    key: string
    value: Array<string> | Array<number>
    type: string
    required: boolean
    childrens?: Array<string>
    count?: number
    valueFrom?: string
    maxLength?: number
    minLength?: number
    selectable?: string
    selectData?: Array<Object>
    visable?: boolean
    subject?: string
}

export type BaseElement = {
    [field: string]: BaseField
}

type ListOfTables = {
    tables: {
        [table: string]: BaseElement
    }
    get: Function
}

export const defaultElementOfTable: ListOfTables = {
    tables: {
        'FIO_emploeey': {
            'id': {
                key: 'ID',
                value: [-1],
                required: false,
                type: 'number',
            },
            'surname': {
                key: 'Фамилия',
                value: [''],
                required: true,
                type: 'text',
                minLength: 1,
                maxLength: 255,
            },
            'name': {
                key: 'Имя',
                value: [''],
                type: 'text',
                required: true,
                minLength: 1,
                maxLength: 255,
            },
            'patronymic': {
                key: 'Отчество',
                value: [''],
                type: 'text',
                required: false,
                minLength: 0,
                maxLength: 255,
            },
            'post': {
                key: 'Должность',
                value: [''],
                type: 'text',
                required: false,
                minLength: 0,
                maxLength: 255,
            },
            'telephone': {
                key: 'Телефон',
                value: [''],
                type: 'text',
                required: false,
                minLength: 0,
                maxLength: 255,
            },
            'email': {
                key: 'Email',
                value: [''],
                type: 'email',
                required: false,
                minLength: 0,
                maxLength: 254,
            },
        },
        'assemblings': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'item': {
                key: 'Готовый продукт',
                value: [-1],
                type: 'number',
                required: true,
                visable: true,
                selectable: 'finished_product',
                valueFrom: 'name',
                selectData: [],
            },
            'description': {
                key: 'Описание сборки',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                minLength: 1,
                maxLength: 1000,
            },
        },
        'finished_product': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'name': {
                key: 'Наименование',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                minLength: 1,
                maxLength: 100,
            },
            'description': {
                key: 'Описание',
                value: [''],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 1000,
            },
        },
        'invoice_number': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false
            },
            'number_invoice': {
                key: 'Номер накладной',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                minLength: 1,
                maxLength: 255,
            },
            'date': {
                key: 'Дата',
                value: [''],
                type: 'datetime-local',
                required: false,
                visable: false
            },
            'positions': {
                key: 'Позиция',
                value: [''],
                type: 'string',
                required: true,
                visable: true,
                valueFrom: 'name_of_the_invoice',
                count: 1,
                childrens: ['id_2', 'name_of_the_invoice', 'actual_quantity', 'price_per_unit',
                    'manufacturer', 'quantity_invoice', 'summa', 'number_invoice_2', 
                    'storage_position', 'provider'],
            },
            'id_2': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
                subject: 'positions',
            },
            'name_of_the_invoice': {
                key: 'Наименование по накладной',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                subject: 'positions',
                minLength: 1,
                maxLength: 255,
            },
            'actual_quantity': {
                key: 'Фактическое кол-во',
                value: [-1],
                type: 'number',
                required: true,
                visable: true,
                subject: 'positions',
            },
            'storage_position': {
                key: 'Складская позиция',
                value: [-1],
                type: 'number',
                required: false,
                visable: true,
                subject: 'positions',
                selectable: 'storage_positions',
                selectData: [],
            },
            'price_per_unit': {
                key: 'Цена за единицу',
                value: [-1],
                type: 'number',
                required: true,
                visable: true,
                subject: 'positions',
            },
            'provider': {
                key: 'Поставщик',
                value: [-1],
                type: 'number',
                required: false,
                visable: true,
                subject: 'positions',
                selectable: 'provider',
                selectData: [],
            },
            'manufacturer': {
                key: 'Производитель',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                subject: 'positions',
                minLength: 1,
                maxLength: 255,
            },
            'quantity_invoice': {
                key: 'Количество по накладной',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
                subject: 'positions',
            },
            'summa': {
                key: 'Сумма',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
                subject: 'positions',
            },
            'number_invoice_2': {
                key: 'Номер накладной',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
                subject: 'positions',
            },
        },
        'provider': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'name': {
                key: 'Наименование',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                minLength: 1,
                maxLength: 255,
            },
            'refer_to': {
                key: 'Обращаться к ...',
                value: [''],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
            'address': {
                key: 'Адрес',
                value: [''],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
            'telephon': {
                key: 'Телефон',
                value: [''],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
            'email': {
                key: 'Email',
                value: [''],
                type: 'email',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
        },
        'rack': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'rack': {
                key: 'Номер',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                minLength: 1,
                maxLength: 50,
            },
        },
        'shelf': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'shell': {
                key: 'Номер',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                minLength: 1,
                maxLength: 50,
            },
        },
        'storage_positions': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'marking': {
                key: 'Обозначение',
                value: [''],
                type: 'text',
                required: true,
                minLength: 1,
                maxLength: 100,
                visable: true,
            },
            'name': {
                key: 'Наименование',
                value: [''],
                type: 'text',
                required: true,
                minLength: 1,
                maxLength: 200,
                visable: true,
            },
            'date': {
                key: 'Дата',
                value: [''],
                type: 'datetime-local',
                required: false,
                visable: false,
            },
            'count': {
                key: 'Общее количество',
                value: [-1],
                type: 'number',
                required: false,
                visable: true,
            },
            'units': {
                key: 'Единицы измерения',
                value: [-1],
                type: 'number',
                required: false,
                visable: true,
                selectable: 'unit_of_measur',
                valueFrom: 'name',
                selectData: [],
            },
            'rack': {
                key: 'Стеллаж',
                value: [-1],
                type: 'number',
                required: false,
                visable: true,
                selectable: 'rack',
                valueFrom: 'rack',
                selectData: [],
            },
            'shelf': {
                key: 'Полка',
                value: [-1],
                type: 'number',
                required: false,
                visable: true,
                selectable: 'shelf',
                valueFrom: 'shell',
                selectData: [],
            },
            'box': {
                key: 'Коробка',
                value: [''],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 100,
            },
            'price': {
                key: 'Цена за единицу',
                value: [-1],
                type: 'number',
                required: false,
                visable: true,
            },
            'comment': {
                key: 'Комментарий',
                value: [''],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 200,
            },
            'connectAssembling_Storage_Position': {
                key: 'connectAssembling_Storage_Position',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
                childrens: ['id_2', 'quantity', 'storage_position', 'assembling'],
            },
            'id_2': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'assembling': {
                key: 'Номер сборки',
                value: [-1],
                type: 'number',
                required: true,
                visable: true,
                selectable: 'assemblings',
                valueFrom: 'id',
                selectData: [],
            },
            'quantity': {
                key: 'Количество в сборке',
                value: [-1],
                type: 'number',
                required: true,
                visable: true,
            },
            'storage_position': {
                key: 'Номер складской позиции',
                value: [-1],
                type: 'number',
                required: false,
            },
        },
        'unit_of_measur': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'name': {
                key: 'Наименование',
                value: [''],
                type: 'text',
                required: true,
                visable: true,
                minLength: 1,
                maxLength: 100,
            },
            'full_name': {
                key: 'Полное наименование',
                value: [''],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 100,
            },
        },
        'write_down': {
            'id': {
                key: 'ID',
                value: [-1],
                type: 'number',
                required: false,
                visable: false,
            },
            'date': {
                key: 'Дата списания',
                value: [''],
                type: 'datetime-local',
                required: false,
                visable: true,
            },
            'count': {
                key: 'Количество',
                value: [-1],
                type: 'number',
                required: false,
                visable: true,
            },
            'storage_pos': {
                key: 'Позиция на складе',
                value: [-1],
                type: 'number',
                required: false,
            },
            'fio_employee': {
                key: 'Сотрудник',
                value: [-1],
                type: 'number',
                required: false,
            },
            'purpose': {
                key: 'Цель списания',
                value: [''],
                type: 'text',
                required: false,
                minLength: 0,
                maxLength: 100,
            },
        },
    },
    get: function(url: string) {
        const newObj: BaseElement = {};
        for(let field in defaultElementOfTable.tables[url]) {
           // newObj[field] = {...defaultElementOfTable.tables[url][field]};
            newObj[field] = {
                ...defaultElementOfTable.tables[url][field],
                value: [...defaultElementOfTable.tables[url][field].value as any]
            }
        }
        return newObj
    }
}

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

export type AlertStatus = 'success'|'erros'|'warning'|'info'

export interface IAlert {
    id: number,
    status: AlertStatus,
    message: string,
    timeout: number,
}
/*

export interface IData {
    id?: number
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
*/