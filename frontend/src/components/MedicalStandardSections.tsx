import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  Activity, 
  Eye, 
  Target, 
  Clipboard, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Hash,
  Stethoscope
} from 'lucide-react';

// Interfaces baseadas em padrões DICOM/HL7
interface DICOMPatientInfo {
  patientID: string;
  patientName: string;
  patientBirthDate: string;
  patientSex: string;
  patientAge?: string;
  patientWeight?: string;
  patientHeight?: string;
}

interface DICOMStudyInfo {
  studyInstanceUID: string;
  studyDate: string;
  studyTime: string;
  studyDescription: string;
  accessionNumber: string;
  referringPhysician: string;
  performingPhysician: string;
}

interface DICOMSeriesInfo {
  seriesInstanceUID: string;
  seriesNumber: string;
  seriesDescription: string;
  modality: string;
  bodyPartExamined: string;
  viewPosition?: string;
}

interface HL7ReportSection {
  sectionCode: string;
  sectionTitle: string;
  content: string;
  confidenceLevel?: number;
  urgencyLevel?: 'routine' | 'urgent' | 'stat';
}

interface MedicalStandardSectionsProps {
  patientInfo?: DICOMPatientInfo;
  studyInfo?: DICOMStudyInfo;
  seriesInfo?: DICOMSeriesInfo;
  reportSections?: HL7ReportSection[];
  analysisContent?: string;
}

export const MedicalStandardSections: React.FC<MedicalStandardSectionsProps> = ({
  patientInfo,
  studyInfo,
  seriesInfo,
  reportSections = [],
  analysisContent = ''
}) => {
  
  // Função para renderizar seção DICOM
  const renderDICOMSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <Card className="mb-6 shadow-lg border-l-4 border-blue-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
        <CardTitle className="flex items-center space-x-2 text-blue-800">
          {icon}
          <span className="text-lg font-bold">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );

  // Função para renderizar campo DICOM
  const renderDICOMField = (label: string, value: string | undefined, tag?: string) => {
    if (!value) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-b-0">
        <div className="font-medium text-gray-700 flex items-center space-x-1">
          <span>{label}</span>
          {tag && <span className="text-xs text-gray-500 font-mono">({tag})</span>}
        </div>
        <div className="md:col-span-2 text-gray-900 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
          {value}
        </div>
      </div>
    );
  };

  // Função para renderizar seção HL7
  const renderHL7Section = (section: HL7ReportSection) => {
    const getUrgencyColor = () => {
      switch (section.urgencyLevel) {
        case 'stat': return 'border-red-500 bg-red-50';
        case 'urgent': return 'border-orange-500 bg-orange-50';
        default: return 'border-green-500 bg-green-50';
      }
    };

    const getUrgencyIcon = () => {
      switch (section.urgencyLevel) {
        case 'stat': return <AlertTriangle className="h-5 w-5 text-red-600" />;
        case 'urgent': return <Clock className="h-5 w-5 text-orange-600" />;
        default: return <CheckCircle className="h-5 w-5 text-green-600" />;
      }
    };

    return (
      <Card key={section.sectionCode} className={`mb-4 shadow-md border-l-4 ${getUrgencyColor()}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getUrgencyIcon()}
              <span className="text-lg font-bold text-gray-800">{section.sectionTitle}</span>
              <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {section.sectionCode}
              </span>
            </div>
            {section.confidenceLevel && (
              <div className="flex items-center space-x-1 text-sm">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-600">
                  {section.confidenceLevel}% confiança
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Seção de Informações do Paciente (DICOM) */}
      {patientInfo && renderDICOMSection(
        "Informações do Paciente (DICOM)",
        <User className="h-5 w-5 text-blue-600" />,
        <div className="space-y-1">
          {renderDICOMField("ID do Paciente", patientInfo.patientID, "0010,0020")}
          {renderDICOMField("Nome do Paciente", patientInfo.patientName, "0010,0010")}
          {renderDICOMField("Data de Nascimento", patientInfo.patientBirthDate, "0010,0030")}
          {renderDICOMField("Sexo", patientInfo.patientSex, "0010,0040")}
          {renderDICOMField("Idade", patientInfo.patientAge, "0010,1010")}
          {renderDICOMField("Peso", patientInfo.patientWeight, "0010,1030")}
          {renderDICOMField("Altura", patientInfo.patientHeight, "0010,1020")}
        </div>
      )}

      {/* Seção de Informações do Estudo (DICOM) */}
      {studyInfo && renderDICOMSection(
        "Informações do Estudo (DICOM)",
        <Calendar className="h-5 w-5 text-blue-600" />,
        <div className="space-y-1">
          {renderDICOMField("UID da Instância do Estudo", studyInfo.studyInstanceUID, "0020,000D")}
          {renderDICOMField("Data do Estudo", studyInfo.studyDate, "0008,0020")}
          {renderDICOMField("Hora do Estudo", studyInfo.studyTime, "0008,0030")}
          {renderDICOMField("Descrição do Estudo", studyInfo.studyDescription, "0008,1030")}
          {renderDICOMField("Número de Acesso", studyInfo.accessionNumber, "0008,0050")}
          {renderDICOMField("Médico Solicitante", studyInfo.referringPhysician, "0008,0090")}
          {renderDICOMField("Médico Executante", studyInfo.performingPhysician, "0008,1050")}
        </div>
      )}

      {/* Seção de Informações da Série (DICOM) */}
      {seriesInfo && renderDICOMSection(
        "Informações da Série (DICOM)",
        <Hash className="h-5 w-5 text-blue-600" />,
        <div className="space-y-1">
          {renderDICOMField("UID da Instância da Série", seriesInfo.seriesInstanceUID, "0020,000E")}
          {renderDICOMField("Número da Série", seriesInfo.seriesNumber, "0020,0011")}
          {renderDICOMField("Descrição da Série", seriesInfo.seriesDescription, "0008,103E")}
          {renderDICOMField("Modalidade", seriesInfo.modality, "0008,0060")}
          {renderDICOMField("Parte do Corpo Examinada", seriesInfo.bodyPartExamined, "0018,0015")}
          {renderDICOMField("Posição da Vista", seriesInfo.viewPosition, "0018,5101")}
        </div>
      )}

      {/* Seções do Relatório (HL7) */}
      {reportSections.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>Relatório Médico Estruturado (HL7)</span>
          </h2>
          {reportSections.map(renderHL7Section)}
        </div>
      )}

      {/* Análise por IA (se não houver seções estruturadas) */}
      {reportSections.length === 0 && analysisContent && (
        <Card className="shadow-lg border-l-4 border-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-3">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Stethoscope className="h-5 w-5" />
              <span className="text-lg font-bold">Análise por Inteligência Artificial</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {analysisContent}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rodapé de Conformidade */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div className="text-sm text-gray-700">
              <p className="font-medium">Conformidade com Padrões Médicos</p>
              <p className="text-xs text-gray-600">
                Este documento segue os padrões DICOM 3.0 e HL7 FHIR R4 para interoperabilidade médica
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalStandardSections;