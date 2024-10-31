'use client'
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserProvider } from '../contexts/UserContext';
import { getToken } from '../actions/getToken';
import Link from 'next/link';
import Cadastro from './Cadastro';
import Input from './Input';
import AlertLogin from './AlertLogin';
import { baseURl } from '../../../baseUrl';

const Delivery = () => {
    const [user, setUser] = useState(null);
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

    async function getUser() {
        const token = await getToken();
        const response = await fetch('/api/infos', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            setName(user?.name);
            setWhatsapp(user?.whatsapp);
            setCep(user?.cep);
            setRua(user?.rua);
            setNumero(user?.numero);
            setBairro(user?.bairro);
            setCidade(user?.cidade);
            setComplemento(user?.complemento);
            setReferencia(user?.referencia);
        }
    }, [user]);

    // Função para buscar o endereço pelo CEP
    const buscarCep = async () => {
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                
                if (data.erro) {
                    toast.error("CEP não encontrado");
                    return;
                }

                // Atualizando os campos com as informações retornadas
                setRua(data.logradouro || "");
                setBairro(data.bairro || "");
                setCidade(data.localidade || "");
            } catch (error) {
                console.log("Erro ao buscar o CEP:", error);
                toast.error("Erro ao buscar o CEP");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "" || whatsapp.trim() === "" || cep.trim() === "" || rua.trim() === "" || bairro.trim() === "" || cidade.trim() === "") {
            toast.error("Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken()
            const response = await fetch(`${baseURl}/users`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, whatsapp, cep, rua, numero, bairro, cidade, complemento, referencia }),
            });

            const data = await response.json();

            if (data.error) {
                toast.error(data.error || "Erro ao entrar");
            } 
            if (response.status === 200) {
                toast.success("Dados atualizados");
                setTimeout(() => {
                    window.location.href = "/checkout";
                }, 500);
                return;
            }
            console.log(response)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 max-w-7xl mx-auto rounded-lg">
            <ToastContainer />
            <UserProvider>
                {user && user.id && 
                    <form className='w-full max-w-xl mx-auto'>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Dados de Entrega</h2>
                        <div className='flex flex-col'>
                            <Input label="Nome" id="name" value={name} setState={setName} />
                            <Input label="WhatsApp" id="whatsapp" value={whatsapp} setState={setWhatsapp} />
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                <Input 
                                    label="CEP" 
                                    id="cep" 
                                    value={cep} 
                                    setState={setCep} 
                                    onBlur={buscarCep} // Chama a função ao sair do campo CEP
                                />
                                <Input label="Rua" id="rua" value={rua} setState={setRua} />
                            </div>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                <Input label="Número" id="numero" value={numero} setState={setNumero} />
                                <Input label="Bairro" id="bairro" value={bairro} setState={setBairro} />
                            </div>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                <Input label="Cidade" id="cidade" value={cidade} setState={setCidade} />
                                <Input label="Complemento" id="complemento" value={complemento} setState={setComplemento} />
                            </div>
                            <Input label="Referência" id="referencia" value={referencia} setState={setReferencia} />
                        </div>
                        <div className=' flex justify-between'>
                            <Link href="/carrinho" className='border border-red-600 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white'>Voltar</Link>
                            <button className='bg-red-600 hover:bg-red-400 px-4 py-2 rounded-md text-white' onClick={handleSubmit} disabled={loading}>
                                {loading ? "Carregando..." : "Continuar"}
                            </button>
                        </div>
                    </form>
                }
                {user && user.error === "Token inválido." && <AlertLogin />}
            </UserProvider>
        </div>
    );
};

export default Delivery;
