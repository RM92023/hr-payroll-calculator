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
# o
npm test -- --coverage
```

E2E (pruebas de endpoints):

```bash
npm run test:e2e
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

---

## Entrega

Repositorio: https://github.com/RM92023/hr-payroll-calculator
