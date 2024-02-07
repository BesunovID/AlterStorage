
export interface IProduct {
    id: number
    date: string
    name: string
    description: string
    amount: number
    equivalent: string
    price: number
}

export interface IRequest {
    id: number
    date: string
    name: string
    description: string
    amount: number
    equivalent: string
    price: number
}

export enum ProductEquivalent {
    ed = 'Штука',
    kg = 'Кг',
    ml = 'Мл',
}
