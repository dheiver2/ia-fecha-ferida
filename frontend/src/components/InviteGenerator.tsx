import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Share2, 
  Mail, 
  MessageSquare, 
  Link2, 
  Clock,
  User,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InviteData {
  roomId: string;
  doctorName: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  scheduledTime?: Date;
  duration?: number; // em minutos
  notes?: string;
}

interface InviteGeneratorProps {
  doctorName: string;
  onInviteGenerated: (inviteData: InviteData) => void;
  onInviteSent?: (method: 'email' | 'whatsapp' | 'sms', patientData: {
    name: string;
    contact: string;
    roomId: string;
  }) => void;
}

export const InviteGenerator: React.FC<InviteGeneratorProps> = ({
  doctorName,
  onInviteGenerated,
  onInviteSent
}) => {
  const [inviteData, setInviteData] = useState<Partial<InviteData>>({
    doctorName,
    duration: 30,
    scheduledTime: new Date()
  });
  
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Gerar ID único para a sala
  const generateRoomId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `room_${timestamp}_${randomStr}`;
  };

  // Gerar link de convite
  const generateInviteLink = async () => {
    setIsGenerating(true);
    
    try {
      const roomId = generateRoomId();
      const baseUrl = window.location.origin;
      const inviteLink = `${baseUrl}/teleconsulta/${roomId}`;
      
      const completeInviteData: InviteData = {
        roomId,
        doctorName: inviteData.doctorName || doctorName,
        patientName: inviteData.patientName,
        patientEmail: inviteData.patientEmail,
        patientPhone: inviteData.patientPhone,
        scheduledTime: inviteData.scheduledTime,
        duration: inviteData.duration || 30,
        notes: inviteData.notes
      };

      setGeneratedLink(inviteLink);
      
      // Salvar dados do convite (aqui você salvaria no backend)
      localStorage.setItem(`invite_${roomId}`, JSON.stringify(completeInviteData));
      
      if (onInviteGenerated) {
        onInviteGenerated(completeInviteData);
      }
      
    } catch (error) {
      console.error('Erro ao gerar convite:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar link para clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  // Compartilhar via WhatsApp
  const shareWhatsApp = () => {
    const message = generateInviteMessage();
    const whatsappUrl = `https://wa.me/${inviteData.patientPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Notificar que o convite foi enviado
    if (onInviteSent && inviteData.patientName && inviteData.patientPhone && inviteData.roomId) {
      onInviteSent('whatsapp', {
        name: inviteData.patientName,
        contact: inviteData.patientPhone,
        roomId: inviteData.roomId
      });
    }
  };

  // Compartilhar via Email
  const shareEmail = () => {
    const subject = `Convite para Teleconsulta - ${doctorName}`;
    const body = generateInviteMessage();
    const emailUrl = `mailto:${inviteData.patientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
    
    // Notificar que o convite foi enviado
    if (onInviteSent && inviteData.patientName && inviteData.patientEmail && inviteData.roomId) {
      onInviteSent('email', {
        name: inviteData.patientName,
        contact: inviteData.patientEmail,
        roomId: inviteData.roomId
      });
    }
  };

  // Gerar mensagem de convite
  const generateInviteMessage = (): string => {
    const scheduledTime = inviteData.scheduledTime;
    const timeStr = scheduledTime ? format(scheduledTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'horário a combinar';
    
    return `🩺 *Convite para Teleconsulta*

Olá ${inviteData.patientName || 'paciente'}!

Você foi convidado(a) para uma teleconsulta com ${doctorName}.

📅 *Data e Horário:* ${timeStr}
⏱️ *Duração:* ${inviteData.duration} minutos
${inviteData.notes ? `📝 *Observações:* ${inviteData.notes}` : ''}

🔗 *Link para a consulta:*
${generatedLink}

*Instruções:*
1. Clique no link acima no horário marcado
2. Permita acesso à câmera e microfone
3. Aguarde a conexão com o médico

Em caso de dúvidas, entre em contato conosco.

Atenciosamente,
${doctorName}`;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Gerar Convite para Teleconsulta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações do Paciente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientName">Nome do Paciente</Label>
            <Input
              id="patientName"
              value={inviteData.patientName || ''}
              onChange={(e) => setInviteData(prev => ({ ...prev, patientName: e.target.value }))}
              placeholder="Digite o nome do paciente"
            />
          </div>
          
          <div>
            <Label htmlFor="patientEmail">Email do Paciente</Label>
            <Input
              id="patientEmail"
              type="email"
              value={inviteData.patientEmail || ''}
              onChange={(e) => setInviteData(prev => ({ ...prev, patientEmail: e.target.value }))}
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientPhone">Telefone/WhatsApp</Label>
            <Input
              id="patientPhone"
              value={inviteData.patientPhone || ''}
              onChange={(e) => setInviteData(prev => ({ ...prev, patientPhone: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div>
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Input
              id="duration"
              type="number"
              value={inviteData.duration || 30}
              onChange={(e) => setInviteData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min="15"
              max="120"
            />
          </div>
        </div>

        {/* Data e Hora */}
        <div>
          <Label htmlFor="scheduledTime">Data e Hora da Consulta</Label>
          <Input
            id="scheduledTime"
            type="datetime-local"
            value={inviteData.scheduledTime ? format(inviteData.scheduledTime, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => setInviteData(prev => ({ ...prev, scheduledTime: new Date(e.target.value) }))}
          />
        </div>

        {/* Observações */}
        <div>
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Textarea
            id="notes"
            value={inviteData.notes || ''}
            onChange={(e) => setInviteData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Instruções especiais, preparação necessária, etc."
            rows={3}
          />
        </div>

        {/* Botão Gerar Convite */}
        <Button 
          onClick={generateInviteLink}
          disabled={isGenerating || !inviteData.patientName}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Gerando Convite...
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-2" />
              Gerar Link de Convite
            </>
          )}
        </Button>

        {/* Link Gerado */}
        {generatedLink && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Convite Gerado com Sucesso!</span>
            </div>
            
            {/* Link */}
            <div className="flex gap-2">
              <Input
                value={generatedLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className={copied ? 'bg-green-100 border-green-300' : ''}
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Opções de Compartilhamento */}
            <div className="flex flex-wrap gap-2">
              {inviteData.patientPhone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareWhatsApp}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </Button>
              )}
              
              {inviteData.patientEmail && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareEmail}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.share?.({ 
                  title: 'Convite para Teleconsulta',
                  text: generateInviteMessage(),
                  url: generatedLink 
                })}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>

            {/* Resumo do Convite */}
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Paciente: {inviteData.patientName}</span>
              </div>
              {inviteData.scheduledTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(inviteData.scheduledTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Duração: {inviteData.duration} minutos</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};