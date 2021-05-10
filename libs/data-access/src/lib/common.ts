export interface ApiFindAllQuery {
    limit?: number;
    offset?: number;
}

export interface ApiListResults<T> {
    count: number;
    data: T[];
}
