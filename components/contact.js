export default function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-bold mb-8">Hubungi Kami</h2>
        <form className="bg-white p-8 rounded-xl shadow-lg space-y-6">
          <input type="text" placeholder="Nama Anda" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <input type="email" placeholder="Email Anda" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <textarea placeholder="Pesan Anda" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
          <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition w-full">Kirim Pesan</button>
        </form>
        <div className="mt-12">
          <iframe className="w-full h-64 rounded-xl shadow-lg" src="https://maps.google.com/maps?q=Jakarta&t=&z=13&ie=UTF8&iwloc=&output=embed" allowFullScreen></iframe>
        </div>
      </div>
    </section>
  );
}