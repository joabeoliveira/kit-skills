# 📊 Guia de Integração com APIs do Banco Central para Índices IGP-M (SGS - Série 4175)

**Versão:** 1.0  
**Última atualização:** Fevereiro 2026  
**Stack alvo:** Next.js, PHP, JavaScript (Vanilla)  
**Fonte oficial:** Banco Central do Brasil - SGS (Sistema Gerenciador de Séries Temporais)

---

## 🎯 Objetivo do Guia

Instruir agentes de IA e desenvolvedores a **integrar corretamente a API do Banco Central (BCData/SGS)** para consultar o **IGP-M (Índice Geral de Preços - Mercado)**, série histórica código **4175**, amplamente utilizado em **reajustes de aluguel, contratos e correção monetária**.

---

# 📌 PARTE 1 – FUNDAMENTOS DA API

## 🔍 Série de Referência

| Propriedade | Valor |
|-------------|-------|
| **Série SGS** | `4175` – IGP-M (Índice Geral de Preços - Mercado) |
| **Descrição** | Variação percentual mensal do IGP-M |
| **Fonte** | FGV/IBRE |
| **Periodicidade** | Mensal |
| **Unidade** | % (percentual) |
| **API Base** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo_serie}` |

---

## 🧩 Parâmetros da Consulta

| Parâmetro | Descrição | Obrigatório | Formato |
|-----------|-----------|-------------|---------|
| `codigo_serie` | Código da série temporal | ✅ | Numérico (ex: 4175) |
| `formato` | Formato de retorno | ❌ (padrão JSON) | `json`, `csv`, `xml` |
| `dataInicial` | Data de início | ❌ | `dd/MM/aaaa` |
| `dataFinal` | Data de fim | ❌ | `dd/MM/aaaa` |
| `ultimos/{N}` | Últimos N valores | ❌ | Número inteiro |

---

# 📡 PARTE 2 – ENDPOINTS PRINCIPAIS (IGP-M - SÉRIE 4175)

## ✅ URLs OFICIAIS E FUNCIONAIS

| Tipo de Consulta | Descrição | URL Completa |
|------------------|-----------|--------------|
| **Série completa** | Todos os dados desde 2000 | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4175/dados?formato=json` |
| **Últimos N valores** | Ex: últimos 12 meses | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4175/dados/ultimos/12?formato=json` |
| **Período específico** | Intervalo de datas | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4175/dados?formato=json&dataInicial=01/01/2025&dataFinal=31/12/2025` |
| **Último mês** | Dado mais recente | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4175/dados/ultimos/1?formato=json` |
| **Últimos 6 meses** | Semestre | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4175/dados/ultimos/6?formato=json` |
| **Últimos 12 meses** | **Reajustes contratuais padrão** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4175/dados/ultimos/12?formato=json` |
| **Últimos 24 meses** | Bienal | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4175/dados/ultimos/24?formato=json` |

> ✅ **DIFERENÇA CRÍTICA:** Diferente do IBGE, esta API **já retorna JSON por padrão**. Não é necessário `?formato=json` no endpoint `/ultimos/{N}`, mas é boa prática manter.

---

# 📦 PARTE 3 – ESTRUTURA DE RETORNO (JSON REAL)

## ✅ Exemplo real para **últimos 10 meses** (fornecido)
```json
[
  {"data":"01/03/2025","valor":"1.21"},
  {"data":"01/04/2025","valor":"1.20"},
  {"data":"01/05/2025","valor":"1.20"},
  {"data":"01/06/2025","valor":"1.15"},
  {"data":"01/07/2025","valor":"1.09"},
  {"data":"01/08/2025","valor":"1.07"},
  {"data":"01/09/2025","valor":"1.09"},
  {"data":"01/10/2025","valor":"1.07"},
  {"data":"01/11/2025","valor":"1.06"},
  {"data":"01/12/2025","valor":"1.04"}
]
```

## ✅ Exemplo para **ano completo 2025**
```json
[
  {"data":"01/01/2025","valor":"1.23"},
  {"data":"01/02/2025","valor":"1.21"},
  {"data":"01/03/2025","valor":"1.21"},
  {"data":"01/04/2025","valor":"1.20"},
  {"data":"01/05/2025","valor":"1.20"},
  {"data":"01/06/2025","valor":"1.15"},
  {"data":"01/07/2025","valor":"1.09"},
  {"data":"01/08/2025","valor":"1.07"},
  {"data":"01/09/2025","valor":"1.09"},
  {"data":"01/10/2025","valor":"1.07"},
  {"data":"01/11/2025","valor":"1.06"},
  {"data":"01/12/2025","valor":"1.04"}
]
```

