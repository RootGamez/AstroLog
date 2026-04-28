import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Starfield } from '../../components/layout/Starfield';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await register({ full_name: fullName, email, password });
      navigate('/home', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'No se pudo crear la cuenta.');
      } else {
        setError('No se pudo crear la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_80%_0%,#0e7490_0%,transparent_30%),radial-gradient(circle_at_10%_80%,#1e3a8a_0%,transparent_35%),#020617] px-4 py-8 text-slate-100">
      <Starfield density={150} />

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <Card className="w-full border-cyan-300/30 bg-slate-950/70 p-6 backdrop-blur-md md:p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-cyan-200">Nuevo acceso</p>
          <h1 className="text-3xl font-bold text-white">Crear cuenta</h1>
          <p className="mt-2 text-sm text-slate-300">Registra tu usuario para entrar al panel y gestionar contenido.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Nombre"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirmar contrasena"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error ? <p className="rounded-md border border-rose-400/50 bg-rose-900/30 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

            <Button type="submit" color="primary" className="w-full" loading={loading}>
              Crear cuenta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Iniciar sesion
            </Link>
          </p>
        </Card>
      </section>
    </main>
  );
}
