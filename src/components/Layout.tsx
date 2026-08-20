import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md font-bold transition-all ${
      isActive
        ? "bg-bloodRed text-offWhite shadow-glow-red"
        : "text-offWhite/70 hover:text-offWhite hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 md:px-12 relative z-10">
      <header className="flex justify-between items-center bg-offBlack/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm mb-8 shadow-glow">
        <h1 className="font-title text-3xl tracking-wider text-offWhite">
          Logística <span className="text-bloodRed">Pro</span>
        </h1>
        <nav className="flex gap-4">
          <NavLink to="/finish" className={navClass}>
            Finalizar Pedido
          </NavLink>
          <NavLink to="/assign" className={navClass}>
            Atribuir Separador
          </NavLink>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
