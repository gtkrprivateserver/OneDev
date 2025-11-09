import { motion } from "framer-motion";

export default function Portfolio() {
  const projects = ["/project1.jpg", "/project2.jpg", "/project3.jpg"];
  return (
    <section id="portfolio" className="py-20 text-center">
      <h2 className="text-4xl font-bold mb-12">Proyek Kami</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((src, i) => (
          <motion.img key={i} src={src} alt={`Project ${i+1}`} className="rounded-xl shadow-lg hover:scale-105 transition"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          />
        ))}
      </div>
    </section>
  );
}