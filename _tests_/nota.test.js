require('./setup');
const request = require('supertest');
const app = require('../index');

let token;
let notaId;

beforeEach(async () => {
  // Registrar usuario antes de cada test
  const res = await request(app).post('/api/auth/registrar').send({
    nombre: 'Cami',
    correo: 'cami@test.com',
    contrasena: '123456',
  });
  token = res.body.token;

  // Crear una nota para los tests que la necesiten
  const notaRes = await request(app)
    .post('/api/nota')
    .set('x-auth-token', token)
    .send({
      titulo: 'Nota de prueba',
      nota: 'Contenido inicial',
    });

  notaId = notaRes.body._id;
});

describe('Notas - Endpoints protegidos', () => {
  it('✅ Crea una nota', async () => {
    const res = await request(app)
      .post('/api/nota')
      .set('x-auth-token', token)
      .send({
        titulo: 'Mi segunda nota',
        nota: 'Contenido nuevo',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Mi segunda nota');
    expect(res.body.completed).toBe(false);
  });

  it('❌ No permite crear nota sin token', async () => {
    const res = await request(app).post('/api/nota').send({
      titulo: 'Sin token',
      nota: 'fail',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('No hay token, permiso denegado');
  });

  it('📄 Obtiene todas las notas del usuario', async () => {
    const res = await request(app)
      .get('/api/notas')
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('🔍 Obtiene nota por ID', async () => {
    const res = await request(app)
      .get(`/api/notas/${notaId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(notaId);
    expect(res.body.titulo).toBe('Nota de prueba');
  });

  it('✏️ Actualiza la nota', async () => {
    const res = await request(app)
      .put(`/api/notas/${notaId}`)
      .set('x-auth-token', token)
      .send({
        titulo: 'Nota actualizada',
        nota: 'Nuevo contenido',
        completed: true,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Nota actualizada');
    expect(res.body.completed).toBe(true);
  });

  it('🗑️ Elimina la nota', async () => {
    const res = await request(app)
      .delete(`/api/notas/${notaId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Nota eliminada correctamente');
  });

  it('❌ No permite obtener nota sin token', async () => {
    const res = await request(app).get(`/api/notas/${notaId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('No hay token, permiso denegado');
  });

  it('❌ No permite actualizar nota sin token', async () => {
    const res = await request(app).put(`/api/notas/${notaId}`).send({
      titulo: 'Intento',
      nota: 'Fallido',
    });

    expect(res.statusCode).toBe(401);
  });

  it('❌ No permite eliminar nota sin token', async () => {
    const res = await request(app).delete(`/api/notas/${notaId}`);
    expect(res.statusCode).toBe(401);
  });
});
