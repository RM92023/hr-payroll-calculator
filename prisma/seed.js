require('dotenv').config();
const { Client } = require('pg');
const { randomUUID } = require('crypto');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const rules = [
    {
      key: 'EMPLOYEE_HEALTH_PCT',
      label: 'Salud empleado (%)',
      contractType: 'EMPLOYEE',
      unit: 'PERCENT',
      value: 4,
      enabled: true,
    },
    {
      key: 'EMPLOYEE_PENSION_PCT',
      label: 'Pensión empleado (%)',
      contractType: 'EMPLOYEE',
      unit: 'PERCENT',
      value: 4,
      enabled: true,
    },
    {
      key: 'EMPLOYEE_WITHHOLDING_PCT',
      label: 'Retención empleado (%)',
      contractType: 'EMPLOYEE',
      unit: 'PERCENT',
      value: 10,
      enabled: true,
    },
    {
      key: 'CONTRACTOR_WITHHOLDING_PCT',
      label: 'Retención contratista (%)',
      contractType: 'CONTRACTOR',
      unit: 'PERCENT',
      value: 12,
      enabled: true,
    },
  ];

  for (const r of rules) {
    const id = randomUUID();
    await client.query(
      `INSERT INTO "PayrollRule" (id, key, label, "contractType", unit, value, enabled, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
       ON CONFLICT (key) DO UPDATE SET label = EXCLUDED.label, "contractType" = EXCLUDED."contractType", unit = EXCLUDED.unit, value = EXCLUDED.value, enabled = EXCLUDED.enabled, "updatedAt" = now()`,
      [id, r.key, r.label, r.contractType, r.unit, r.value, r.enabled],
    );
  }

  const res = await client.query(`SELECT * FROM "PayrollRule" ORDER BY key`);
  console.log('Payroll rules:');
  console.table(res.rows);

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
