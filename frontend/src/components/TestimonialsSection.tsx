import { Star, Quote, Activity, Clock, Users, FileCheck } from "lucide-react";

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
    <section id="depoimentos" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] rounded-full bg-emerald-400/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[20%] h-[20%] rounded-full bg-blue-400/10 blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-medium backdrop-blur-sm mb-6">
            <Quote className="w-4 h-4" />
            Depoimentos
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            O que dizem os 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300"> médicos laudadores</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Profissionais de saúde de todo o país já transformaram suas práticas médicas 
            com nossa tecnologia de análise inteligente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 relative hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="relative w-16 h-16 rounded-full object-cover mr-4 border-2 border-white dark:border-slate-800 shadow-md"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic relative z-10">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-900 dark:to-teal-900" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
          
          <div className="relative z-10 p-12 text-center">
            <h3 className="text-3xl font-bold mb-12 text-white">Resultados que falam por si</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <Activity className="w-8 h-8 text-emerald-100" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">95%</div>
                <div className="font-medium text-emerald-100">Precisão na análise</div>
              </div>
              
              <div className="group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <Clock className="w-8 h-8 text-emerald-100" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">30s</div>
                <div className="font-medium text-emerald-100">Tempo médio</div>
              </div>
              
              <div className="group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <Users className="w-8 h-8 text-emerald-100" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">500+</div>
                <div className="font-medium text-emerald-100">Médicos ativos</div>
              </div>
              
              <div className="group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <FileCheck className="w-8 h-8 text-emerald-100" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">10k+</div>
                <div className="font-medium text-emerald-100">Análises realizadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;