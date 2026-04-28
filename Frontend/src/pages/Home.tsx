import { Button } from '../components/ui/Button';
import { Starfield } from '../components/layout/Starfield';

interface HomeProps {
  onSelectFeature: (feature: 'astrolog') => void;
}

const availableModules = [
  {
    id: 'astrolog',
    title: 'Bitacora con APOD',
    description: 'Registra recuerdos personales y conectalos con la imagen astronomica del dia de la NASA.',
    cta: 'Abrir modulo',
    enabled: true,
  },
  {
    id: 'birth-date-insights',
    title: 'Eventos por fecha de cumpleanos',
    description: 'Pronto podras explorar efemerides y eventos estelares por fechas importantes.',
    cta: 'Proximamente',
    enabled: false,
  },
  {
    id: 'missions-timeline',
    title: 'Linea de tiempo espacial',
    description: 'Un panel para navegar hitos de misiones y descubrimientos en una vista interactiva.',
    cta: 'Proximamente',
    enabled: false,
  },
] as const;

export default function Home({ onSelectFeature }: HomeProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#1f3b7a_0%,transparent_35%),radial-gradient(circle_at_85%_10%,#1d4ed8_0%,transparent_25%),radial-gradient(circle_at_50%_90%,#0f172a_0%,#020617_60%)] text-slate-100">
      <Starfield density={180} />
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 md:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <p className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-100">
            A S T R O L O G
          </p>
          <p className="text-xs text-slate-300 md:text-sm">Centro de experiencias estelares</p>
        </header>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-cyan-200/90">Tu portal astronomico personal</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Explora el cielo y decide
              <span className="block text-cyan-300">que experiencia quieres vivir hoy</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              Esta landing esta preparada para crecer en multiples modulos. Hoy tienes activa la bitacora APOD y,
              en las proximas iteraciones, podras activar nuevos tableros estelares sin redisenar la base.
            </p>
          </div>

          <aside className="rounded-2xl border border-cyan-300/30 bg-slate-950/55 p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-cyan-100">Estado de la plataforma</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Modulo APOD activo para registrar eventos personales
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                Nuevas funcionalidades en cola de desarrollo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                Arquitectura lista para multiples endpoints
              </li>
            </ul>
          </aside>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {availableModules.map((module) => (
            <article
              key={module.id}
              className="group rounded-2xl border border-slate-700/60 bg-slate-950/60 p-6 shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-300/70"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    module.enabled
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-300/40'
                      : 'bg-slate-700/60 text-slate-300 border border-slate-500/50'
                  }`}
                >
                  {module.enabled ? 'Disponible' : 'En roadmap'}
                </span>
              </div>
              <p className="min-h-20 text-sm leading-relaxed text-slate-300">{module.description}</p>
              <Button
                className="mt-5 w-full"
                variant={module.enabled ? 'solid' : 'outline'}
                color={module.enabled ? 'primary' : 'default'}
                disabled={!module.enabled}
                onClick={() => {
                  if (module.enabled && module.id === 'astrolog') {
                    onSelectFeature('astrolog');
                  }
                }}
              >
                {module.cta}
              </Button>
            </article>
          ))}
        </section>

        <footer className="mt-auto pt-10 text-center text-xs text-slate-400 md:text-sm">
          Astronomical Experience Hub · Diseñado para escalar a nuevas misiones de producto.
        </footer>
      </section>
    </main>
  );
}
