// Template Simplificado para Relatório Médico
export interface SimplifiedMedicalReport {
  header: {
    title: string;
    protocol: string;
    date: string;
    time: string;
    institution: string;
    system: string;
    version: string;
    responsiblePhysician: string;
    crm: string;
  };
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    patientId: string;
    lesionLocation: string;
    medicalHistory?: string;
    allergies?: string;
    currentMedications?: string;
  };
  examination: {
    imageQuality: {
      resolution: string;
      focus: string;
      lighting: string;
      positioning: string;
      overallScore: number;
    };
    technicalAspects: {
      hasRuler: boolean;
      rulerVisible: boolean;
      anatomicalReferences: string[];
      imageArtifacts: string[];
    };
    measurementReference: string;
    limitations: string[];
  };
  findings: {
    morphology: {
      dimensions: {
        length: number;
        width: number;
        depth: number;
        area: number;
        unit: string;
      };
      shape: string;
      edges: {
        definition: string;
        elevation: string;
        epithelialization: string;
      };
      depth: string;
    };
    tissueAnalysis: {
      granulation: {
        percentage: number;
        quality: string;
        color: string;
      };
      necrotic: {
        percentage: number;
        type: string;
        adherence: string;
      };
      fibrin: {
        percentage: number;
        distribution: string;
      };
      exposedStructures: string[];
    };
    surroundingTissue: {
      skin: {
        color: string;
        temperature: string;
        texture: string;
        integrity: string;
      };
      edema: {
        present: boolean;
        severity: string;
        distribution: string;
      };
      pain: {
        present: boolean;
        intensity: number;
        characteristics: string[];
      };
    };
    vascularization: {
      perfusion: string;
      capillaryRefill: string;
      pulses: string;
      venousReturn: string;
    };
    signs: {
      infection: {
        present: boolean;
        severity: string;
        indicators: string[];
      };
      inflammation: {
        present: boolean;
        characteristics: string[];
      };
      exudate: {
        amount: string;
        type: string;
        color: string;
        odor: string;
      };
    };
  };
  diagnosis: {
    primary: {
      condition: string;
      etiology: string;
      stage: string;
      severity: string;
      confidence: number;
      justification: string;
    };
    differential: Array<{
      condition: string;
      probability: number;
      supportingFindings: string[];
      excludingFactors: string[];
    }>;
    classification: {
      system: string;
      grade: string;
      description: string;
    };
    prognosis: {
      healingPotential: string;
      estimatedHealingTime: string;
      favorableFactors: string[];
      unfavorableFactors: string[];
      complications: Array<{
        type: string;
        probability: string;
        prevention: string[];
      }>;
    };
    riskFactors: Array<{
      factor: string;
      impact: string;
      modifiable: boolean;
      intervention: string;
    }>;
  };
  recommendations: {
    immediate: {
      cleaning: {
        solution: string;
        technique: string;
        frequency: string;
        precautions: string[];
      };
      debridement: {
        indicated: boolean;
        type: string;
        urgency: string;
        considerations: string[];
      };
      dressing: {
        primary: {
          type: string;
          product: string;
          application: string;
        };
        secondary: {
          type: string;
          product: string;
          fixation: string;
        };
        changeFrequency: string;
        specialInstructions: string[];
      };
      painManagement: {
        assessment: string;
        pharmacological: Array<{
          medication: string;
          dosage: string;
          route: string;
          frequency: string;
          duration: string;
          precautions: string[];
        }>;
        nonPharmacological: string[];
        monitoring: string;
      };
      infectionControl: {
        riskLevel: string;
        preventiveMeasures: string[];
        cultureIndication: boolean;
        isolationPrecautions: string[];
      };
    };
    ongoing: {
      positioning: {
        pressureRelief: string[];
        frequency: string;
        devices: string[];
        contraindications: string[];
      };
      nutrition: {
        assessment: string;
        requirements: Array<{
          nutrient: string;
          amount: string;
          rationale: string;
        }>;
        supplements: string[];
        monitoring: string[];
      };
      lifestyle: {
        smokingCessation: boolean;
        exerciseRecommendations: string[];
        stressManagement: string[];
        sleepHygiene: string[];
      };
      comorbidityManagement: Array<{
        condition: string;
        impact: string;
        management: string[];
        monitoring: string[];
      }>;
    };
    monitoring: {
      frequency: string;
      parameters: Array<{
        parameter: string;
        method: string;
        frequency: string;
        targetValues: string;
        actionThresholds: string[];
      }>;
      warningSignsEducation: string[];
      followUpSchedule: Array<{
        timeframe: string;
        provider: string;
        objectives: string[];
        assessments: string[];
      }>;
    };
    referrals: Array<{
      specialty: string;
      urgency: string;
      reason: string;
      expectedOutcome: string;
    }>;
    patientEducation: Array<{
      topic: string;
      keyPoints: string[];
      resources: string[];
      assessmentMethod: string;
    }>;
  };
  footer: {
    limitations: string[];
    disclaimers: string[];
    legalConsiderations: string[];
    nextSteps: string[];
    emergencyContacts: Array<{
      service: string;
      phone: string;
      availability: string;
      indications: string[];
    }>;
  };
}

export const createSimplifiedPrompt = (patientContext?: any): string => {
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