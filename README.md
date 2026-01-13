# HR Payroll Calculator — AI-Native Artisan Challenge (Midterm)

API en **NestJS** para calcular **salario neto** a partir de salario base, bonos y deducciones. El objetivo no es “que funcione”, sino demostrar **Clean-ish Architecture**, patrones, tests automatizados y CI/CD (con IA como acelerador, pero con criterio humano).

> **Nota:** Las reglas de impuestos/deducciones usadas aquí son **ficticias** (propósito académico). No representan normativa real.

---

## Arquitectura (separación por capas)

El módulo principal es `src/payroll` y está organizado por capas:

- `domain/`  
  Modelos y lógica de negocio pura (sin Nest). Aquí vive el cálculo y las reglas.
- `application/`  
  Casos de uso (orquestación). No conoce HTTP.
- `presentation/`  
  Controladores HTTP (Nest) y entrada/salida hacia la aplicación.

Flujo: **Controller → UseCase → Domain (Template + Strategies) → Result**

---

## Patrones de diseño usados

### 1) Template Method (Patrón principal)

`PayrollCalculatorTemplate.calculate()` define el algoritmo del cálculo de nómina y lo mantiene consistente:

1) Validación de entrada  
2) Cálculo de gross  
3) Cálculo de deducciones/impuestos  
4) Cálculo de neto y breakdown

Esto evita duplicación y asegura un flujo único y controlado.

### 2) Strategy (Reglas por tipo de contrato)

`EmployeeTaxStrategy` y `ContractorTaxStrategy` encapsulan reglas de impuestos/deducciones por tipo de contrato.  
Esto permite extender reglas sin modificar el template (Open/Closed).

---

## Endpoints

- `GET /payroll/health`  
  Health check simple.
- `GET /payroll/rules`  
  Expone las reglas (ficticias) configuradas.
- `POST /payroll/calculate`  
  Calcula nómina y devuelve el detalle.

Ejemplo request:

```json
{
  "contractType": "EMPLOYEE",
  "baseSalary": 2500000,
  "bonuses": 200000,
  "otherDeductions": 0
}
```

---

## Cómo correr el proyecto (local)

Instalar dependencias:

```bash
npm ci
```

Levantar en modo desarrollo:

```bash
npm run start:dev
```

Lint:

```bash
npm run lint
```

Unit tests + coverage:

```bash
npm run test:cov
# Unit (src) tests
# (this runs jest configured to use `src` as rootDir)
npm test

# E2E tests (separate config)
npm run test:e2e

# Combined coverage for e2e (covers both src and test in coverage output)
npx jest --coverage --config ./test/jest-e2e.json
```

E2E (pruebas de endpoints):

```bash
npm run test:e2e
```

### Seed (llenar reglas de nómina)

Si usas una base PostgreSQL local/CI y quieres cargar las reglas iniciales:

```bash
# Asegúrate de tener DATABASE_URL exportado
npx prisma db seed
# (alternativamente, puedes ejecutar `node prisma/seed.js` manualmente)
```

### Cobertura

El reporte HTML se genera en `coverage/lcov-report/index.html`. Para abrirlo en Windows:

```powershell
start coverage/lcov-report/index.html
```


Build:

```bash
npm run build
```

---

## CI/CD (GitHub Actions)

El pipeline corre en cada push / PR a `develop` y `main` y ejecuta:

- `npm run lint`
- `npm test -- --coverage`
- `npm run test:e2e`
- `npm run build`

---

## AI Collaboration Log (Human in the Loop)

### Ejemplo 1 — Cobertura por ramas (branch coverage)

La IA inicialmente propuso tests “happy path”. Ajusté y añadí edge cases (sin strategy, withholding=0, deducciones > gross, negativos) para cubrir ramas reales del dominio y asegurar robustez.

### Ejemplo 2 — CI fallando por lint en e2e

La IA generó e2e con accesos a `any` que rompían el lint. Ajusté tipado y/o apliqué overrides de ESLint solo para `test/**`, manteniendo reglas estrictas en `src/**`.

### Ejemplo 3 — Mocking y $queryRaw

La IA sugirió un `MockPrismaService` para evitar dependencia de DB en e2e. Intervine con: 

- **Qué hizo la IA:** generó el `MockPrismaService` con comportamientos básicos.
- **Qué hice (HUMAN REVIEW):** añadí validaciones (unique email, FK errors), implementé un `$queryRaw` mínimo para el uso de `PayrollRuleRepository` y dejé en el archivo `src/prisma/mock-prisma.service.ts` el comentario `// HUMAN REVIEW:` explicando la intención y la limitación del mock.

Esto está documentado en el código (busca `HUMAN REVIEW` en `src/prisma/mock-prisma.service.ts`) y en este README.

### Ejemplo 4 — Refactor y tests para `PayrollRuleRepository`

La IA creó inicialmente el repositorio usando `this.prisma.$queryRaw`. Para cumplir pruebas y cobertura añadí:

- Tests unitarios en `src/payroll/domain/repositories/payroll-rule.repository.spec.ts` que mockean `$queryRaw` y cubren CRUD.
- COMMIT NOTE: añadí comentarios `// HUMAN REVIEW:` en los archivos donde la IA fue asistente para dejar evidencia de revisión humana.

---

## Entrega

Repositorio: https://github.com/RM92023/hr-payroll-calculator
