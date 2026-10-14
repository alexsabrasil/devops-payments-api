
const { test } = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = 'http://localhost:3001';

test('Deve rejeitar pagamento com valor negativo', async () => {
  const response = await fetch(`${BASE_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: -50,
      currency: 'BRL',
      user_id: 'usuario-teste'
    })
  });

  const data = await response.json();

  assert.equal(response.status, 400);
  assert.equal(
    data.error,
    'Invalid amount: must be a positive number'
  );
});

test('Deve rejeitar pagamento com valor zero', async () => {
  const response = await fetch(`${BASE_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 0,
      currency: 'BRL',
      user_id: 'usuario-teste'
    })
  });

  assert.equal(response.status, 400);
});

test('Deve rejeitar pagamento sem campos obrigatórios', async () => {
  const response = await fetch(`${BASE_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 100
    })
  });

  assert.equal(response.status, 400);
});


test('Deve criar e consultar um pagamento válido', async () => {
  const createResponse = await fetch(`${BASE_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 75.50,
      currency: 'BRL',
      user_id: 'usuario-teste-automatizado'
    })
  });

  assert.equal(createResponse.status, 201);

  const payment = await createResponse.json();

  assert.ok(payment.id);
  assert.equal(Number(payment.amount), 75.50);
  assert.equal(payment.currency, 'BRL');
  assert.ok(['COMPLETED', 'FAILED'].includes(payment.status));

  const getResponse = await fetch(
    `${BASE_URL}/api/payments/${payment.id}`
  );

  assert.equal(getResponse.status, 200);

  const retrievedPayment = await getResponse.json();

  assert.equal(retrievedPayment.id, payment.id);
  assert.equal(retrievedPayment.status, payment.status);
  assert.equal(Number(retrievedPayment.amount), 75.50);
});


test('Deve rejeitar moeda com formato inválido', async () => {
  const response = await fetch(`${BASE_URL}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 75.50,
      currency: 'br',
      user_id: 'usuario-teste'
    })
  });

  const data = await response.json();

  assert.equal(response.status, 400);
  assert.equal(
    data.error,
    'Invalid currency: must contain 3 uppercase letters'
  );
});

test('Deve rejeitar valor com mais de duas casas decimais', async () => {
  const response = await fetch(`${BASE_URL}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 75.555,
      currency: 'BRL',
      user_id: 'usuario-teste'
    })
  });

  const data = await response.json();

  assert.equal(response.status, 400);
  assert.equal(
    data.error,
    'Invalid amount: maximum 99999999.99 and up to 2 decimal places'
  );
});
