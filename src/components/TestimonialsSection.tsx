import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "María González",
      role: "Mamá de 2, Ciudad de México",
      content: "Por fin algo que funciona para mí. 25 minutos mientras los niños ven tele. Llevo 3 semanas sin fallar un día.",
      rating: 5,
    },
    {
      name: "Carlos Mendoza",
      role: "Ejecutivo, Monterrey",
      content: "Había probado 5 apps antes. Dale es la única que no me hace perder tiempo eligiendo. Empiezo y ya.",
      rating: 5,
    },
    {
      name: "Ana Sofía Ruiz",
      role: "Freelancer, Guadalajara",
      content: "Me encanta que me digan exactamente qué hacer. El entrenador grabado se siente como tener a alguien ahí.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonios" className="section-spacing bg-background">
      <div className="container-dale">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
            Historias reales
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            Ellos ya dijeron{" "}
            <span className="text-motivational">"Dale"</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Miles de personas como tú encontraron su ritmo. Hoy puede ser tu día.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-6">"{testimonial.content}"</p>

              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
