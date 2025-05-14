import Header from "./components/header"
import Footer from "./components/footer"
import EmailCollection from "./components/email-collection"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <EmailCollection />
      </main>
      <Footer />
    </div>
  )
}