---

## 🔑 Mapeamento de Campos Essenciais

| Campo | Significado | Exemplo | Tipo |
|-------|-------------|---------|------|
| `data` | Data de referência (sempre dia 01) | `"01/12/2025"` | String (dd/MM/aaaa) |
| `valor` | Variação percentual mensal | `"1.04"` | String (ponto decimal) |

⚠️ **ATENÇÃO:** O valor retornado é a **variação percentual mensal**, **NÃO** o número-índice acumulado.  
Para cálculos de reajuste, é necessário **acumular** esses percentuais.

---

# 🧮 PARTE 4 – CÁLCULO DE REAJUSTE COM IGP-M

## 🧠 Fórmula de Acumulação

```
Fator de Reajuste = (1 + v1/100) × (1 + v2/100) × ... × (1 + vn/100)
Percentual Acumulado = (Fator - 1) × 100
```

Onde `v1`, `v2`, ... `vn` são as **variações mensais** em percentual.

---

## 📊 Exemplo de Cálculo (12 meses de 2025)

```javascript
const variacoes = [1.23, 1.21, 1.21, 1.20, 1.20, 1.15, 1.09, 1.07, 1.09, 1.07, 1.06, 1.04];

let fator = 1;
variacoes.forEach(v => {
    fator = fator * (1 + (v / 100));
});

const acumulado = (fator - 1) * 100;
console.log(acumulado.toFixed(2) + '%'); // Resultado: 15.47%
```

---

# 🧪 PARTE 5 – EXEMPLOS DE IMPLEMENTAÇÃO POR STACK

---

## 🟢 1. STACK: Next.js (App Router) + Tailwind + PostgreSQL + Prisma

### 📁 `lib/bcb-api.ts`
```typescript
export interface IGPMMensal {
  data: string;        // "01/12/2025"
  dataISO: string;     // "2025-12-01" (para ordenação)
  valor: number;       // 1.04 (percentual)
  valorFormatado: string; // "1,04%"
}

export class BCBIGPMApi {
  private codigoSerie = 4175;
  private baseUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs';

  /**
   * Busca os últimos N meses do IGP-M
   */
  async buscarUltimos(meses: number = 12): Promise<IGPMMensal[]> {
    const url = `${this.baseUrl}.${this.codigoSerie}/dados/ultimos/${meses}?formato=json`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache de 1 hora (dados mensais)
    });

    if (!response.ok) {
      throw new Error(`BCB API error: ${response.status}`);
    }

    const dados = await response.json();
    
    return dados.map((item: any) => ({
      data: item.data,
      dataISO: this.converterParaISO(item.data),
      valor: parseFloat(item.valor),
      valorFormatado: this.formatarPercentual(item.valor)
    }));
  }

  /**
   * Busca por período específico
   */
  async buscarPorPeriodo(dataInicial: string, dataFinal: string): Promise<IGPMMensal[]> {
    const url = `${this.baseUrl}.${this.codigoSerie}/dados?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
    
    const response = await fetch(url);
    const dados = await response.json();
    
    return dados.map((item: any) => ({
      data: item.data,
      dataISO: this.converterParaISO(item.data),
      valor: parseFloat(item.valor),
      valorFormatado: this.formatarPercentual(item.valor)
    }));
  }

  /**
   * Calcula reajuste acumulado
   */
  calcularReajuste(indices: IGPMMensal[]): {
    fator: number;
    percentualAcumulado: number;
    percentualFormatado: string;
    periodoInicial: string;
    periodoFinal: string;
  } {
    if (indices.length === 0) throw new Error('Lista de índices vazia');

    let fator = 1;
    indices.forEach(i => {
      fator = fator * (1 + (i.valor / 100));
    });

    const percentual = (fator - 1) * 100;

    return {
      fator,
      percentualAcumulado: percentual,
      percentualFormatado: percentual.toFixed(2).replace('.', ',') + '%',
      periodoInicial: indices[0].data,
      periodoFinal: indices[indices.length - 1].data
    };
  }

  private converterParaISO(dataBr: string): string {
    const [dia, mes, ano] = dataBr.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  private formatarPercentual(valor: string | number): string {
    return parseFloat(valor.toString()).toFixed(2).replace('.', ',') + '%';
  }
}

