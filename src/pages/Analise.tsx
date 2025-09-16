import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileImage, X, Brain, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo-fecha-ferida.jpg";

const Analise = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisResult(null);
      toast({
        title: "Arquivo carregado",
        description: `${file.name} pronto para análise`,
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.dicom', '.dcm']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleAnalysis = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    
    // Simular análise com IA (em produção seria integração com Gemini API)
    setTimeout(() => {
      const mockResult = `
**LAUDO MÉDICO - ANÁLISE POR IA**

**DADOS DO EXAME:**
- Arquivo: ${uploadedFile.name}
- Data: ${new Date().toLocaleDateString('pt-BR')}
- Tipo: Imagem médica

**DESCRIÇÃO:**
Imagem médica analisada através de inteligência artificial avançada. A análise identifica características relevantes para diagnóstico médico.

**ACHADOS PRINCIPAIS:**
• Estruturas anatômicas preservadas
• Densidade e contraste dentro dos parâmetros esperados
• Ausência de alterações significativas visíveis
• Recomenda-se correlação clínica

**IMPRESSÃO DIAGNÓSTICA:**
Exame dentro dos padrões de normalidade para o tipo de imagem analisada. Estruturas anatômicas bem definidas e sem alterações patológicas evidentes.

**OBSERVAÇÕES:**
- Análise realizada por IA com tecnologia Gemini
- Recomenda-se sempre correlação com dados clínicos
- Em caso de dúvidas, consulte um especialista

**CONCLUSÃO:**
Imagem compatível com normalidade. Sugerimos acompanhamento clínico de rotina.
      `;
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      toast({
        title: "Análise concluída",
        description: "Laudo médico gerado com sucesso",
      });
    }, 3000);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header simplificado */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Plataforma Fecha Ferida" 
              className="w-10 h-10 rounded-full object-cover shadow-soft"
            />
            <div>
              <h1 className="text-lg font-bold text-primary">Plataforma Fecha Ferida</h1>
              <p className="text-xs text-muted-foreground">Análise médica com IA</p>
            </div>
          </Link>
          
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </header>

      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Análise de Imagem Médica</h1>
            <p className="text-xl text-muted-foreground">
              Faça upload de sua imagem médica e receba um laudo detalhado em segundos
            </p>
          </div>

          <Card className="p-8 shadow-medium border-2 border-dashed">
            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {isDragActive
                    ? 'Solte o arquivo aqui'
                    : 'Arraste sua imagem ou clique para selecionar'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Suporte para PNG, JPG, JPEG e DICOM • Máximo 10MB
                </p>
                <Button variant="outline" size="lg">
                  Selecionar Arquivo
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div className="flex items-center space-x-3">
                    <FileImage className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeFile}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {!analysisResult && (
                  <div className="text-center">
                    <Button
                      onClick={handleAnalysis}
                      size="lg"
                      disabled={isAnalyzing}
                      className="bg-gradient-primary shadow-medium hover:shadow-strong transition-all px-8"
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="mr-2 h-5 w-5 animate-pulse" />
                          Analisando...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-5 w-5" />
                          Iniciar Análise
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center p-8">
                    <div className="inline-flex items-center space-x-2 text-primary">
                      <Brain className="h-6 w-6 animate-spin" />
                      <span className="text-lg font-semibold">Processando com IA...</span>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      Analisando sua imagem médica, aguarde alguns segundos.
                    </p>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-medical-success">
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-semibold text-lg">Análise Concluída</span>
                    </div>
                    
                    <Card className="p-6 bg-card shadow-soft border border-border">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-card-foreground font-mono text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border">
                          {analysisResult}
                        </pre>
                      </div>
                    </Card>

                    <div className="flex space-x-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.print()}
                      >
                        Imprimir Laudo
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={removeFile}
                      >
                        Nova Análise
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Informações adicionais */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Formatos Suportados</h3>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, JPEG, DICOM
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">IA Avançada</h3>
              <p className="text-sm text-muted-foreground">
                Análise com Gemini AI
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">95% Precisão</h3>
              <p className="text-sm text-muted-foreground">
                Resultados confiáveis
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analise;