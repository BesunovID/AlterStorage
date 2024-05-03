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
    value: Array<string>
    visableValue: Array<string>
    valueFrom: string[]
    visable: boolean
    type: string
    required: boolean
    childrens?: Array<string>
    count?: number
    main?: boolean
    maxLength?: number
    minLength?: number
    selectable?: string
    selectData?: Array<Object>
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
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                required: false,
                visable: false,
                type: 'number',
            },
            'surname': {
                key: 'Фамилия',
                value: [''],
                visableValue: [''],
                valueFrom: ['surname'],
                required: true,
                visable: true,
                main: true,
                type: 'text',
                minLength: 1,
                maxLength: 255,
            },
            'name': {
                key: 'Имя',
                value: [''],
                visableValue: [''],
                valueFrom: ['name'],
                type: 'text',
                required: true,
                visable: true,
                main: true,
                minLength: 1,
                maxLength: 255,
            },
            'patronymic': {
                key: 'Отчество',
                value: [''],
                visableValue: [''],
                valueFrom: ['patronymic'],
                type: 'text',
                required: false,
                visable: true,
                main: true,
                minLength: 0,
                maxLength: 255,
            },
            'post': {
                key: 'Должность',
                value: [''],
                visableValue: [''],
                valueFrom: ['post'],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
            'telephone': {
                key: 'Телефон',
                value: [''],
                visableValue: [''],
                valueFrom: ['telephone'],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
            'email': {
                key: 'Email',
                value: [''],
                visableValue: [''],
                valueFrom: ['email'],
                type: 'email',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 254,
            },
        },
        'assemblings': {
            'id': {
                key: 'ID',
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false,
            },
            'item': {
                key: 'Готовый продукт',
                value: [''],
                visableValue: [''],
                valueFrom: ['name'],
                type: 'number',
                required: true,
                visable: true,
                main: true,
                selectable: 'finished_product',
                selectData: [],
            },
            'description': {
                key: 'Описание сборки',
                value: [''],
                visableValue: [''],
                valueFrom: ['description'],
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
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false,
            },
            'name': {
                key: 'Наименование',
                value: [''],
                visableValue: [''],
                valueFrom: ['name'],
                type: 'text',
                required: true,
                visable: true,
                main: true,
                minLength: 1,
                maxLength: 100,
            },
            'description': {
                key: 'Описание',
                value: [''],
                visableValue: [''],
                valueFrom: ['description'],
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
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false
            },
            'number_invoice': {
                key: 'Номер накладной',
                value: [''],
                visableValue: [''],
                valueFrom: ['number_invoice'],
                type: 'text',
                required: true,
                visable: true,
                main: true,
                minLength: 1,
                maxLength: 255,
            },
            'date': {
                key: 'Дата',
                value: [''],
                visableValue: [''],
                valueFrom: ['date'],
                type: 'datetime-local',
                required: false,
                visable: false
            },
            'positions': {
                key: 'Позиция',
                value: [''],
                visableValue: [''],
                valueFrom: ['name_of_the_invoice'],
                type: 'string',
                required: true,
                visable: true,
                count: 1,
                childrens: ['id_2', 'name_of_the_invoice', 'actual_quantity', 'price_per_unit',
                    'manufacturer', 'quantity_invoice', 'summa', 'number_invoice_2', 
                    'storage_position', 'provider'],
            },
            'id_2': {
                key: 'ID',
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id_2'],
                type: 'number',
                required: false,
                visable: false,
                subject: 'positions',
            },
            'name_of_the_invoice': {
                key: 'Наименование по накладной',
                value: [''],
                visableValue: [''],
                valueFrom: ['name_of_the_invoice'],
                type: 'text',
                required: true,
                visable: true,
                subject: 'positions',
                minLength: 1,
                maxLength: 255,
            },
            'actual_quantity': {
                key: 'Фактическое кол-во',
                value: [''],
                visableValue: [''],
                valueFrom: ['actual_quantity'],
                type: 'number',
                required: true,
                visable: true,
                subject: 'positions',
            },
            'storage_position': {
                key: 'Складская позиция',
                value: [''],
                visableValue: [''],
                valueFrom: ['marking', 'name'],
                type: 'number',
                required: true,
                visable: true,
                subject: 'positions',
                selectable: 'storage_positions',
                selectData: [],
            },
            'price_per_unit': {
                key: 'Цена за единицу',
                value: [''],
                visableValue: [''],
                valueFrom: ['price_per_unit'],
                type: 'number',
                required: true,
                visable: true,
                subject: 'positions',
            },
            'provider': {
                key: 'Поставщик',
                value: [''],
                visableValue: [''],
                valueFrom: ['name'],
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
                visableValue: [''],
                valueFrom: ['manufacturer'],
                type: 'text',
                required: true,
                visable: true,
                subject: 'positions',
                minLength: 1,
                maxLength: 255,
            },
            'quantity_invoice': {
                key: 'Количество по накладной',
                value: [''],
                visableValue: [''],
                valueFrom: ['quantity_invoice'],
                type: 'number',
                required: false,
                visable: false,
                subject: 'positions',
            },
            'summa': {
                key: 'Сумма',
                value: [''],
                visableValue: [''],
                valueFrom: ['summa'],
                type: 'number',
                required: false,
                visable: false,
                subject: 'positions',
            },
            'number_invoice_2': {
                key: 'Номер накладной',
                value: [''],
                visableValue: [''],
                valueFrom: ['number_invoice_2'],
                type: 'number',
                required: false,
                visable: false,
                subject: 'positions',
            },
        },
        'provider': {
            'id': {
                key: 'ID',
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false,
            },
            'name': {
                key: 'Наименование',
                value: [''],
                visableValue: [''],
                valueFrom: ['name'],
                type: 'text',
                required: true,
                visable: true,
                main: true,
                minLength: 1,
                maxLength: 255,
            },
            'refer_to': {
                key: 'Обращаться к ...',
                value: [''],
                visableValue: [''],
                valueFrom: ['refer_to'],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
            'address': {
                key: 'Адрес',
                value: [''],
                visableValue: [''],
                valueFrom: ['address'],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
            'telephon': {
                key: 'Телефон',
                value: [''],
                visableValue: [''],
                valueFrom: ['telephon'],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 255,
            },
            'email': {
                key: 'Email',
                value: [''],
                visableValue: [''],
                valueFrom: ['email'],
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
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false,
            },
            'rack': {
                key: 'Номер',
                value: [''],
                visableValue: [''],
                valueFrom: ['rack'],
                type: 'text',
                required: true,
                visable: true,
                main: true,
                minLength: 1,
                maxLength: 50,
            },
        },
        'shelf': {
            'id': {
                key: 'ID',
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false,
            },
            'shell': {
                key: 'Номер',
                value: [''],
                visableValue: [''],
                valueFrom: ['shell'],
                type: 'text',
                required: true,
                visable: true,
                main: true,
                minLength: 1,
                maxLength: 50,
            },
        },
        'storage_positions': {
            'id': {
                key: 'ID',
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false,
            },
            'marking': {
                key: 'Обозначение',
                value: [''],
                visableValue: [''],
                valueFrom: ['marking'],
                type: 'text',
                required: true,
                minLength: 1,
                maxLength: 100,
                visable: true,
                main: true,
            },
            'name': {
                key: 'Наименование',
                value: [''],
                visableValue: [''],
                valueFrom: ['name'],
                type: 'text',
                required: true,
                minLength: 1,
                maxLength: 200,
                visable: true,
                main: true,
            },
            'date': {
                key: 'Дата',
                value: [''],
                visableValue: [''],
                valueFrom: ['date'],
                type: 'datetime-local',
                required: false,
                visable: false,
            },
            'count': {
                key: 'Общее количество',
                value: [''],
                visableValue: [''],
                valueFrom: ['count'],
                type: 'number',
                required: false,
                visable: true,
            },
            'units': {
                key: 'Единицы измерения',
                value: [''],
                visableValue: [''],
                valueFrom: ['name'],
                type: 'number',
                required: false,
                visable: true,
                selectable: 'unit_of_measur',
                selectData: [],
            },
            'rack': {
                key: 'Стеллаж',
                value: [''],
                visableValue: [''],
                valueFrom: ['rack'],
                type: 'number',
                required: false,
                visable: true,
                selectable: 'rack',
                selectData: [],
            },
            'shelf': {
                key: 'Полка',
                value: [''],
                visableValue: [''],
                valueFrom: ['shell'],
                type: 'number',
                required: false,
                visable: true,
                selectable: 'shelf',
                selectData: [],
            },
            'box': {
                key: 'Коробка',
                value: [''],
                visableValue: [''],
                valueFrom: ['box'],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 100,
            },
            'price': {
                key: 'Цена за единицу',
                value: [''],
                visableValue: [''],
                valueFrom: ['price'],
                type: 'number',
                required: false,
                visable: true,
            },
            'comment': {
                key: 'Комментарий',
                value: [''],
                visableValue: [''],
                valueFrom: ['comment'],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 200,
            },
            'connectAssembling_Storage_Position': {
                key: 'Сборка ',
                value: [''],
                visableValue: [''],
                valueFrom: ['assembling', 'quantity'],
                type: 'text',
                required: true,
                visable: true,
                count: 1,
                childrens: ['id_2', 'quantity', 'storage_position_2', 'assembling'],
            },
            'id_2': {
                key: 'ID',
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id_2'],
                type: 'number',
                required: false,
                visable: false,
                subject: 'connectAssembling_Storage_Position',
            },
            'assembling': {
                key: 'Номер сборки',
                value: [''],
                visableValue: [''],
                valueFrom: ['item'],
                type: 'number',
                required: true,
                visable: true,
                selectable: 'assemblings',
                selectData: [],
                subject: 'connectAssembling_Storage_Position',
            },
            'quantity': {
                key: 'Количество в сборке',
                value: [''],
                visableValue: [''],
                valueFrom: ['quantity'],
                type: 'number',
                required: true,
                visable: true,
                subject: 'connectAssembling_Storage_Position',
            },
            'storage_position_2': {
                key: 'Номер складской позиции',
                value: [''],
                visableValue: [''],
                valueFrom: ['storage_position_2'],
                type: 'number',
                visable: false,
                required: false,
                subject: 'connectAssembling_Storage_Position',
            },
        },
        'unit_of_measur': {
            'id': {
                key: 'ID',
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false,
            },
            'name': {
                key: 'Наименование',
                value: [''],
                visableValue: [''],
                valueFrom: ['name'],
                type: 'text',
                required: true,
                visable: true,
                main: true,
                minLength: 1,
                maxLength: 100,
            },
            'full_name': {
                key: 'Полное наименование',
                value: [''],
                visableValue: [''],
                valueFrom: ['full_name'],
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
                value: ['-1'],
                visableValue: [''],
                valueFrom: ['id'],
                type: 'number',
                required: false,
                visable: false,
            },
            'date': {
                key: 'Дата списания',
                value: [''],
                visableValue: [''],
                valueFrom: ['date'],
                type: 'datetime-local',
                required: false,
                visable: false,
            },
            'storage_pos': {
                key: 'Позиция на складе',
                value: [''],
                visableValue: [''],
                valueFrom: ['marking', 'name'],
                type: 'number',
                required: true,
                visable: true,
                main: true,
                selectable: 'storage_positions',
                selectData: [],
            },
            'count': {
                key: 'Количество',
                value: [''],
                visableValue: [''],
                valueFrom: ['count'],
                type: 'number',
                required: true,
                visable: true,
            },
            'fio_employee': {
                key: 'Сотрудник',
                value: [''],
                visableValue: [''],
                valueFrom: ['surname', 'post', 'telephone'],
                type: 'number',
                required: true,
                visable: true,
                selectable: 'FIO_emploeey',
                selectData: [],
            },
            'purpose': {
                key: 'Цель списания',
                value: [''],
                visableValue: [''],
                valueFrom: ['purpose'],
                type: 'text',
                required: false,
                visable: true,
                minLength: 0,
                maxLength: 100,
            },
        },
    },
    get: function(url: string) {
        const newObj: BaseElement = {};
        for(let field in defaultElementOfTable.tables[url]) {
            newObj[field] = {
                ...defaultElementOfTable.tables[url][field],
                value: [...defaultElementOfTable.tables[url][field].value],
                visableValue: [...defaultElementOfTable.tables[url][field].visableValue],
                valueFrom: [...defaultElementOfTable.tables[url][field].valueFrom],
            };
            if (defaultElementOfTable.tables[url][field].selectData !== undefined)
                newObj[field].selectData = [...defaultElementOfTable.tables[url][field].selectData as Object[]]
            
        }
        return newObj
    },
}

export enum urlList {
    'main' = 'Главная',
    'storage_positions' = 'Складские позиции',
    'assemblings' = 'Сборки',
    'finished_product' = 'Готовые продукты',
    'invoice_number' = 'Накладные',
    'write_down' ='Списания',
    'rack' = 'Стеллажи',
    'shelf' = 'Полки',
    'provider' = 'Поставщики',
    'unit_of_measur' = 'Единицы измерения',
    'FIO_emploeey' = 'Сотрудники',
}

export type ParticlesDots = {
    size: number
    x: number
    y: number
    deg: number
}

export type AlertStatus = 'success'|'danger'|'warning'|'info'

export interface IAlert {
    id: number,
    status: AlertStatus,
    header: string,
    message: string,
    timeout?: number,
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