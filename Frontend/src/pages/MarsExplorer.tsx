import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useMarsSearch, useCreateFavorite, useMarsFavorites, useDeleteFavorite } from '../hooks/useMars';
import type { MarsPhoto } from '../types/mars';

const ROVERS = [
  { label: 'Perseverance', value: 'perseverance' },
  { label: 'Curiosity', value: 'curiosity' },
  { label: 'Opportunity', value: 'opportunity' },
  { label: 'Spirit', value: 'spirit' },
];

export default function MarsExplorer() {
  const [rover, setRover] = useState<string>('perseverance');
  const [date, setDate] = useState<Date | null>(null);
  const [searchParams, setSearchParams] = useState<{ date?: string; rover?: string } | null>(null);
  const [tab, setTab] = useState<'results' | 'favorites'>('results');

  const searchQuery = useMarsSearch(searchParams);
  const createFav = useCreateFavorite();
  const favoritesQuery = useMarsFavorites();
  const deleteFav = useDeleteFavorite();

  const handleSearch = () => {
    setSearchParams({ rover, date: date ? date.toISOString().slice(0, 10) : undefined });
  };

  return (
    <main className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mars Explorer</h1>
        <p className="text-sm text-slate-400">Busca fotos tomadas por los rovers de la NASA y guárdalas en favoritos.</p>
      </header>

      <section className="mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs text-slate-300 mb-1">Rover</label>
          <select
            value={rover}
            onChange={(e) => setRover(e.target.value)}
            className="rounded-md bg-slate-900 px-3 py-2"
          >
            {ROVERS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1">Fecha</label>
          <input
            type="date"
            value={date ? date.toISOString().slice(0, 10) : ''}
            onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
            className="rounded-md bg-slate-900 px-3 py-2"
          />
        </div>

        <div>
          <Button color="primary" onClick={handleSearch}>
            🚀 Buscar
          </Button>
        </div>
      </section>

      <div className="mb-4 flex gap-2">
        <Button variant={tab === 'results' ? 'solid' : 'ghost'} onClick={() => setTab('results')}>Resultados</Button>
        <Button variant={tab === 'results' ? 'ghost' : 'solid'} onClick={() => setTab('favorites')}>Favoritos</Button>
      </div>

      {tab === 'results' ? (
        searchQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 w-full animate-pulse rounded-md bg-slate-800" />
            ))}
          </div>
        ) : searchQuery.isError ? (
          <div className="text-rose-400">Error al buscar fotos.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {searchQuery.data?.photos?.length ? (
              searchQuery.data.photos.map((p: MarsPhoto) => (
                <Card key={p.id} className="overflow-hidden">
                  <img src={p.img_src} alt={`Mars ${p.id}`} className="h-48 w-full object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold">{p.rover.name} · {p.camera.full_name}</h3>
                    <p className="text-sm text-slate-400">{p.earth_date}</p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        color="primary"
                        onClick={() => createFav.mutate({
                          rover_name: p.rover.name,
                          camera_name: p.camera.name,
                          earth_date: p.earth_date,
                          sol: p.sol,
                          image_url: p.img_src,
                        })}
                      >
                        ❤️ Guardar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div>No hay fotos para los filtros seleccionados.</div>
            )}
          </div>
        )
      ) : (
        favoritesQuery.isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner /> Cargando favoritos...
          </div>
        ) : favoritesQuery.isError ? (
          <div className="text-rose-400">Error al cargar favoritos.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoritesQuery.data && favoritesQuery.data.length ? (
              favoritesQuery.data.map((f) => (
                <Card key={f.id} className="overflow-hidden">
                  <img src={f.image_url} alt={`fav-${f.id}`} className="h-48 w-full object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold">{f.rover_name} · {f.camera_name}</h3>
                    <p className="text-sm text-slate-400">{f.earth_date}</p>
                    <div className="mt-3 flex gap-2">
                      <Button color="danger" onClick={() => deleteFav.mutate(f.id)}>Eliminar</Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div>No tienes favoritos guardados.</div>
            )}
          </div>
        )
      )}
    </main>
  );
}
