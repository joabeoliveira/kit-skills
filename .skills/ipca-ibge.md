# 📊 Guia de Integração com APIs do IBGE para Índices IPCA (Tabela 1737)

**Versão:** 2.0  
**Última atualização:** Fevereiro 2026  
**Stack alvo:** Next.js, PHP, JavaScript (Vanilla)  
**Formato oficial:** JSON (recomendado) / XML

---

## 🎯 Objetivo do Guia

Instruir agentes de IA e desenvolvedores a **integrar corretamente a API do IBGE SIDRA** para consultar índices IPCA (Tabela 1737), utilizados em **reajustes contratuais, correção monetária e análises inflacionárias**.

---

# 📌 PARTE 1 – FUNDAMENTOS DA API

## 🔍 Tabela de Referência

| Propriedade | Valor |
|-------------|-------|
| **Tabela SIDRA** | `1737` – IPCA: número-índice, variação mensal e acumulada |
| **URL oficial** | https://sidra.ibge.gov.br/tabela/1737 |
| **API Base** | `https://apisidra.ibge.gov.br/values/` |
| **Formato padrão** | XML |
| **Formato recomendado** | **JSON** (`?formato=json`) |

---

## 🧩 Parâmetros Fixos da Consulta

| Parâmetro | Descrição | Valor Obrigatório |
|-----------|-----------|-------------------|
| `t` | Tabela | `1737` |
| `n1` | Nível geográfico (Brasil) | `all` |
| `v` | Variável (IPCA - número-índice) | `2266` |
| `d` | Classificação (base dez/1993 = 100) | `v2266%2013` |
| `p` | Período | `all` ou `last N` |

---

# 📡 PARTE 2 – ENDPOINTS PRINCIPAIS (COM JSON)

## ✅ URLs CORRETAS com `?formato=json`

| Período | Descrição | URL Completa |
|---------|-----------|--------------|
| **Todos** | Série histórica completa | `https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/2266/p/all/d/v2266%2013?formato=json` |
| **Último mês** | Dado mais recente | `https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/2266/p/last%201/d/v2266%2013?formato=json` |
| **Últimos 2 meses** | Últimos 2 | `https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/2266/p/last%202/d/v2266%2013?formato=json` |
| **Últimos 4 meses** | Últimos 4 | `https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/2266/p/last%204/d/v2266%2013?formato=json` |
| **Últimos 6 meses** | Últimos 6 | `https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/2266/p/last%206/d/v2266%2013?formato=json` |
| **Últimos 8 meses** | Últimos 8 | `https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/2266/p/last%208/d/v2266%2013?formato=json` |
| **Últimos 12 meses** | **Reajustes contratuais** | `https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/2266/p/last%2012/d/v2266%2013?formato=json` |

> ⚠️ **ATENÇÃO:** Sempre adicione `?formato=json` para evitar parsing de XML.

---

# 📦 PARTE 3 – ESTRUTURA DE RETORNO (JSON REAL)

## ✅ Exemplo real para **últimos 2 meses**

```json
[
  {
    "D1C": "1",
    "D1N": "Brasil",
    "D2C": "2266",
    "D2N": "IPCA - Número-índice (base: dezembro de 1993 = 100)",
    "D3C": "202512",
    "D3N": "dezembro 2025",
    "MC": "30",
    "MN": "Número-índice",
    "NC": "1",
    "NN": "Brasil",
    "V": "7403.2900000000000"
  },
  {
    "D1C": "1",
    "D1N": "Brasil",
    "D2C": "2266",
    "D2N": "IPCA - Número-índice (base: dezembro de 1993 = 100)",
    "D3C": "202601",
    "D3N": "janeiro 2026",
    "MC": "30",
    "MN": "Número-índice",
    "MN": "Número-índice",
    "NC": "1",
    "NN": "Brasil",
    "V": "7427.7200000000000"
  }
]
```

---

## 🔑 Mapeamento de Campos Essenciais

| Campo | Significado | Exemplo | Obrigatório |
|-------|-------------|---------|-------------|
| `D3N` | Mês/ano por extenso | `"janeiro 2026"` | ✅ |
| `D3C` | Código do período (AAAAMM) | `"202601"` | ✅ |
| `V` | Valor do índice | `"7427.72"` | ✅ |
| `D2N` | Descrição da variável | `"IPCA - Número-índice"` | ❌ |
| `MN` | Unidade de medida | `"Número-índice"` | ❌ |

