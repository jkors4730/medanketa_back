import 'dotenv/config';
import axios from "axios";

const endpoint = `http://localhost:${process.env.PORT}/user`;

describe('Users', () => {

    //#region Get All 
    test('Get All (status is 200)', async () => {
        const res = await axios.get(endpoint);

        expect(res.status).toBe(200);
    });

    test('Get All (is Array)', async () => {
        const res = await axios.get(endpoint);

        expect(res.data).toBeInstanceOf(Array);
    });
    //#endregion

    test('Get One (status is 200)', async () => {
        const res = await axios.get(`${endpoint}/1`);

        expect(res.status).toBe(200);
    });

    test('Get One (is Object)', async () => {
        const res = await axios.get(`${endpoint}/1`);

        expect(res.data).toBeInstanceOf(Object);
    });

});