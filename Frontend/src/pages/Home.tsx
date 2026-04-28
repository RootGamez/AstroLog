import { Button } from '../components/ui/Button';

export default function Home({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-900 to-black relative overflow-hidden">
      {/* Fondo de estrellas animadas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full">
          {[...Array(120)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1920}
              cy={Math.random() * 1080}
              r={Math.random() * 1.2 + 0.3}
              fill="white"
              opacity={Math.random() * 0.7 + 0.2}
            />
          ))}
        </svg>
      </div>
      <div className="z-10 text-center px-6 py-10 rounded-xl bg-black/60 shadow-2xl border border-indigo-700">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">Astrolog</h1>
        <h2 className="text-xl md:text-2xl text-indigo-200 mb-6 font-medium">Tu Bitácora Estelar</h2>
        <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
          Guarda tus momentos más importantes y asócialos con una imagen astronómica única del día.<br />
          ¡Explora el universo de tus recuerdos!
        </p>
        <Button color="primary" size="lg" className="px-8 py-3 text-lg font-bold shadow-lg" onClick={onEnter}>
          Entrar a mi Galería
        </Button>
      </div>
    </div>
  );
}
