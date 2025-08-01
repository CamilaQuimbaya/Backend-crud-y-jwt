require('./setup')

const request = require('supertest')
const app = require('../index');
const Usuario = require('../models/Usuario')

describe('Auth', () => {
    it('Registra un nuevo usuario correctamente', async () => {
        const res = await request(app)
            .post('/api/auth/registrar')
            .send({
                nombre :'Test User',
                correo: 'test@gmail.com',
                contrasena: 'test1234'
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
    })

})