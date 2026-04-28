import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Starfield } from '../../components/layout/Starfield';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/home', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'No se pudo iniciar sesion.');
      } else {
        setError('No se pudo iniciar sesion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#1f3b7a_0%,transparent_35%),radial-gradient(circle_at_85%_10%,#1d4ed8_0%,transparent_25%),radial-gradient(circle_at_50%_90%,#0f172a_0%,#020617_60%)] px-4 py-8 text-slate-100">
      <Starfield density={160} />

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <Card className="w-full border-cyan-300/30 bg-slate-950/70 p-6 backdrop-blur-md md:p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-cyan-200">Bienvenido a Astrolog</p>
          <h1 className="text-3xl font-bold text-white">Iniciar sesion</h1>
          <p className="mt-2 text-sm text-slate-300">Accede para crear, editar y eliminar tus registros estelares.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Correo"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Contrasena"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error ? <p className="rounded-md border border-rose-400/50 bg-rose-900/30 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

            <Button type="submit" color="primary" className="w-full" loading={loading}>
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Crear cuenta
            </Link>
          </p>
        </Card>
      </section>
    </main>
  );
}
