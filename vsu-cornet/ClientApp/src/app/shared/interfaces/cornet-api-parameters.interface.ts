export interface IClientParameters {
    search_type?: string;
    surname?: string;
    given1?: string;
    given2?: string;
    birth_year?: string;
    birth_year_range?: string;
    gender?: string;
    identifier_type?: string;
    identifier_text?: string;

    username?: string;
    fullname?: string;
    client?: string;
}

export interface ICornetParameters {
    event_id?: string;
    guid?: string;

    username?: string;
    fullname?: string;
    client?: string;
}