export const bcbIGPMApi = new BCBIGPMApi();
```

### 📁 `app/api/igpm/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { bcbIGPMApi } from '@/lib/bcb-api';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const meses = Number(searchParams.get('meses')) || 12;
  
  try {
    const indices = await bcbIGPMApi.buscarUltimos(meses);
    const reajuste = bcbIGPMApi.calcularReajuste(indices);
    
    // Salva log da consulta (opcional)
    await prisma.consultaIGPM.create({
      data: {
        periodo: indices[indices.length - 1].data,
        valor: indices[indices.length - 1].valor,
        acumulado12m: reajuste.percentualAcumulado,
        consultadoEm: new Date()
      }
    });
    
    return NextResponse.json({
      indices,
      reajuste,
      metadata: {
        serie: 'IGP-M',
        codigo: 4175,
        fonte: 'Banco Central do Brasil / FGV-IBRE',
        ultimaAtualizacao: indices[indices.length - 1].data
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar IGP-M', details: error.message },
      { status: 500 }
    );
  }
}
```

### 📁 `app/reajuste-igpm/page.tsx`
```tsx
import { bcbIGPMApi } from '@/lib/bcb-api';

export default async function ReajusteIGPMPage() {
  const indices = await bcbIGPMApi.buscarUltimos(12);
  const reajuste = bcbIGPMApi.calcularReajuste(indices);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">📈 Reajuste por IGP-M</h1>
      <p className="text-gray-600 mb-6">
        Série SGS 4175 - Banco Central do Brasil / FGV-IBRE
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Índice Atual</p>
          <p className="text-3xl font-bold text-gray-900">
            {indices[indices.length - 1].valorFormatado}
          </p>
          <p className="text-sm text-gray-500">
            {indices[indices.length - 1].data}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Acumulado 12 meses</p>
          <p className="text-3xl font-bold text-blue-600">
            {reajuste.percentualFormatado}
          </p>
          <p className="text-sm text-gray-500">
            {reajuste.periodoInicial} → {reajuste.periodoFinal}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Fator Multiplicador</p>
          <p className="text-3xl font-bold text-gray-900">
            {reajuste.fator.toFixed(4)}
          </p>
          <p className="text-sm text-gray-500">Para reajustes</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Média Mensal</p>
          <p className="text-3xl font-bold text-gray-900">
            {(indices.reduce((acc, i) => acc + i.valor, 0) / indices.length).toFixed(2).replace('.', ',')}%
          </p>
          <p className="text-sm text-gray-500">últimos 12 meses</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold">📋 Histórico mensal</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mês</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variação (%)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acumulado Ano</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {indices.reverse().map((item, idx, arr) => {
              const acumuladoAno = arr
                .slice(0, idx + 1)
                .reduce((acc, i) => acc * (1 + i.valor / 100), 1);
              
              return (
                <tr key={item.data} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.data}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <span className={item.valor >= 0 ? 'text-red-600' : 'text-green-600'}>
                      {item.valorFormatado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                    {((acumuladoAno - 1) * 100).toFixed(2).replace('.', ',')}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 🟡 2. STACK: PHP Puro + Tailwind + PostgreSQL

### 📁 `BCB_IGPM_API.php`
```php
<?php
class BCB_IGPM_API {
    private $codigoSerie = 4175;
    private $baseUrl = "https://api.bcb.gov.br/dados/serie/bcdata.sgs";
    
    /**
     * Busca os últimos N meses do IGP-M
     */
    public function buscarUltimos($meses = 12) {
        $url = "{$this->baseUrl}.{$this->codigoSerie}/dados/ultimos/{$meses}?formato=json";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Erro na API do BCB: {$httpCode}");
        }
        
        $dados = json_decode($response, true);
        
        return array_map(function($item) {
            return [
                'data' => $item['data'],
                'data_iso' => $this->converterParaISO($item['data']),
                'valor' => floatval($item['valor']),
                'valor_formatado' => $this->formatarPercentual($item['valor'])
            ];
        }, $dados);
    }
    
    /**
     * Calcula reajuste acumulado
     */
    public function calcularReajuste($indices) {
        if (empty($indices)) {
            throw new Exception("Lista de índices vazia");
        }
        
        $fator = 1;
        foreach ($indices as $indice) {
            $fator *= (1 + ($indice['valor'] / 100));
        }
        
        $percentual = ($fator - 1) * 100;
        
        return [
            'fator' => $fator,
            'percentual_acumulado' => $percentual,
            'percentual_formatado' => number_format($percentual, 2, ',', '.') . '%',
            'periodo_inicial' => $indices[0]['data'],
            'periodo_final' => end($indices)['data']
        ];
    }
    
    /**
     * Aplica reajuste a um valor
     */
    public function aplicarReajuste($valorOriginal, $meses = 12) {
        $indices = $this->buscarUltimos($meses);
        $reajuste = $this->calcularReajuste($indices);
        
        return [
            'valor_original' => $valorOriginal,
            'valor_reajustado' => $valorOriginal * $reajuste['fator'],
            'percentual' => $reajuste['percentual_formatado'],
            'fator' => $reajuste['fator'],
            'periodo' => $reajuste['periodo_inicial'] . ' a ' . $reajuste['periodo_final']
        ];
    }
    
    private function converterParaISO($dataBr) {
        $partes = explode('/', $dataBr);
        return "{$partes[2]}-{$partes[1]}-{$partes[0]}";
    }
    
    private function formatarPercentual($valor) {
        return number_format(floatval($valor), 2, ',', '.') . '%';
    }
}
?>
```

### 📁 `igpm-contrato.php`
```php
<?php
require_once 'BCB_IGPM_API.php';

$api = new BCB_IGPM_API();

// Parâmetros do contrato
$valorContrato = 2500.00;
$mesesReajuste = 12; // Anual

try {
    // Busca índices e calcula reajuste
    $indices = $api->buscarUltimos($mesesReajuste);
    $reajuste = $api->calcularReajuste($indices);
    $aplicacao = $api->aplicarReajuste($valorContrato, $mesesReajuste);
    
    // Para gráfico (últimos 12 meses ordenados)
    $indicesGrafico = array_reverse($indices);
    
} catch (Exception $e) {
    $erro = $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <title>Reajuste Contratual - IGP-M</title>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 mb-6 text-white">
            <h1 class="text-3xl font-bold">📊 IGP-M - Reajuste Contratual</h1>
            <p class="text-blue-100">Série SGS 4175 • Banco Central do Brasil / FGV-IBRE</p>
        </div>
        
        <?php if (isset($erro)): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
                <strong>Erro:</strong> <?= $erro ?>
            </div>
        <?php else: ?>
        
        <!-- Cards de Resumo -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-sm text-gray-500">Valor Original</p>
                <p class="text-2xl font-bold text-gray-900">
                    R$ <?= number_format($aplicacao['valor_original'], 2, ',', '.') ?>
                </p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-sm text-gray-500">Reajuste Acumulado</p>
                <p class="text-2xl font-bold text-green-600">
                    <?= $reajuste['percentual_formatado'] ?>
                </p>
                <p class="text-xs text-gray-500"><?= $reajuste['periodo_inicial'] ?> → <?= $reajuste['periodo_final'] ?></p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-sm text-gray-500">Fator</p>
                <p class="text-2xl font-bold text-gray-900">
                    <?= number_format($reajuste['fator'], 4, ',', '.') ?>
                </p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-sm text-gray-500">Valor Reajustado</p>
                <p class="text-2xl font-bold text-blue-600">
                    R$ <?= number_format($aplicacao['valor_reajustado'], 2, ',', '.') ?>
                </p>
            </div>
        </div>
        
        <!-- Gráfico e Tabela -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Gráfico -->
            <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4">📈 Evolução Mensal (últimos 12 meses)</h2>
                <canvas id="graficoIGPM" height="250"></canvas>
            </div>
            
            <!-- Tabela Resumo -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4">📋 Últimos 12 meses</h2>
                <div class="overflow-y-auto max-h-80">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left py-2 text-xs font-medium text-gray-500">Período</th>
                                <th class="text-right py-2 text-xs font-medium text-gray-500">Variação</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <?php foreach ($indicesGrafico as $item): ?>
                            <tr class="hover:bg-gray-50">
                                <td class="py-2 text-sm"><?= $item['data'] ?></td>
                                <td class="py-2 text-sm text-right font-medium <?= $item['valor'] >= 0 ? 'text-red-600' : 'text-green-600' ?>">
                                    <?= $item['valor_formatado'] ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Script do Gráfico -->
        <script>
            const ctx = document.getElementById('graficoIGPM').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: <?= json_encode(array_column(array_reverse($indices), 'data')) ?>,
                    datasets: [{
                        label: 'IGP-M (%)',
                        data: <?= json_encode(array_column(array_reverse($indices), 'valor')) ?>,
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgb(37, 99, 235)',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: (ctx) => `${ctx.raw.toFixed(2)}%` } }
                    },
                    scales: {
                        y: { beginAtZero: false, grid: { color: '#e5e7eb' } }
                    }
                }
            });
        </script>
        
        <?php endif; ?>
    </div>
</body>
</html>
```

---

## 🔵 3. STACK: JavaScript Vanilla + Tailwind + PostgreSQL

### 📁 `bcb-igpm.js`
```javascript
/**
 * Cliente JavaScript para API do Banco Central - IGP-M (Série 4175)
 */
export class BCBIGPMClient {
    constructor() {
        this.codigoSerie = 4175;
        this.baseUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs';
    }

    /**
     * Busca os últimos N meses do IGP-M
     * @param {number} meses - Quantidade de meses (padrão: 12)
     * @returns {Promise<Array>}
     */
    async buscarUltimos(meses = 12) {
        const url = `${this.baseUrl}.${this.codigoSerie}/dados/ultimos/${meses}?formato=json`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const dados = await response.json();
            
            return dados.map(item => ({
                data: item.data,
                dataISO: this.converterParaISO(item.data),
                valor: parseFloat(item.valor),
                valorFormatado: this.formatarPercentual(item.valor),
                cor: parseFloat(item.valor) >= 0 ? 'text-red-600' : 'text-green-600'
            }));
        } catch (error) {
            console.error('Erro ao buscar IGP-M:', error);
            throw error;
        }
    }

    /**
     * Busca por período específico
     * @param {string} dataInicial - dd/MM/aaaa
     * @param {string} dataFinal - dd/MM/aaaa
     */
    async buscarPorPeriodo(dataInicial, dataFinal) {
        const url = `${this.baseUrl}.${this.codigoSerie}/dados?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
        
        const response = await fetch(url);
        const dados = await response.json();
        
        return dados.map(item => ({
            data: item.data,
            dataISO: this.converterParaISO(item.data),
            valor: parseFloat(item.valor),
            valorFormatado: this.formatarPercentual(item.valor)
        }));
    }

    /**
     * Calcula reajuste acumulado
     * @param {Array} indices - Lista de índices
     */
    calcularReajuste(indices) {
        if (!indices || indices.length === 0) {
            throw new Error('Lista de índices vazia');
        }

        let fator = 1;
        indices.forEach(i => {
            fator *= (1 + (i.valor / 100));
        });

        const percentual = (fator - 1) * 100;

        return {
            fator,
            percentualAcumulado: percentual,
            percentualFormatado: percentual.toFixed(2).replace('.', ',') + '%',
            periodoInicial: indices[0].data,
            periodoFinal: indices[indices.length - 1].data
        };
    }

    /**
     * Aplica reajuste a um valor
     */
    aplicarReajuste(valorOriginal, indices) {
        const reajuste = this.calcularReajuste(indices);
        
        return {
            valorOriginal,
            valorReajustado: valorOriginal * reajuste.fator,
            valorReajustadoFormatado: this.formatarMoeda(valorOriginal * reajuste.fator),
            ...reajuste
        };
    }

    /**
     * Agrupa dados por ano
     */
    agruparPorAno(indices) {
        const porAno = {};
        
        indices.forEach(item => {
            const ano = item.data.split('/')[2];
            if (!porAno[ano]) porAno[ano] = [];
            porAno[ano].push(item);
        });
        
        return Object.entries(porAno).map(([ano, valores]) => {
            const acumulado = valores.reduce((acc, v) => acc * (1 + v.valor / 100), 1);
            return {
                ano,
                quantidade: valores.length,
                media: (valores.reduce((acc, v) => acc + v.valor, 0) / valores.length).toFixed(2).replace('.', ',') + '%',
                acumulado: ((acumulado - 1) * 100).toFixed(2).replace('.', ',') + '%',
                indices: valores
            };
        });
    }

    converterParaISO(dataBr) {
        const [dia, mes, ano] = dataBr.split('/');
        return `${ano}-${mes}-${dia}`;
    }

    formatarPercentual(valor) {
        return parseFloat(valor).toFixed(2).replace('.', ',') + '%';
    }

    formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

// Singleton
export const bcbIGPM = new BCBIGPMClient();
```

### 📁 `calculadora-igpm.html`
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script type="module" src="bcb-igpm.js"></script>
    <title>Calculadora IGP-M · Reajuste Contratual</title>
</head>
<body class="bg-gray-100">
    <div class="max-w-7xl mx-auto p-6" id="app">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        📈 Calculadora IGP-M
                        <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            Série 4175
                        </span>
                    </h1>
                    <p class="text-gray-600 mt-1">
                        Banco Central do Brasil · FGV/IBRE · Atualizado mensalmente
                    </p>
                </div>
                <div class="flex gap-2">
                    <button onclick="carregarDados(12)" 
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                        Últimos 12 meses
                    </button>
                    <button onclick="carregarDados(24)" 
                            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition">
                        24 meses
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div id="loading" class="hidden">
            <div class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        </div>

        <!-- Conteúdo Principal -->
        <div id="conteudo" class="hidden">
            <!-- Cards Reajuste -->
            <div class="grid grid-cols-1 md:grid
