import Header from "@/app/components/Header";
import AsideMenu from "@/app/components/AsideMenu";
import MainContent from "@/app/components/MainContent";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      
      <Header />

      <main className="flex pt-20 flex gap-4"> 
        
        <AsideMenu />

<MainContent>
  <div className="space-y-6 text-gray-800">
    <h1 className="text-3xl font-bold text-gray-900">
      Minhas atividades
    </h1>

    
  </div>
</MainContent>


      </main>
    </div>
  );
}