'use client'
import React, { useEffect, useState } from 'react';
import { getToken } from '../actions/getToken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartProvider } from '../contexts/CartContext';
import Input from './Input';
import Header from './Header';
import SkeletonDados from './SkeletonDados';
import { baseURl } from '../../../baseUrl';

const Dados = () => {
    const [user, setUser] = useState("");
    const [name, setName] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [complemento, setComplemento] = useState("");
    const [referencia, setReferencia] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter()
 


    async function getUser() {
     try {
        const token = await getToken();
        setLoading(true)
        const response = await fetch('/api/infos', {
            next: { revalidate: 0 },
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

   
        if(response.status===400){
            router.push('/auth/entrar')
        }

        const data = await response.json();
        setUser(data);
     } catch (error) {
        console.log(error)
     }finally{
        setLoading(false)
     }
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        setName(user.name);
        setWhatsapp(user.whatsapp);
        setCep(user.cep);
        setRua(user.rua);
        setNumero(user.numero);
        setBairro(user.bairro);
        setCidade(user.cidade);
        setComplemento(user.complemento);
        setReferencia(user.referencia);
    }, [user]);

    // Efeito para buscar o endereço quando o CEP mudar
    useEffect(() => {
        if (cep && cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        setRua(data.logradouro);
                        setBairro(data.bairro);
                        setCidade(data.localidade);
                    } else {
                        toast.error('CEP não encontrado');
                    }
                })
                .catch(error => {
                    console.log('Erro ao buscar o CEP:', error);
                    toast.error('Erro ao buscar o CEP');
                });
        }
    }, [cep]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "" || whatsapp.trim() === "") {
            toast.error("Preencha todos os campos");
            return;
        }

        try {
            setLoading(true);
            const token =await getToken()
            const response = await fetch(`${baseURl}/users`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, whatsapp, cep, rua, numero, bairro, cidade, complemento, referencia }),
            });

            if(response.status===200){
                toast.success("Dados atualizados com sucesso!")
            }

            const data = await response.json();

            if (data.error) {
                toast.error(data.error || "Erro ao atualizar os dados");
            }
           
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <CartProvider>
            <div className='rounded-lg p-6 flex flex-col items-center'>
              <ToastContainer />
              <h1 className='text-2xl font-bold text-center mb-6'>Atualizar Dados</h1>
              <form className='w-full max-w-lg' onSubmit={handleSubmit}>
                  <Input label="Nome Completo" id="name" value={name} setState={setName} className="bg-white"/>
                  <div className='flex flex-col lg:flex-row gap-2'>
                      <Input label="Email" id="email" value={user.email} setState={setWhatsapp} className="bg-gray-100 disabled:cursor-not-allowed" disabled/>
                      <Input label="WhatsApp" id="whatsapp" value={whatsapp} setState={setWhatsapp} className="bg-white"/>
                  </div>
                  <div className='flex flex-col lg:flex-row gap-2'>
                      <Input label="Cep" id="cep" value={cep} setState={setCep} className="bg-white"/>
                      <Input label="Rua" id="rua" value={rua} setState={setRua} className="bg-white"/>
                  </div>
                  <div className='flex flex-col lg:flex-row gap-2'>
                      <Input label="Número" id="numero" value={numero} setState={setNumero} className="bg-white"/>
                      <Input label="Bairro" id="bairro" value={bairro} setState={setBairro} className="bg-white"/>
                  </div>
                  <div className='flex flex-col lg:flex-row gap-2'>
                      <Input label="Cidade" id="cidade" value={cidade} setState={setCidade} className="bg-white"/>
                      <Input label="Complemento" id="complemento" value={complemento} setState={setComplemento} className="bg-white"/>
                  </div>
                  <Input label="Referência" id="referencia" value={referencia} setState={setReferencia} className="bg-white"/>
                  <div className='mt-4 flex items-center justify-between'>
                      <Link href="/cardapio" className='text-red-600 hover:text-red-500'>Voltar</Link>
                      <button type="submit" className='bg-red-600 hover:bg-red-400 px-6 py-3 rounded-md text-white transition duration-200' disabled={loading}>
                          {loading ? "Carregando..." : "Salvar"}
                      </button>
                  </div>
              </form>
          </div>
          </CartProvider> 
        </>
    );
};

export default Dados;
