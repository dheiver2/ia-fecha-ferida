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
    <Card className="w-full max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
        <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Link2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          Gerar Convite para Teleconsulta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Informações do Paciente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="patientName" className="text-slate-700 dark:text-slate-300">Nome do Paciente</Label>
            <Input
              id="patientName"
              value={inviteData.patientName || ''}
              onChange={(e) => setInviteData(prev => ({ ...prev, patientName: e.target.value }))}
              placeholder="Digite o nome do paciente"
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientEmail" className="text-slate-700 dark:text-slate-300">Email do Paciente</Label>
            <Input
              id="patientEmail"
              type="email"
              value={inviteData.patientEmail || ''}
              onChange={(e) => setInviteData(prev => ({ ...prev, patientEmail: e.target.value }))}
              placeholder="email@exemplo.com"
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="patientPhone" className="text-slate-700 dark:text-slate-300">Telefone/WhatsApp</Label>
            <Input
              id="patientPhone"
              value={inviteData.patientPhone || ''}
              onChange={(e) => setInviteData(prev => ({ ...prev, patientPhone: e.target.value }))}
              placeholder="(11) 99999-9999"
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-slate-700 dark:text-slate-300">Duração (minutos)</Label>
            <Input
              id="duration"
              type="number"
              value={inviteData.duration || 30}
              onChange={(e) => setInviteData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min="15"
              max="120"
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Data e Hora */}
        <div className="space-y-2">
          <Label htmlFor="scheduledTime" className="text-slate-700 dark:text-slate-300">Data e Hora da Consulta</Label>
          <Input
            id="scheduledTime"
            type="datetime-local"
            value={inviteData.scheduledTime ? format(inviteData.scheduledTime, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => setInviteData(prev => ({ ...prev, scheduledTime: new Date(e.target.value) }))}
            className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
          />
        </div>

        {/* Observações */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-slate-700 dark:text-slate-300">Observações (opcional)</Label>
          <Textarea
            id="notes"
            value={inviteData.notes || ''}
            onChange={(e) => setInviteData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Instruções especiais, preparação necessária, etc."
            rows={3}
            className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none bg-slate-50 dark:bg-slate-800/30"
          />
        </div>

        {/* Botão Gerar Convite */}
        <Button 
          onClick={generateInviteLink}
          disabled={isGenerating || !inviteData.patientName}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 h-12 text-lg"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Clock className="w-5 h-5 mr-2 animate-spin" />
              Gerando Convite...
            </>
          ) : (
            <>
              <Link2 className="w-5 h-5 mr-2" />
              Gerar Link de Convite
            </>
          )}
        </Button>

        {/* Link Gerado */}
        {generatedLink && (
          <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-emerald-100 dark:bg-emerald-800 rounded-full">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-semibold text-emerald-800 dark:text-emerald-200">Convite Gerado com Sucesso!</span>
            </div>
            
            {/* Link */}
            <div className="flex gap-2">
              <Input
                value={generatedLink}
                readOnly
                className="flex-1 bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className={`border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 ${copied ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-white dark:bg-slate-900'}`}
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
                  className="flex items-center gap-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900"
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
                  className="flex items-center gap-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900"
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
                className="flex items-center gap-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>

            {/* Resumo do Convite */}
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2 pt-2 border-t border-emerald-100 dark:border-emerald-800/50">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Paciente: <strong className="text-slate-800 dark:text-slate-200">{inviteData.patientName}</strong></span>
              </div>
              {inviteData.scheduledTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {format(inviteData.scheduledTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Duração: {inviteData.duration} minutos</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};