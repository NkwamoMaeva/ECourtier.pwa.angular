export class Transaction {
    id: number;
    reference: string;
    creation_date: Date;
    amount: number;
    last_update: Date;
    idUser: number;
    idTransaction_type: number;
    idInsurer: number;
    short_name: string;
    path_file: string;
    data_file: string;
    columns: string;
}
