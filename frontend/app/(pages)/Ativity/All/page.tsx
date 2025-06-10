import Header from "@/app/components/Header";
import AsideMenu from "@/app/components/AsideMenu";
import MainContent from "@/app/components/MainContent";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="flex pt-20 gap-4">
        <AsideMenu />

        <MainContent>
          <div className="space-y-6 text-gray-800">
            <h1 className="text-3xl font-bold text-gray-900">
              Todas as atividades
            </h1>

            <p className="text-lg leading-relaxed">
              Nossa plataforma foi criada para otimizar o gerenciamento de
              atividades de maneira prática e intuitiva. Aqui você pode
              registrar, visualizar e editar suas tarefas com poucos cliques,
              mantendo tudo sempre organizado.
            </p>

            <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Funcionalidades principais
              </h2>
              <ul className="space-y-3 text-base">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">✔</span>
                  <span>
                    <strong>Criação de atividades:</strong> registre tarefas com
                    título, descrição, data e status.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">✔</span>
                  <span>
                    <strong>Visualização organizada:</strong> acesse todas as
                    atividades em uma interface clara e agrupada.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">✔</span>
                  <span>
                    <strong>Edição rápida:</strong> atualize facilmente qualquer
                    atividade para manter os dados atualizados.
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-base text-gray-700">
              Use o menu lateral para acessar suas atividades, ver o histórico
              completo ou gerenciar seu perfil pessoal.
            </p>
          </div>
        </MainContent>
      </main>
    </div>
  );
}
