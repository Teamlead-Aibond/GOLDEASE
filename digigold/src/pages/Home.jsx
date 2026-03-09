import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import GoldPriceSection from '../components/GoldPriceSection'
import HowItWorks from '../components/HowItWorks'
import InvestmentShowcase from '../components/InvestmentShowcase'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import DownloadApp from '../components/DownloadApp'
import Footer from '../components/Footer'
import WhatsAppWidget from '../components/WhatsAppWidget'

export default function Home() {
  return (
    <div className="bg-white text-[#1a1a1a] min-h-screen">
      <Navbar />
      <div className="pt-16">
        <HeroSection />
        <GoldPriceSection />
        <HowItWorks />
        <InvestmentShowcase />
        <Features />
        <Testimonials />
        <FAQ />
        <DownloadApp />
        <Footer />
      </div>
      <WhatsAppWidget />
    </div>
  )
}
