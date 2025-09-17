interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface AnalysisResult {
  success: boolean;
  data?: string;
  error?: string;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    if (!this.apiKey) {
      throw new Error('VITE_GEMINI_API_KEY não encontrada nas variáveis de ambiente');
    }
  }

  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove o prefixo data:image/...;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getMimeType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  private createMedicalPrompt(patientContext?: any): string {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');
    const protocolNumber = `CFI-${Date.now().toString().slice(-8)}`;

    return `
SISTEMA DE ANÁLISE MÉDICA AVANÇADA - LAUDO ESTRUTURADO DE FERIDAS
==================================================================

INSTRUÇÕES PARA ANÁLISE CLÍNICA ESPECIALIZADA:
Você é um especialista em medicina de feridas, dermatologia e cirurgia plástica reparadora. Analise a imagem médica fornecida aplicando conhecimentos avançados em:
- Fisiopatologia da cicatrização
- Classificação de feridas segundo TIME (Tissue, Infection, Moisture, Edge)
- Escalas validadas (Wagner, University of Texas, PUSH Tool)
- Microbiologia de feridas
- Biomateriais e terapias avançadas

CONTEXTO CLÍNICO DO PACIENTE:
- Nome: ${patientContext?.nome || 'PACIENTE NÃO IDENTIFICADO'}
- Idade: ${patientContext?.idade || 'Não informada'} anos
- Sexo: ${patientContext?.sexo || 'Não informado'}
- Localização Anatômica: ${patientContext?.localizacaoLesao || 'Não especificada'}
- Comorbidades: ${patientContext?.comorbidades || 'A investigar'}
- Medicações em uso: ${patientContext?.medicacoes || 'A investigar'}
- Tempo de evolução: ${patientContext?.tempoEvolucao || 'A investigar'}

FORMATO DE RESPOSTA OBRIGATÓRIO:
Responda APENAS com um objeto JSON válido seguindo esta estrutura:

{
  "header": {
    "title": "LAUDO MÉDICO ESPECIALIZADO - ANÁLISE COMPUTACIONAL DE FERIDAS",
    "subtitle": "Avaliação Morfológica e Diagnóstica por Inteligência Artificial",
    "protocol": "${protocolNumber}",
    "date": "${currentDate}",
    "time": "${currentTime}",
    "institution": "Centro de Medicina Digital Avançada",
    "department": "Setor de Análise de Feridas e Cicatrização",
    "system": "Fecha Ferida IA - Sistema Especialista v3.0",
    "version": "3.0.0",
    "responsiblePhysician": "Sistema de Inteligência Artificial Médica",
    "crm": "IA-ESPECIALISTA-2024",
    "certification": "Certificado para Análise Médica Assistida",
    "disclaimer": "Este laudo foi gerado por sistema de IA e deve ser validado por profissional médico"
  },
  "patientInfo": {
    "name": "${patientContext?.nome || 'PACIENTE NÃO IDENTIFICADO'}",
    "age": "${patientContext?.idade || 'Não informada'}",
    "gender": "${patientContext?.sexo || 'Não informado'}",
    "patientId": "TEMP_${Date.now().toString().slice(-6)}",
    "lesionLocation": "${patientContext?.localizacaoLesao || 'Não especificada'}",
    "medicalHistory": "Baseado na análise visual - histórico não disponível",
    "allergies": "Não informado",
    "currentMedications": "Não informado"
  },
  "examination": {
    "imageQuality": {
      "resolution": "[Excelente|Boa|Regular|Ruim]",
      "focus": "[Nítido|Levemente desfocado|Desfocado]",
      "lighting": "[Adequada|Insuficiente|Excessiva]",
      "positioning": "[Ideal|Adequado|Subótimo]",
      "overallScore": [número de 1-10]
    },
    "technicalAspects": {
      "hasRuler": [true|false],
      "rulerVisible": [true|false],
      "anatomicalReferences": ["lista de referências anatômicas visíveis"],
      "imageArtifacts": ["lista de artefatos ou limitações"]
    },
    "measurementReference": "Descrição da referência de medida disponível",
    "limitations": ["lista de limitações da análise por imagem"]
  },
  "findings": {
    "morphology": {
      "dimensions": {
        "length": [número estimado],
        "width": [número estimado],
        "depth": [número estimado],
        "area": [número estimado],
        "unit": "cm"
      },
      "shape": "[Circular|Oval|Irregular|Linear]",
      "edges": {
        "definition": "[Bem definidas|Irregulares|Difusas]",
        "elevation": "[Planas|Elevadas|Invertidas]",
        "epithelialization": "[Presente|Ausente|Parcial]"
      },
      "depth": "[Superficial|Parcial|Total|Profunda]"
    },
    "tissueAnalysis": {
      "granulation": {
        "percentage": [0-100],
        "quality": "[Saudável|Pálido|Friável|Ausente]",
        "color": "descrição da cor"
      },
      "necrotic": {
        "percentage": [0-100],
        "type": "[Seco|Úmido|Misto|Ausente]",
        "adherence": "[Aderente|Solto|Parcialmente aderente]"
      },
      "fibrin": {
        "percentage": [0-100],
        "distribution": "[Uniforme|Localizada|Ausente]"
      },
      "exposedStructures": ["lista de estruturas expostas"]
    },
    "surroundingTissue": {
      "skin": {
        "color": "[Normal|Eritematosa|Cianótica|Hiperpigmentada]",
        "temperature": "[Normal|Quente|Fria]",
        "texture": "[Normal|Ressecada|Macerada]",
        "integrity": "[Íntegra|Lesionada|Descamativa]"
      },
      "edema": {
        "present": [true|false],
        "severity": "[Leve|Moderado|Intenso]",
        "distribution": "[Localizado|Difuso]"
      },
      "pain": {
        "present": [true|false],
        "intensity": [0-10],
        "characteristics": ["lista de características da dor"]
      }
    },
    "vascularization": {
      "perfusion": "[Adequada|Comprometida|Ausente]",
      "capillaryRefill": "[Normal|Lento|Ausente]",
      "pulses": "[Presentes|Diminuídos|Ausentes]",
      "venousReturn": "[Normal|Comprometido]"
    },
    "signs": {
      "infection": {
        "present": [true|false],
        "severity": "[Leve|Moderada|Grave]",
        "indicators": ["lista de indicadores de infecção"]
      },
      "inflammation": {
        "present": [true|false],
        "characteristics": ["lista de características inflamatórias"]
      },
      "exudate": {
        "amount": "[Ausente|Escasso|Moderado|Abundante]",
        "type": "[Seroso|Sanguinolento|Purulento|Misto]",
        "color": "descrição da cor",
        "odor": "[Ausente|Leve|Forte|Fétido]"
      }
    }
  },
  "diagnosis": {
    "primary": {
      "condition": "Diagnóstico principal baseado na análise",
      "etiology": "Etiologia provável",
      "stage": "Estágio ou grau da lesão",
      "severity": "[Leve|Moderada|Grave]",
      "confidence": [0-100],
      "justification": "Justificativa detalhada do diagnóstico"
    },
    "differential": [
      {
        "condition": "Diagnóstico diferencial 1",
        "probability": [0-100],
        "supportingFindings": ["achados que suportam"],
        "excludingFactors": ["fatores que excluem"]
      }
    ],
    "classification": {
      "system": "Sistema de classificação aplicável",
      "grade": "Grau ou estágio",
      "description": "Descrição da classificação"
    },
    "prognosis": {
      "healingPotential": "[Excelente|Bom|Regular|Ruim]",
      "estimatedHealingTime": "Tempo estimado de cicatrização",
      "favorableFactors": ["fatores favoráveis"],
      "unfavorableFactors": ["fatores desfavoráveis"],
      "complications": [
        {
          "type": "Tipo de complicação",
          "probability": "[Baixa|Moderada|Alta]",
          "prevention": ["medidas preventivas"]
        }
      ]
    },
    "riskFactors": [
      {
        "factor": "Fator de risco",
        "impact": "[Alto|Moderado|Baixo]",
        "modifiable": [true|false],
        "intervention": "Intervenção recomendada"
      }
    ]
  },
  "recommendations": {
    "immediate": {
      "cleaning": {
        "solution": "Solução recomendada",
        "technique": "Técnica de limpeza",
        "frequency": "Frequência",
        "precautions": ["precauções especiais"]
      },
      "debridement": {
        "indicated": [true|false],
        "type": "[Cirúrgico|Mecânico|Autolítico|Enzimático]",
        "urgency": "[Imediato|Dentro de 24h|Eletivo]",
        "considerations": ["considerações especiais"]
      },
      "dressing": {
        "primary": {
          "type": "Tipo de cobertura primária",
          "product": "Produto específico",
          "application": "Modo de aplicação"
        },
        "secondary": {
          "type": "Tipo de cobertura secundária",
          "product": "Produto específico",
          "fixation": "Método de fixação"
        },
        "changeFrequency": "Frequência de troca",
        "specialInstructions": ["instruções especiais"]
      },
      "painManagement": {
        "assessment": "Avaliação da dor",
        "pharmacological": [
          {
            "medication": "Medicamento",
            "dosage": "Dosagem",
            "route": "Via de administração",
            "frequency": "Frequência",
            "duration": "Duração",
            "precautions": ["precauções"]
          }
        ],
        "nonPharmacological": ["medidas não farmacológicas"],
        "monitoring": "Monitoramento da dor"
      },
      "infectionControl": {
        "riskLevel": "[Baixo|Moderado|Alto]",
        "preventiveMeasures": ["medidas preventivas"],
        "cultureIndication": [true|false],
        "isolationPrecautions": ["precauções de isolamento"]
      }
    },
    "ongoing": {
      "positioning": {
        "pressureRelief": ["orientações de alívio de pressão"],
        "frequency": "Frequência de mudança de posição",
        "devices": ["dispositivos recomendados"],
        "contraindications": ["contraindicações"]
      },
      "nutrition": {
        "assessment": "Avaliação nutricional",
        "requirements": [
          {
            "nutrient": "Nutriente",
            "amount": "Quantidade",
            "rationale": "Justificativa"
          }
        ],
        "supplements": ["suplementos recomendados"],
        "monitoring": ["parâmetros de monitoramento"]
      },
      "lifestyle": {
        "smokingCessation": [true|false],
        "exerciseRecommendations": ["recomendações de exercício"],
        "stressManagement": ["manejo do estresse"],
        "sleepHygiene": ["higiene do sono"]
      },
      "comorbidityManagement": [
        {
          "condition": "Comorbidade",
          "impact": "Impacto na cicatrização",
          "management": ["manejo específico"],
          "monitoring": ["monitoramento necessário"]
        }
      ]
    },
    "monitoring": {
      "frequency": "Frequência de reavaliação",
      "parameters": [
        {
          "parameter": "Parâmetro a monitorar",
          "method": "Método de avaliação",
          "frequency": "Frequência",
          "targetValues": "Valores alvo",
          "actionThresholds": ["limites para ação"]
        }
      ],
      "warningSignsEducation": ["sinais de alerta"],
      "followUpSchedule": [
        {
          "timeframe": "Prazo",
          "provider": "Profissional",
          "objectives": ["objetivos da consulta"],
          "assessments": ["avaliações necessárias"]
        }
      ]
    },
    "referrals": [
      {
        "specialty": "Especialidade",
        "urgency": "[Urgente|Prioritário|Eletivo]",
        "reason": "Motivo do encaminhamento",
        "expectedOutcome": "Resultado esperado"
      }
    ],
    "patientEducation": [
      {
        "topic": "Tópico educacional",
        "keyPoints": ["pontos-chave"],
        "resources": ["recursos educacionais"],
        "assessmentMethod": "Método de avaliação do aprendizado"
      }
    ]
  },
  "footer": {
    "limitations": ["limitações da análise"],
    "disclaimers": ["avisos importantes"],
    "legalConsiderations": ["considerações legais"],
    "nextSteps": ["próximos passos"],
    "emergencyContacts": [
      {
        "service": "Serviço de emergência",
        "phone": "Telefone",
        "availability": "Disponibilidade",
        "indications": ["indicações para contato"]
      }
    ]
  }
}

DIRETRIZES CLÍNICAS ESPECIALIZADAS:
1. FORMATO: Responda APENAS com JSON válido - sem texto adicional antes ou depois
2. ANÁLISE MORFOLÓGICA: Avalie dimensões, profundidade, bordas, leito da ferida usando critérios TIME
3. TERMINOLOGIA: Use nomenclatura médica especializada (ex: tecido de granulação, fibrina, esfacelo, necrose)
4. CLASSIFICAÇÃO: Aplique escalas validadas quando aplicável (Wagner para pé diabético, PUSH Tool para úlceras)
5. MICROBIOLOGIA: Identifique sinais de colonização crítica vs infecção clínica
6. BIOMATERIAIS: Recomende coberturas baseadas em evidências científicas atuais
7. PROGNÓSTICO: Considere fatores sistêmicos e locais que afetam cicatrização
8. SEGUIMENTO: Estabeleça cronograma de reavaliação baseado na complexidade da lesão
9. CONFIANÇA: Atribua scores realistas baseados na qualidade da imagem e clareza dos achados
10. CONSISTÊNCIA: Mantenha correlação lógica entre achados, diagnóstico e conduta

CRITÉRIOS DE QUALIDADE DIAGNÓSTICA:
- Descreva achados objetivos antes de interpretações
- Diferencie entre observações diretas e inferências clínicas
- Considere diagnósticos diferenciais relevantes
- Inclua limitações da análise por imagem
- Forneça recomendações graduadas por prioridade

ANALISE A IMAGEM APLICANDO EXPERTISE EM MEDICINA DE FERIDAS E GERE O LAUDO ESTRUTURADO EM JSON.
`;
  }

  async analyzeImage(file: File, patientContext?: any): Promise<AnalysisResult> {
    try {
      console.log('🔍 Iniciando análise de imagem:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        hasPatientContext: !!patientContext
      });

      const base64Image = await this.convertFileToBase64(file);
      const mimeType = this.getMimeType(file);
      const prompt = this.createMedicalPrompt(patientContext);

      console.log('📝 Prompt criado, tamanho:', prompt.length);
      console.log('🖼️ Imagem convertida, tipo MIME:', mimeType);

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log('📡 Enviando requisição para API Gemini...');
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📊 Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Erro na API Gemini:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Erro na API Gemini: ${response.status} - ${errorData}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('✅ Dados recebidos da API:', {
        candidatesCount: data.candidates?.length || 0,
        hasContent: !!data.candidates?.[0]?.content?.parts?.[0]?.text
      });

      if (!data.candidates || data.candidates.length === 0) {
        console.error('❌ Nenhuma resposta gerada pela API Gemini:', data);
        throw new Error('Nenhuma resposta gerada pela API Gemini');
      }

      const analysisText = data.candidates[0].content.parts[0].text;
      console.log('📄 Análise concluída, tamanho do texto:', analysisText.length);

      return {
        success: true,
        data: analysisText
      };

    } catch (error) {
      console.error('💥 Erro na análise de imagem:', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        fileName: file.name,
        fileSize: file.size
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na análise'
      };
    }
  }

  async analyzePrognosis(reportData: string, patientContext?: any): Promise<AnalysisResult> {
    try {
      console.log('🔮 Iniciando análise de prognóstico:', {
        reportDataLength: reportData.length,
        hasPatientContext: !!patientContext
      });

      const prognosisPrompt = this.createPrognosisPrompt(reportData, patientContext);
      console.log('📝 Prompt de prognóstico criado, tamanho:', prognosisPrompt.length);

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prognosisPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log('📡 Enviando requisição de prognóstico para API Gemini...');
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📊 Resposta de prognóstico recebida:', {
        status: response.status,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Erro na API Gemini (prognóstico):', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Erro na API Gemini: ${response.status} - ${errorData}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('✅ Dados de prognóstico recebidos da API:', {
        candidatesCount: data.candidates?.length || 0,
        hasContent: !!data.candidates?.[0]?.content?.parts?.[0]?.text
      });

      if (!data.candidates || data.candidates.length === 0) {
        console.error('❌ Nenhuma resposta de prognóstico gerada pela API Gemini:', data);
        throw new Error('Nenhuma resposta gerada pela API Gemini');
      }

      const prognosisText = data.candidates[0].content.parts[0].text;
      console.log('📄 Análise de prognóstico concluída, tamanho do texto:', prognosisText.length);

      return {
        success: true,
        data: prognosisText
      };

    } catch (error) {
      console.error('💥 Erro na análise de prognóstico:', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        reportDataLength: reportData.length
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na análise de prognóstico'
      };
    }
  }

  private createPrognosisPrompt(reportData: string, patientContext?: any): string {
    const contextInfo = patientContext ? `
    CONTEXTO DO PACIENTE:
    - Idade: ${patientContext.age || 'Não informado'}
    - Sexo: ${patientContext.gender || 'Não informado'}
    - Condições médicas: ${patientContext.medicalConditions || 'Não informado'}
    - Medicações: ${patientContext.currentMedications || 'Não informado'}
    - Histórico de feridas: ${patientContext.woundHistory || 'Não informado'}
    ` : '';

    return `
    Você é um especialista em medicina de feridas e cicatrização. Com base no laudo médico fornecido e no contexto do paciente, forneça uma análise de prognóstico detalhada e recomendações personalizadas.

    ${contextInfo}

    LAUDO MÉDICO ANALISADO:
    ${reportData}

    Por favor, forneça sua análise no seguinte formato JSON estruturado:

    {
      "prognosisAnalysis": {
        "healingTimeEstimate": {
          "optimistic": "[tempo em semanas]",
          "realistic": "[tempo em semanas]",
          "pessimistic": "[tempo em semanas]",
          "factors": ["fatores que influenciam o tempo de cicatrização"]
        },
        "healingProbability": {
          "complete": "[porcentagem 0-100]",
          "partial": "[porcentagem 0-100]",
          "complications": "[porcentagem 0-100]",
          "reasoning": "Justificativa baseada nos achados"
        },
        "riskFactors": {
          "high": ["fatores de alto risco identificados"],
          "moderate": ["fatores de risco moderado"],
          "protective": ["fatores protetivos presentes"]
        },
        "criticalIndicators": {
          "warning": ["sinais de alerta para monitoramento"],
          "improvement": ["indicadores de melhora esperados"],
          "deterioration": ["sinais de piora a observar"]
        }
      },
      "personalizedRecommendations": {
        "immediate": {
          "priority": "alta",
          "actions": ["ações imediatas necessárias"],
          "timeline": "24-48 horas"
        },
        "shortTerm": {
          "priority": "alta",
          "actions": ["ações para 1-2 semanas"],
          "timeline": "1-2 semanas"
        },
        "longTerm": {
          "priority": "média",
          "actions": ["ações para seguimento prolongado"],
          "timeline": "1-3 meses"
        },
        "lifestyle": {
          "nutrition": ["recomendações nutricionais específicas"],
          "activity": ["orientações de atividade física"],
          "hygiene": ["cuidados de higiene personalizados"],
          "environment": ["modificações ambientais sugeridas"]
        },
        "monitoring": {
          "frequency": "[frequência de avaliação recomendada]",
          "parameters": ["parâmetros específicos a monitorar"],
          "tools": ["ferramentas de monitoramento sugeridas"],
          "alerts": ["quando buscar atendimento urgente"]
        }
      },
      "treatmentOptimization": {
        "currentApproach": {
          "effectiveness": "[alta|média|baixa]",
          "adjustments": ["ajustes sugeridos no tratamento atual"]
        },
        "alternativeOptions": {
          "conservative": ["opções conservadoras adicionais"],
          "advanced": ["terapias avançadas a considerar"],
          "surgical": ["intervenções cirúrgicas se aplicável"]
        },
        "contraindications": ["tratamentos a evitar baseado no caso"],
        "drugInteractions": ["possíveis interações medicamentosas"]
      },
      "qualityOfLife": {
        "impact": {
          "physical": "Impacto físico esperado",
          "emotional": "Impacto emocional a considerar",
          "social": "Impacto social e funcional"
        },
        "supportStrategies": ["estratégias de suporte recomendadas"],
        "adaptations": ["adaptações necessárias no dia a dia"]
      },
      "followUpPlan": {
        "schedule": {
          "week1": "Avaliação em 1 semana",
          "week2": "Avaliação em 2 semanas",
          "month1": "Avaliação em 1 mês",
          "ongoing": "Seguimento contínuo"
        },
        "specialists": ["especialistas a consultar"],
        "tests": ["exames complementares sugeridos"],
        "documentation": ["documentação necessária para seguimento"]
      },
      "evidenceBased": {
        "guidelines": ["diretrizes clínicas aplicáveis"],
        "research": ["evidências científicas relevantes"],
        "confidence": "[alta|média|baixa] - nível de confiança da análise"
      }
    }

    IMPORTANTE: 
    - Base suas recomendações em evidências científicas atuais
    - Considere as limitações da análise por imagem
    - Personalize as recomendações para o contexto específico do paciente
    - Mantenha um tom profissional e empático
    - Inclua disclaimers apropriados sobre a necessidade de avaliação presencial
    `;
  }

  async testConnection(): Promise<boolean> {
    try {
      const testRequestBody = {
        contents: [
          {
            parts: [
              {
                text: "Teste de conexão. Responda apenas 'OK'."
              }
            ]
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequestBody)
      });

      return response.ok;
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();