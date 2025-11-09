import { motion } from "framer-motion";

export default function Services() {
  const services = [
    { title: "Desain Grafis", desc: "Membuat desain visual yang menarik untuk brand Anda." },
    { title: "Pengembangan Web", desc: "Website profesional, cepat, dan responsif." },
    { title: "Pemasaran Digital", desc: "Meningkatkan visibilitas bisnis melalui marketing digital." },
  ];

  return (
    <section id="services" className="py-20 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold mb-12">Layanan Kami</h2>
      <div className="grid md:grid-cols-3 gap-10">
        {services.map((s, i) => (
          <motion.div key={i} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}