const form = document.getElementById("irpf-form");
const resultadoDiv = document.getElementById("resultado");
const monthlyIncomeInput = document.getElementById("salary");
const dependentsInput = document.getElementById("dependents");
const annualIncomeInput = document.getElementById("annualIncome");

// Atualiza renda anual automaticamente enquanto digita
function updateAnnualIncome() {
  const monthlyIncome = Number(monthlyIncomeInput.value);
  if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
    annualIncomeInput.value = "";
    return;
  }
  annualIncomeInput.value = (monthlyIncome * 12).toFixed(2);
}

monthlyIncomeInput.addEventListener("input", updateAnnualIncome);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const monthly_income = Number(monthlyIncomeInput.value);
  const dependents = Number(dependentsInput.value);

  // Validação básica
  if (!Number.isFinite(monthly_income) || monthly_income <= 0) {
    resultadoDiv.innerHTML = `<p style="color:red;">Informe um salário mensal válido.</p>`;
    return;
  }
  if (!Number.isInteger(dependents) || dependents < 0) {
    resultadoDiv.innerHTML = `<p style="color:red;">Informe dependentes (0 ou mais).</p>`;
    return;
  }

  // Mostra “carregando”
  resultadoDiv.innerHTML = `<p>Calculando...</p>`;

  try {
    const resp = await fetch("http://localhost:3000/api/irpf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly_income, dependents }),
    });

    const data = await resp.json();

    // Se backend devolveu erro (400/500), mostra mensagem
    if (!resp.ok) {
      resultadoDiv.innerHTML = `<p style="color:red;">Erro: ${data.error || "falha na requisição"}</p>`;
      return;
    }

    // Render do resultado vindo do backend (com os cálculos)
    resultadoDiv.innerHTML = `
      <h2>Resultado do Cálculo</h2>
      <p><b>Renda Mensal:</b> R$ ${Number(data.monthly_income).toFixed(2)}</p>
      <p><b>Renda Anual:</b> R$ ${Number(data.annual_income).toFixed(2)}</p>
      <p><b>Dependentes:</b> ${data.dependents}</p>
      <p><b>Dedução por dependentes:</b> R$ ${Number(data.dependent_deduction).toFixed(2)}</p>
      <p><b>Base Tributável:</b> R$ ${Number(data.taxable_income).toFixed(2)}</p>
      <p><b>Alíquota (estimada):</b> ${Number(data.tax_rate).toFixed(2)}%</p>
      <p><b>Imposto (estimado):</b> R$ ${Number(data.tax_due).toFixed(2)}</p>
    `;
  } catch (err) {
    resultadoDiv.innerHTML = `<p style="color:red;">Erro de rede/API: ${err.message}</p>`;
  }
});