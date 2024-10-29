'use client'
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function Page403() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold mb-2">403 - Acesso Negado</h1>
      <p className="text-lg mb-6 text-center">
        Você não tem permissão para acessar esta página.
      </p>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
}
