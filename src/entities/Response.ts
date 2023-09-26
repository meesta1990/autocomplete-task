export interface IResponse<T> {
    status: 'OK' | 'KO',
    statusCode: number;
    result: T;
}