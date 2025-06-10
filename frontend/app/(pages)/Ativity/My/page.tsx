import Header from "@/app/components/Header";
import AsideMenu from "@/app/components/AsideMenu";
import MainContent from "@/app/components/MainContent";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="flex pt-20 gap-4">
        <AsideMenu />

        <MainContent>
          <div className="space-y-6 text-gray-800">
            <h1 className="text-2xl font-bold">Minhas atividades</h1>
          </div>
        </MainContent>
      </main>
    </div>
  );
}
