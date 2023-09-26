import { IResponse } from "../entities/Response";

const ENDPOINT = 'https://mocki.io/v1/';
const API_OPTIONS = 'a0c6a5cb-b942-44dd-bac2-5460b86308fd';

export const getOptions = (): Promise<IResponse<string>> => {
    return fetch(ENDPOINT + API_OPTIONS)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then((json) => {
            const response: IResponse<string> = {
                status: 'OK',
                statusCode: 200,
                result: json,
            };
            return response;
        }).catch((error) => {
            console.error(error);
            const errorResponse: IResponse<string> = {
                status: 'KO',
                statusCode: 500,
                result: error,
            };
            return errorResponse;
        });
}