import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import SimpleVideoCall from '@/components/SimpleVideoCall';

const SimpleJoin: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  
  const doctorName = searchParams.get('doctor') || 'Médico';
  const patientName = searchParams.get('patient') || 'Paciente';

  return (
    <SimpleVideoCall 
      doctorName={doctorName}
      patientName={patientName}
      roomId={roomId}
    />
  );
};

export default SimpleJoin;