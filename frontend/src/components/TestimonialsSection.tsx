import { Star, Quote } from "lucide-react";

// Avatares SVG locais para evitar problemas de CORS
const avatars = {
  drAna: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNGMEY5RkYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxOCIgZmlsbD0iIzM5OEVDQyIvPjxwYXRoIGQ9Ik0yMCA4NUMyMCA3MC4wODg3IDMyLjA4ODcgNTggNDcgNThINTNDNjcuOTExMyA1OCA4MCA3MC4wODg3IDgwIDg1VjEwMEgyMFY4NVoiIGZpbGw9IiMzOThFQ0MiLz48L3N2Zz4=",
  drCarlos: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNGRUY3RjAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxOCIgZmlsbD0iIzY2QkI2QSIvPjxwYXRoIGQ9Ik0yMCA4NUMyMCA3MC4wODg3IDMyLjA4ODcgNTggNDcgNThINTNDNjcuOTExMyA1OCA4MCA3MC4wODg3IDgwIDg1VjEwMEgyMFY4NVoiIGZpbGw9IiM2NkJCNkEiLz48L3N2Zz4=",
  drMaria: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNGRUY0RjIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxOCIgZmlsbD0iI0Y5N0M0QyIvPjxwYXRoIGQ9Ik0yMCA4NUMyMCA3MC4wODg3IDMyLjA4ODcgNTggNDcgNThINTNDNjcuOTExMyA1OCA4MCA3MC4wODg3IDgwIDg1VjEwMEgyMFY4NVoiIGZpbGw9IiNGOTdDNEMiLz48L3N2Zz4="
};

const testimonials = [
  {
    name: "Dr. Ana Silva",
    role: "Médico Laudador - Hospital São Lucas",
    content: "A plataforma revolucionou minha rotina. O que antes levava horas para analisar, agora faço em minutos com precisão impressionante.",
    rating: 5,
    image: avatars.drAna
  },
  {
    name: "Dr. Carlos Mendes",
    role: "Médico Laudador - Clínica Vida",
    content: "A análise de lesões de pele ficou muito mais eficiente. A IA detecta detalhes que às vezes passam despercebidos no primeiro olhar.",
    rating: 5,
    image: avatars.drCarlos
  },
  {
    name: "Dra. Maria Santos",
    role: "Médico Laudador - CardioCenter",
    content: "Excelente ferramenta para análise de exames. A interface é intuitiva e os resultados são sempre confiáveis.",
    rating: 5,
    image: avatars.drMaria
  }
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            O que dizem os 
            <span className="text-primary"> médicos laudadores</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Profissionais de saúde de todo o país já transformaram suas práticas médicas 
            com nossa tecnologia de análise inteligente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50 relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4 shadow-soft"
                />
                <div>
                  <h4 className="font-bold text-card-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-medical-warning fill-medical-warning" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-gradient-hero rounded-3xl p-12 text-center shadow-strong">
          <h3 className="text-3xl font-bold mb-8 text-on-gradient">Resultados que falam por si</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2 text-on-gradient">95%</div>
              <div className="font-medium text-on-gradient">Precisão na análise</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-on-gradient">30s</div>
              <div className="font-medium text-on-gradient">Tempo médio</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-on-gradient">500+</div>
              <div className="font-medium text-on-gradient">Médicos ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-on-gradient">10k+</div>
              <div className="font-medium text-on-gradient">Análises realizadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;