---

# 🧪 PARTE 4 – EXEMPLOS DE IMPLEMENTAÇÃO POR STACK

---

## 🟢 1. STACK: Next.js (App Router) + Tailwind + PostgreSQL + Prisma

### 📁 `lib/ibge-api.ts`
```typescript
export interface IndiceIPCA {
  periodo: string;      // "janeiro 2026"
  periodoCodigo: string; // "202601"
  valor: number;        // 7427.72
}

export async function buscarUltimosIPCA(meses: number = 12): Promise<IndiceIPCA[]> {
  const url = `https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/2266/p/last%20${meses}/d/v2266%2013?formato=json`;
  
  const response = await fetch(url, {
    next: { revalidate: 86400 } // Cache por 24 horas (ISR)
  });
  
  if (!response.ok) throw new Error(`IBGE API error: ${response.status}`);
  
  const dados = await response.json();
  
  return dados.map((item: any) => ({
    periodo: item.D3N,
    periodoCodigo: item.D3C,
    valor: parseFloat(item.V)
  }));
}
```

### 📁 `app/api/ipca/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { buscarUltimosIPCA } from '@/lib/ibge-api';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const meses = Number(searchParams.get('meses')) || 12;
  
  try {
    // Busca da API do IBGE
    const indices = await buscarUltimosIPCA(meses);
    
    // Salva no histórico (opcional)
    await prisma.consultaIPCA.create({
      data: {
        periodo: indices[0].periodoCodigo,
        valor: indices[0].valor,
        consultadoEm: new Date()
      }
    });
    
    return NextResponse.json(indices);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar IPCA' },
      { status: 500 }
    );
  }
}
```

### 📁 `app/reajuste/page.tsx`
```tsx
import { buscarUltimosIPCA } from '@/lib/ibge-api';

