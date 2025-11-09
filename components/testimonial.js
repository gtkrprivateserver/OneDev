import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    { text: "Pelayanan luar biasa! Website kami terlihat profesional.", name: "Andi, CEO Startup" },
    { text: "Desain grafis sangat kreatif dan branding kami lebih menonjol.", name: "Siti, Marketing Manager" },
    { text: "Tim profesional dan responsif. Sangat direkomendasikan.", name: "Budi, Founder" },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold mb-12">Apa Kata Klien Kami</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <motion.div key={i} className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <p>"{r.text}"</p>
            <h5 className="mt-4 font-bold">- {r.name}</h5>
          </motion.div>
        ))}
      </div>
    </section>
  );
}