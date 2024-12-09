import 'dotenv/config';
import axios from "axios";

const endpoint = `http://localhost:${process.env.PORT}/survey`;

describe('Survey', () => {

    test('Get All (status is 200)', async () => {
        const res = await axios.get(endpoint);

        expect(res.status).toBe(200);
    });

    test('Get All (is Array)', async () => {
        const res = await axios.get(endpoint);

        expect(res.data).toBeInstanceOf(Array);
    });

});