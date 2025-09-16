import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Ana Silva",
    role: "Radiologista - Hospital São Lucas",
    content: "A plataforma revolucionou minha rotina. O que antes levava horas para analisar, agora faço em minutos com precisão impressionante.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    name: "Dr. Carlos Mendes",
    role: "Dermatologista - Clínica Vida",
    content: "A análise de lesões de pele ficou muito mais eficiente. A IA detecta detalhes que às vezes passam despercebidos no primeiro olhar.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    name: "Dra. Maria Santos",
    role: "Cardiologista - CardioCenter",
    content: "Excelente ferramenta para análise de exames cardiológicos. A interface é intuitiva e os resultados são sempre confiáveis.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1594824475598-b0d63e25ac56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            O que dizem os 
            <span className="text-primary"> especialistas</span>
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
                  <Star key={i} className="h-5 w-5 text-medical-warning fill-current" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-gradient-primary rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-8">Resultados que falam por si</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-white/80">Precisão na análise</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30s</div>
              <div className="text-white/80">Tempo médio</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-white/80">Médicos ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-white/80">Análises realizadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;