const createSimplifiedPrompt = (patientContext) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR');
  const protocolNumber = `CFI-${Date.now().toString().slice(-8)}`;

  return `
SISTEMA DE ANÁLISE MÉDICA - LAUDO ESTRUTURADO
============================================

Você é um especialista em análise de feridas e deve analisar a imagem médica fornecida e gerar um laudo estruturado seguindo EXATAMENTE o formato JSON especificado.

CONTEXTO DO PACIENTE:
- Nome: ${patientContext?.nome || 'PACIENTE NÃO IDENTIFICADO'}
- Idade: ${patientContext?.idade || 'Não informada'}
- Sexo: ${patientContext?.sexo || 'Não informado'}
- Localização da Lesão: ${patientContext?.localizacaoLesao || 'Não especificada'}

INSTRUÇÕES:
1. Analise cuidadosamente a imagem da ferida/lesão
2. Avalie características visuais: tamanho, cor, bordas, exsudato, tecido necrótico
3. Identifique sinais de infecção ou inflamação
4. Determine o tipo e estágio da lesão
5. Forneça recomendações de tratamento baseadas na análise

IMPORTANTE: Responda APENAS com um objeto JSON válido seguindo esta estrutura:

{
  "header": {
    "title": "LAUDO MÉDICO DIGITAL - ANÁLISE DE FERIDA IA",
    "protocol": "${protocolNumber}",
    "date": "${currentDate}",
    "time": "${currentTime}",
    "institution": "Sistema Fecha Ferida IA",
    "system": "Fecha Ferida IA v3.0",
    "version": "3.0.0",
    "responsiblePhysician": "Dr. Sistema IA",
    "crm": "IA-2024"
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
      "resolution": "Boa",
      "focus": "Nítido",
      "lighting": "Adequada",
      "positioning": "Adequado",
      "overallScore": 8
    },
    "technicalAspects": {
      "hasRuler": false,
      "rulerVisible": false,
      "anatomicalReferences": ["Estruturas anatômicas visíveis"],
      "imageArtifacts": ["Limitações identificadas"]
    },
    "measurementReference": "Estimativa baseada em referências anatômicas",
    "limitations": ["Análise baseada apenas em imagem", "Medidas aproximadas"]
  },
  "findings": {
    "morphology": {
      "dimensions": {
        "length": 0.0,
        "width": 0.0,
        "depth": 0.0,
        "area": 0.0,
        "unit": "cm"
      },
      "shape": "Descreva a forma",
      "edges": {
        "definition": "Bem definidas/Irregulares",
        "elevation": "Planas/Elevadas",
        "epithelialization": "Presente/Ausente"
      },
      "depth": "Superficial/Parcial/Total"
    },
    "tissueAnalysis": {
      "granulation": {
        "percentage": 0,
        "quality": "Saudável/Pálido/Friável",
        "color": "Descrição da cor"
      },
      "necrotic": {
        "percentage": 0,
        "type": "Seco/Úmido/Ausente",
        "adherence": "Aderente/Solto"
      },
      "fibrin": {
        "percentage": 0,
        "distribution": "Uniforme/Localizada/Ausente"
      },
      "exposedStructures": ["Estruturas expostas"]
    },
    "surroundingTissue": {
      "skin": {
        "color": "Normal/Eritematosa/Cianótica",
        "temperature": "Normal/Quente/Fria",
        "texture": "Normal/Ressecada/Macerada",
        "integrity": "Íntegra/Lesionada"
      },
      "edema": {
        "present": false,
        "severity": "Leve/Moderado/Intenso",
        "distribution": "Localizado/Difuso"
      },
      "pain": {
        "present": false,
        "intensity": 0,
        "characteristics": ["Características da dor"]
      }
    },
    "vascularization": {
      "perfusion": "Adequada/Comprometida",
      "capillaryRefill": "Normal/Lento",
      "pulses": "Presentes/Diminuídos",
      "venousReturn": "Normal/Comprometido"
    },
    "signs": {
      "infection": {
        "present": false,
        "severity": "Leve/Moderada/Grave",
        "indicators": ["Indicadores de infecção"]
      },
      "inflammation": {
        "present": false,
        "characteristics": ["Características inflamatórias"]
      },
      "exudate": {
        "amount": "Ausente/Escasso/Moderado/Abundante",
        "type": "Seroso/Sanguinolento/Purulento",
        "color": "Descrição da cor",
        "odor": "Ausente/Leve/Forte"
      }
    }
  },
  "diagnosis": {
    "primary": {
      "condition": "Diagnóstico principal baseado na análise",
      "etiology": "Etiologia provável",
      "stage": "Estágio da lesão",
      "severity": "Leve/Moderada/Grave",
      "confidence": 85,
      "justification": "Justificativa detalhada do diagnóstico"
    },
    "differential": [
      {
        "condition": "Diagnóstico diferencial",
        "probability": 20,
        "supportingFindings": ["Achados que suportam"],
        "excludingFactors": ["Fatores que excluem"]
      }
    ],
    "classification": {
      "system": "Sistema de classificação",
      "grade": "Grau",
      "description": "Descrição"
    },
    "prognosis": {
      "healingPotential": "Bom/Regular/Ruim",
      "estimatedHealingTime": "2-4 semanas",
      "favorableFactors": ["Fatores favoráveis"],
      "unfavorableFactors": ["Fatores desfavoráveis"],
      "complications": [
        {
          "type": "Tipo de complicação",
          "probability": "Baixa/Moderada/Alta",
          "prevention": ["Medidas preventivas"]
        }
      ]
    },
    "riskFactors": [
      {
        "factor": "Fator de risco",
        "impact": "Alto/Moderado/Baixo",
        "modifiable": true,
        "intervention": "Intervenção recomendada"
      }
    ]
  },
  "recommendations": {
    "immediate": {
      "cleaning": {
        "solution": "Soro fisiológico",
        "technique": "Irrigação suave",
        "frequency": "Diária",
        "precautions": ["Precauções especiais"]
      },
      "debridement": {
        "indicated": false,
        "type": "Autolítico/Mecânico/Cirúrgico",
        "urgency": "Eletivo/24h/Imediato",
        "considerations": ["Considerações especiais"]
      },
      "dressing": {
        "primary": {
          "type": "Tipo de cobertura",
          "product": "Produto específico",
          "application": "Modo de aplicação"
        },
        "secondary": {
          "type": "Cobertura secundária",
          "product": "Produto",
          "fixation": "Método de fixação"
        },
        "changeFrequency": "Frequência de troca",
        "specialInstructions": ["Instruções especiais"]
      },
      "painManagement": {
        "assessment": "Avaliação da dor",
        "pharmacological": [
          {
            "medication": "Medicamento",
            "dosage": "Dose",
            "route": "Via",
            "frequency": "Frequência",
            "duration": "Duração",
            "precautions": ["Precauções"]
          }
        ],
        "nonPharmacological": ["Medidas não farmacológicas"],
        "monitoring": "Monitoramento"
      },
      "infectionControl": {
        "riskLevel": "Baixo/Moderado/Alto",
        "preventiveMeasures": ["Medidas preventivas"],
        "cultureIndication": false,
        "isolationPrecautions": ["Precauções"]
      }
    },
    "ongoing": {
      "positioning": {
        "pressureRelief": ["Alívio de pressão"],
        "frequency": "Frequência",
        "devices": ["Dispositivos"],
        "contraindications": ["Contraindicações"]
      },
      "nutrition": {
        "assessment": "Avaliação nutricional",
        "requirements": [
          {
            "nutrient": "Proteína",
            "amount": "1.2-1.5g/kg/dia",
            "rationale": "Cicatrização"
          }
        ],
        "supplements": ["Suplementos"],
        "monitoring": ["Monitoramento"]
      },
      "lifestyle": {
        "smokingCessation": true,
        "exerciseRecommendations": ["Exercícios"],
        "stressManagement": ["Manejo do estresse"],
        "sleepHygiene": ["Higiene do sono"]
      },
      "comorbidityManagement": [
        {
          "condition": "Diabetes",
          "impact": "Impacto na cicatrização",
          "management": ["Controle glicêmico"],
          "monitoring": ["Glicemia"]
        }
      ]
    },
    "monitoring": {
      "frequency": "Semanal",
      "parameters": [
        {
          "parameter": "Tamanho da lesão",
          "method": "Medição",
          "frequency": "Semanal",
          "targetValues": "Redução progressiva",
          "actionThresholds": ["Aumento do tamanho"]
        }
      ],
      "warningSignsEducation": ["Sinais de alerta"],
      "followUpSchedule": [
        {
          "timeframe": "1 semana",
          "provider": "Enfermeiro",
          "objectives": ["Avaliação da evolução"],
          "assessments": ["Medição da lesão"]
        }
      ]
    },
    "referrals": [
      {
        "specialty": "Cirurgia Vascular",
        "urgency": "Eletivo",
        "reason": "Avaliação vascular",
        "expectedOutcome": "Melhora da perfusão"
      }
    ],
    "patientEducation": [
      {
        "topic": "Cuidados com a ferida",
        "keyPoints": ["Limpeza adequada", "Troca de curativo"],
        "resources": ["Folhetos educativos"],
        "assessmentMethod": "Demonstração prática"
      }
    ]
  },
  "footer": {
    "limitations": ["Análise baseada apenas em imagem"],
    "disclaimers": ["Este laudo não substitui avaliação presencial"],
    "legalConsiderations": ["Uso apenas para orientação"],
    "nextSteps": ["Acompanhamento médico"],
    "emergencyContacts": [
      {
        "service": "SAMU",
        "phone": "192",
        "availability": "24h",
        "indications": ["Emergências médicas"]
      }
    ]
  }
}

IMPORTANTE: 
- Responda APENAS com o JSON válido
- Não inclua texto adicional antes ou depois do JSON
- Preencha todos os campos com base na análise da imagem
- Use valores realistas e clinicamente apropriados
- Mantenha a estrutura exata do JSON
`;
};

const createPrognosisPrompt = (reportData, patientContext) => {
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
    - Responda APENAS com o JSON válido
    `;
};

module.exports = { createSimplifiedPrompt, createPrognosisPrompt };
