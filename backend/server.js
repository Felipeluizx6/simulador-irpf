const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");

// Servir arquivos estáticos da pasta frontend (para acessar o index.html e script.js)
app.use(express.static(path.join(__dirname, "..", "frontend")));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// health
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1 as status");
    return res.json({ server: "ok", database: result.rows[0].status });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//get
app.get("/api/irpf", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const result = await pool.query(
      `SELECT *
       FROM public.irpf_calculos
       ORDER BY created_at DESC
       LIMIT $1;`,
      [limit]
    );

    return res.json({ count: result.rowCount, rows: result.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/irpf", async (req, res) => {
  try {
    const { monthly_income, dependents } = req.body;

    // validações
    if (monthly_income === undefined || monthly_income === null || monthly_income === "") {
      return res.status(400).json({ error: "monthly_income é obrigatório" });
    }
    const mi = Number(monthly_income);
    if (!Number.isFinite(mi) || mi <= 0) {
      return res.status(400).json({ error: "monthly_income inválido" });
    }

    const dep = Number(dependents ?? 0);
    if (!Number.isInteger(dep) || dep < 0) {
      return res.status(400).json({ error: "dependents inválido" });
    }

    // cálculos
    const annual_income = mi * 12;

    // dedução por dependente 
    const dependent_deduction = dep * 1712;

    const taxable_income = Math.max(annual_income - dependent_deduction, 0);

    // alíquota estimada (bem simples; vou sofisticar depois)
    let tax_rate = 0;
    if (annual_income <= 28559.7) tax_rate = 0;
    else if (annual_income <= 38398.1) tax_rate = 7.5;
    else if (annual_income <= 49443.6) tax_rate = 15;
    else if (annual_income <= 66664.8) tax_rate = 22.5;
    else tax_rate = 27.5;

    const tax_due = taxable_income * (tax_rate / 100);

    // INSERT completo (com os dados de entrada + cálculos) e retorno do registro criado
    const result = await pool.query(
      `INSERT INTO public.irpf_calculos
        (monthly_income, dependents, annual_income, dependent_deduction, taxable_income, tax_due, tax_rate, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *;`,
      [mi, dep, annual_income, dependent_deduction, taxable_income, tax_due, tax_rate]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});