export default async function ReajustePage() {
  const indices = await buscarUltimosIPCA(12);
  const indiceAtual = indices[indices.length - 1];
  const indiceAnterior = indices[0];
  const variacao = ((indiceAtual.valor / indiceAnterior.valor) - 1) * 100;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reajuste Contratual</h1>
      <div className="mt-4 p-4 bg-white rounded shadow">
        <p>Período base: {indiceAnterior.periodo}</p>
        <p>Período atual: {indiceAtual.periodo}</p>
        <p className="text-xl font-semibold">
          Variação: {variacao.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
```

---

## 🟡 2. STACK: PHP Puro + Tailwind + PostgreSQL

### 📁 `IBGE_API.php`
```php
<?php
class IBGE_API {
    private $baseUrl = "https://apisidra.ibge.gov.br/values/";
    
    /**
     * Busca índices IPCA
     * @param int $meses Quantidade de meses (1,2,4,6,8,12, ou 0 para todos)
     * @return array
     */
    public function buscarIPCA($meses = 12) {
        $periodo = $meses > 0 ? "last%20{$meses}" : "all";
        $url = $this->baseUrl . "t/1737/n1/all/v/2266/p/{$periodo}/d/v2266%2013?formato=json";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Erro na API: {$httpCode}");
        }
        
        $dados = json_decode($response, true);
        $resultado = [];
        
        foreach ($dados as $item) {
            $resultado[] = [
                'periodo' => $item['D3N'],
                'periodo_codigo' => $item['D3C'],
                'valor' => floatval($item['V'])
            ];
        }
        
        return $resultado;
    }
    
    /**
     * Calcula percentual de reajuste
     */
    public function calcularReajuste($valorOriginal, $meses = 12) {
        $indices = $this->buscarIPCA($meses);
        $primeiro = $indices[0]['valor'];
        $ultimo = $indices[count($indices) - 1]['valor'];
        $fator = $ultimo / $primeiro;
        
        return [
            'valor_reajustado' => $valorOriginal * $fator,
            'percentual' => ($fator - 1) * 100,
            'periodo_inicial' => $indices[0]['periodo'],
            'periodo_final' => $indices[count($indices) - 1]['periodo']
        ];
    }
}
?>
```

### 📁 `consulta.php`
```php
<?php
require_once 'IBGE_API.php';
$api = new IBGE_API();

try {
    $indices = $api->buscarIPCA(6);
    $reajuste = $api->calcularReajuste(1500.00, 12);
} catch (Exception $e) {
    $erro = $e->getMessage();
}
?>

<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">📈 Consulta IPCA</h1>
        
        <?php if (isset($erro)): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <?= $erro ?>
            </div>
        <?php else: ?>
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Últimos 6 meses</h2>
                <table class="w-full">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left py-2">Período</th>
                            <th class="text-right py-2">Índice</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($indices as $i): ?>
                        <tr class="border-b hover:bg-gray-50">
                            <td class="py-2"><?= $i['periodo'] ?></td>
                            <td class="text-right py-2"><?= number_format($i['valor'], 2, ',', '.') ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                
                <div class="mt-6 p-4 bg-blue-50 rounded">
                    <p class="font-semibold">Reajuste contratual (12 meses):</p>
                    <p class="text-2xl"><?= number_format($reajuste['percentual'], 2, ',', '.') ?>%</p>
                    <p class="text-sm text-gray-600">
                        <?= $reajuste['periodo_inicial'] ?> → <?= $reajuste['periodo_final'] ?>
                    </p>
                </div>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
```

---

## 🔵 3. STACK: JavaScript Vanilla + Tailwind/Bootstrap + PostgreSQL

### 📁 `ibge-ipca.js`
```javascript
/**
 * Cliente JavaScript para API do IBGE IPCA
 */
class IBGEIPCA {
    constructor() {
        this.baseUrl = 'https://apisidra.ibge.gov.br/values/';
    }

    /**
     * Busca índices IPCA
     * @param {number} meses - 1,2,4,6,8,12 ou 0 para todos
     * @returns {Promise<Array>}
     */
    async buscarIndices(meses = 12) {
        const periodo = meses > 0 ? `last%20${meses}` : 'all';
        const url = `${this.baseUrl}t/1737/n1/all/v/2266/p/${periodo}/d/v2266%2013?formato=json`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const dados = await response.json();
            
            return dados.map(item => ({
                periodo: item.D3N,
                periodoCodigo: item.D3C,
                valor: parseFloat(item.V),
                valorFormatado: this.formatarValor(item.V)
            }));
        } catch (error) {
            console.error('Erro ao buscar IPCA:', error);
            throw error;
        }
    }

    /**
     * Calcula variação percentual
     * @param {Array} indices 
     * @returns {Object}
     */
    calcularVariacao(indices) {
        if (!indices || indices.length < 2) return null;
        
        const primeiro = indices[0].valor;
        const ultimo = indices[indices.length - 1].valor;
        const variacao = ((ultimo / primeiro) - 1) * 100;
        
        return {
            percentual: variacao,
            percentualFormatado: variacao.toFixed(2).replace('.', ',') + '%',
            periodoInicial: indices[0].periodo,
            periodoFinal: indices[indices.length - 1].periodo,
            fator: ultimo / primeiro
        };
    }

    formatarValor(valor) {
        return parseFloat(valor).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IBGEIPCA;
}
```

### 📁 `dashboard.html` (com Tailwind)
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="ibge-ipca.js"></script>
    <title>Dashboard IPCA</title>
</head>
<body class="bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto" id="app">
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">
                📊 Índice IPCA - IBGE
            </h1>
            
            <div class="flex gap-4 mb-6">
                <select id="selectPeriodo" class="border rounded-lg px-4 py-2">
                    <option value="1">Último mês</option>
                    <option value="6">Últimos 6 meses</option>
                    <option value="12" selected>Últimos 12 meses</option>
                    <option value="24">Últimos 24 meses</option>
                </select>
                
                <button onclick="carregarDados()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                    Atualizar
                </button>
            </div>
        </div>

        <div id="loading" class="hidden">
            <div class="flex justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        </div>

        <div id="resultado" class="hidden">
            <!-- Cards de resumo -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <p class="text-sm text-gray-500">Índice Atual</p>
                    <p class="text-3xl font-bold text-gray-900" id="indiceAtual"></p>
                    <p class="text-sm text-gray-500" id="periodoAtual"></p>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <p class="text-sm text-gray-500">Variação Período</p>
                    <p class="text-3xl font-bold text-green-600" id="variacao"></p>
                    <p class="text-sm text-gray-500" id="periodoVariacao"></p>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <p class="text-sm text-gray-500">Fator Multiplicador</p>
                    <p class="text-3xl font-bold text-gray-900" id="fator"></p>
                    <p class="text-sm text-gray-500">Para reajustes</p>
                </div>
            </div>

            <!-- Tabela -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Período
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Nº Índice
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Var. Mensal
                            </th>
                        </tr>
                    </thead>
                    <tbody id="tabelaBody" class="bg-white divide-y divide-gray-200">
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        const api = new IBGEIPCA();
        
        async function carregarDados() {
            const meses = document.getElementById('selectPeriodo').value;
            
            document.getElementById('loading').classList.remove('hidden');
            document.getElementById('resultado').classList.add('hidden');
            
            try {
                const indices = await api.buscarIndices(parseInt(meses));
                exibirDados(indices);
            } catch (error) {
                alert('Erro ao carregar dados. Tente novamente.');
            } finally {
                document.getElementById('loading').classList.add('hidden');
            }
        }
        
        function exibirDados(indices) {
            const ultimo = indices[indices.length - 1];
            const variacao = api.calcularVariacao(indices);
            
            // Atualiza cards
            document.getElementById('indiceAtual').innerHTML = api.formatarValor(ultimo.valor);
            document.getElementById('periodoAtual').innerHTML = ultimo.periodo;
            document.getElementById('variacao').innerHTML = variacao.percentualFormatado;
            document.getElementById('periodoVariacao').innerHTML = 
                `${variacao.periodoInicial} → ${variacao.periodoFinal}`;
            document.getElementById('fator').innerHTML = variacao.fator.toFixed(4);
            
            // Atualiza tabela
            const tbody = document.getElementById('tabelaBody');
            tbody.innerHTML = indices.map((item, i) => {
                const variacaoMensal = i > 0 ? 
                    ((item.valor / indices[i-1].valor) - 1) * 100 : 0;
                
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${item.periodo}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            ${item.valorFormatado}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-right ${i > 0 ? (variacaoMensal > 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}">
                            ${i > 0 ? variacaoMensal.toFixed(2).replace('.', ',') + '%' : '-'}
                        </td>
                    </tr>
                `;
            }).join('');
            
            document.getElementById('resultado').classList.remove('hidden');
        }
        
        // Carrega dados iniciais
        carregarDados();
    </script>
