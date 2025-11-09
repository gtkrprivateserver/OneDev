import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      <video autoPlay muted loop className="absolute w-full h-full object-cover">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute w-full h-full bg-black/50 flex items-center justify-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6 px-6"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold">Solusi Kreatif & Profesional</h1>
          <p className="text-xl md:text-2xl">OneDev Official.</p>
          <a href="#contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            Hubungi Kami
          </a>
        </motion.div>
      </div>
    </section>
  );
}