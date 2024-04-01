import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function MarketingLayout({children}:{children:React.ReactNode}){
  return (<div className="bg-slate-100 h-full">
      <Navbar/>
    <main className="pt-40 pb-20 bg-slate-100">
      {children}
    </main>
    <footer>
      <Footer/>
    </footer>
  </div>)
}