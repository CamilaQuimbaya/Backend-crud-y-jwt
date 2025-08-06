require('./setup')

const request = require('supertest')
const app = require('../index');


const userData = {
    nombre: 'Test User',
    correo: 'test@gmail.com',
    contrasena: 'test1234'
};  

describe('Auth - Registro', () => {
    it('Registra un nuevo usuario correctamente', async () => {
        const res = await request(app)
            .post('/api/auth/registrar')
            .send(userData);
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
    });

    it('No permite registrar con correo repetido', async () => {

        // Primero registramos un usuario
        await request(app).post('/api/auth/registrar').send({
            nombre: 'Test User',
            correo: 'test@gmail.com',
            contrasena: 'test1234'
        })

        // Luego intentamos registrar el mismo correo

        const res = await request(app).post('/api/auth/registrar').send({
            nombre: 'Otro Usuario',
            correo: 'test@gmail.com',
            contrasena: 'test1234'
        })

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('El usuario ya existe');
    });

});

describe('Auth - Login', () => {
    beforeEach(async () => {
        await request(app).post('/api/auth/registrar').send(userData);
    });

    it('✅ Hace login correctamente', async () => {
        const res = await request(app).post('/api/auth/login').send({
            correo: userData.correo,
            contrasena: userData.contrasena
        }) 


        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(typeof res.body.token).toBe('string');
    });

    it('❌ Falla con contraseña incorrecta', async () => {
        const res = await request(app).post('/api/auth/login').send({
            correo: userData.correo,
            contrasena: 'wrongpassword'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('Contraseña incorrecta');
    })

    it('❌ falla si el usuario no existe', async () => {
        const res = await request(app).post('/api/auth/login').send({
            correo: 'inexistente@gmail.com',
            contrasena: 'wrongpassword'
        });


        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('El usuario no existe');
    });

    it('❌ FALLA si no se envia ningun dato', async () => {
        const res = await request(app).post('/api/auth/login').send({})

        expect(res.statusCode).toBe(400);
    })
})