</body>
</html>
```

---

# ⚠️ PARTE 5 – TRATAMENTO DE ERROS E BOAS PRÁTICAS

## 🛡️ Validações Obrigatórias

```javascript
// SEMPRE verifique:
if (!response.ok) {
    if (response.status === 429) {
        // Muitas requisições - aguardar
        await sleep(2000);
    }
    if (response.status >= 500) {
        // Erro no servidor do IBGE
        throw new Error('IBGE temporariamente indisponível');
    }
}
```

## 💾 Cache Recomendado

| Período | Cache |
|--------|-------|
| `last 1` | 1 hora |
| `last N` (N ≤ 12) | 6 horas |
| `last N` (N > 12) | 24 horas |
| `all` | 7 dias |

**IPCA é divulgado mensalmente**, geralmente entre os dias 8 e 15 do mês subsequente.

---

# ✅ PARTE 6 – CHECKLIST DE INTEGRAÇÃO

- [ ] **Sempre usar `?formato=json`** (nunca parsear XML manualmente)
- [ ] **Campos obrigatórios**: `D3N`, `D3C`, `V`
- [ ] **Timeout** mínimo de 10 segundos
- [ ] **Retry** em caso de falha (3 tentativas)
- [ ] **Cache** implementado
- [ ] **Fallback** para dados locais se API falhar
- [ ] **Parse correto** de número (`parseFloat`) - usar ponto como separador decimal

---

# 📚 PARTE 7 – GLOSSÁRIO

| Termo | Significado |
|-------|-------------|
| **IPCA** | Índice Nacional de Preços ao Consumidor Amplo |
| **SIDRA** | Sistema IBGE de Recuperação Automática |
| **Tabela 1737** | Série histórica do IPCA |
| **V2266** | Número-índice (base dez/1993 = 100) |
| **D3N** | Descrição do período |
| **D3C** | Código do período (AAAAMM) |

---

## 🎯 FINALIDADE

Este guia capacita **agentes de IA e desenvolvedores** a implementar corretamente a consulta de índices IPCA em **qualquer stack tecnológica**, garantindo **dados oficiais, atualizados e formatados corretamente** para reajustes contratuais e cálculos inflacionários.

**Desenvolvido por Joabe Oliveira** 🚀
