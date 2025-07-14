import Link from "next/link";
import ContactForm from "./components/ContactForm";
import AlertesSection from "./components/AlertesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navigation */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-border">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <h1 className="text-2xl font-bold text-gradient">LDA</h1>
            </div>
                         <div className="hidden md:flex items-center space-x-8 font-extrabold">
               <Link href="#accueil" className="hover:text-red-500 transition-colors">Accueil</Link>
               <Link href="/alertes" className="hover:text-red-500 transition-colors">Alertes</Link>
               <Link href="#dons" className="hover:text-red-500 transition-colors">Dons</Link>
               <Link href="#contact" className="hover:text-red-500 transition-colors">Contact</Link>
             </div>
            <button className="btn-primary px-6 py-2 rounded-lg text-white font-semibold">
              Signaler une disparition
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="pt-24 pb-16 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Ligue des</span><br />
              <span className="text-white">Disparus Anonymes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Ensemble, nous retrouvons ceux qui ont disparu. Chaque personne compte, chaque histoire mérite d&apos;être entendue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-4 rounded-lg text-white font-semibold text-lg animate-pulse-red">
                Signaler une disparition
              </button>
              <button className="btn-outline px-8 py-4 rounded-lg text-red-500 font-semibold text-lg">
                Faire un don
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="statistiques" className="py-16 px-6 bg-dark">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">Nos Résultats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Statistique principale */}
            <div className="col-span-1 md:col-span-2">
              <div className="card-hover bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-6xl font-bold text-gradient mb-2">200+</h3>
                    <p className="text-2xl text-gray-300">Personnes retrouvées</p>
                    <p className="text-gray-400 mt-2">Depuis la création de la LDA, aidez nous à continuer.</p>
                  </div>
                  <div className="w-32 h-32 bg-red-600/20 rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-3xl">👥</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="space-y-6">
              <div className="card-hover bg-card p-6 rounded-2xl border border-border">
                <h4 className="text-3xl font-bold text-red-500 mb-2">75%</h4>
                <p className="text-gray-300">Taux de réussite</p>
              </div>
            </div>
          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <h4 className="text-3xl font-bold text-white mb-2">50+</h4>
              <p className="text-gray-400">Bénévoles actifs</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-bold text-white mb-2">200+</h4>
              <p className="text-gray-400">Familles aidées</p>
            </div>

            <div className="text-center">
              <h4 className="text-3xl font-bold text-white mb-2">15+</h4>
              <p className="text-gray-400">Villes couvertes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alertes Disparitions Section */}
      <AlertesSection />

      {/* Section Dons */}
      <section id="dons" className="py-16 px-6 bg-dark">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Soutenez Notre Mission</h2>
            <p className="text-xl text-gray-300">Votre aide nous permet de sauver des vies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Pourquoi nous soutenir ?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-300">Financement des recherches actives</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-300">Formation de nos bénévoles</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-300">Soutien psychologique aux familles</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-300">Technologies de pointe pour les recherches</p>
                </div>
              </div>
            </div>

            <div className="card-hover bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Faire un don</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <button className="btn-outline py-3 rounded-lg text-red-500 font-semibold">20€</button>
                  <button className="btn-outline py-3 rounded-lg text-red-500 font-semibold">50€</button>
                  <button className="btn-outline py-3 rounded-lg text-red-500 font-semibold">100€</button>
                </div>
                <input 
                  type="number" 
                  placeholder="Montant personnalisé" 
                  className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400"
                />
                <button className="btn-primary w-full py-4 rounded-lg text-white font-semibold text-lg">
                  Faire un don maintenant
                </button>
                <p className="text-center text-gray-400 text-sm">
                  Paiement sécurisé
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Contactez-Nous</h2>
            <p className="text-xl text-gray-300">Une urgence ? Besoin d&apos;aide ? Nous sommes là</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Informations de contact</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Urgence 24/7</h4>
                    <p className="text-gray-300">0800 123 456</p>
                    <p className="text-gray-400 text-sm">Gratuit depuis la France</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Email</h4>
                    <p className="text-gray-300">contact@lda-france.org</p>
                    <p className="text-gray-400 text-sm">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Adresse</h4>
                    <p className="text-gray-300">123 Rue de l&apos;Espoir<br />75001 Paris, France</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <h3 className="text-xl font-bold text-gradient">LDA</h3>
              </div>
              <p className="text-gray-400">
                Ligue des Disparus Anonymes - Ensemble pour retrouver ceux qui ont disparu.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Liens rapides</h4>
                             <ul className="space-y-2 text-gray-400">
                 <li><Link href="#accueil" className="hover:text-red-500 transition-colors">Accueil</Link></li>
                 <li><Link href="/alertes" className="hover:text-red-500 transition-colors">Alertes</Link></li>
                 <li><Link href="#dons" className="hover:text-red-500 transition-colors">Dons</Link></li>
               </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-red-500 transition-colors">Mentions légales</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Politique de confidentialité</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">CGU</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Cookies</Link></li>
              </ul>
            </div>


          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ligue des Disparus Anonymes. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
