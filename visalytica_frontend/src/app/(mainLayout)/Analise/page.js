'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import ImagemTempoReal from '../../../components/ImagemTempoReal'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import CardInputs from '../../../components/CardInputs'
import SimpleQRReader from '../../../components/qr/SimpleQRReader'
import Link from 'next/link'
import { api } from '../../../services/api'

const dataAtual = new Date();

export default function Analise() {
    const [formData, setFormData] = useState({
        cpf: '',
        nomePaciente: '',
        dataNascimento: '',
        nomePeca: '',
        dimensoes: {
            largura_cm: 0,
            comprimento_cm: 0,
            altura_cm: 0
        },
        diagnostico: '',
        imagens: {
            captura1: "",
            captura2: ""
        },
        inicio_analise: dataAtual.toISOString()
    })

    const [showQRReader, setShowQRReader] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [videoDevices, setVideoDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    const buscaPaciente = async (cpf) => {
        let data;
        try {
            data = await api.get(`/pacientes/${cpf}`);
        } catch (e) {
            return false
        }
        if (data) {
            return data.data
        }
    }

    useEffect(() => {
        async function getDevices() {
            try {

                await navigator.mediaDevices.getUserMedia({ video: true });

                const devicesList = await navigator.mediaDevices.enumerateDevices();
                const videoDevicesList = devicesList.filter(device => device.kind === 'videoinput');
                setVideoDevices(videoDevicesList);

                // seleciona automaticamente a DV20 USB CAMERA se existir (TEMOS QUE MUDAR DEPOIS PARA USAR A CAMERA DE CIMA)
                const dv20 = videoDevicesList.find(d => d.label.includes('DV20 USB CAMERA'));
                if (dv20) {
                    setSelectedDeviceId(dv20.deviceId);
                } else if (videoDevicesList.length > 0) {
                    setSelectedDeviceId(videoDevicesList[0].deviceId);
                }
            } catch (error) {
                console.warn('Erro ao acessar dispositivos de mídia:', error);
            }
        }
        getDevices();
    }, []);

    const handleInputChange = useCallback((field) => async (e) => {
        let value = e.target.value;

        // validação específica para cpf - apenas números
        if (field === 'cpf') {
            value = value.replace(/\D/g, '');
            value = value.substring(0, 11);
            if (value.length == 11) {
                const paciente = await buscaPaciente(value)
                if (paciente) {
                    setFormData(prev => ({
                        ...prev,
                        nomePaciente: paciente.paciente.nome,
                        dataNascimento: paciente.paciente.dataNascimento
                    }))
                    console.log(paciente.paciente.nome);
                }
            }
            if (value.length > 3) value = value.slice(0, 3) + '.' + value.slice(3);
            if (value.length > 7) value = value.slice(0, 7) + '.' + value.slice(7);
            if (value.length > 11) value = value.slice(0, 11) + '-' + value.slice(11);
        }

        // validação para data de nascimento
        if (field === 'dataNascimento' && value) {
            const hoje = new Date();
            const dataNascimento = new Date(value);
            if (dataNascimento > hoje) {
                return;
            }
        }

        if (field == 'dimensoes') {
            value = medidas
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }, [])

    const handleQRScan = useCallback(() => {
        // parar captura das outras cameras
        if (webcamRef1.current?.srcObject) {
            webcamRef1.current.srcObject.getTracks().forEach(track => track.stop());
        }
        if (webcamRef2.current?.srcObject) {
            webcamRef2.current.srcObject.getTracks().forEach(track => track.stop());
        }

        setShowQRReader(true);
    }, []);

    const handleScanSuccess = useCallback((scannedData) => {
        try {
            setFormData(prev => ({
                ...prev,
                cpf: scannedData.cpf || '',
                nomePaciente: scannedData.nomePaciente || '',
                dataNascimento: scannedData.dataNascimento || '',
                nomePeca: scannedData.nomePeca || ''
            }))
            setShowQRReader(false)
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)
            console.log('QR Code lido com sucesso!', scannedData)
        } catch (error) {
            console.error('Erro ao processar dados do QR Code:', error)
            setShowQRReader(false)
        }
    }, [])


    // validação do formulário
    const isFormValid = useMemo(() => {
        const dimensoesValidas = (
            formData.dimensoes &&
            (
                typeof formData.dimensoes === "object"
                    ? formData.dimensoes.largura_cm > 0 &&
                    formData.dimensoes.comprimento_cm > 0 &&
                    formData.dimensoes.altura_cm > 0
                    : !formData.dimensoes.toLowerCase().includes("medidas não encontradas")
            )
        );

        return (
            formData.cpf.length >= 14 &&
            formData.nomePaciente.trim() &&
            formData.dataNascimento &&
            formData.nomePeca.trim() &&
            dimensoesValidas &&
            formData.diagnostico.trim() &&
            formData.imagens.captura1 != ""

        );
    }, [formData]);

    const [selectedDevice1, setSelectedDevice1] = useState(null);
    const [selectedDevice2, setSelectedDevice2] = useState(null);


    const handleCloseQRReader = useCallback(() => {
        setShowQRReader(false);

        // reativar cameras depois que fechar o leitor
        setTimeout(async () => {
            try {
                if (selectedDevice1?.id) {
                    const stream1 = await navigator.mediaDevices.getUserMedia({
                        video: { deviceId: { exact: selectedDevice1.id } }
                    });
                    if (webcamRef1.current) webcamRef1.current.srcObject = stream1;
                }

                if (selectedDevice2?.id) {
                    const stream2 = await navigator.mediaDevices.getUserMedia({
                        video: { deviceId: { exact: selectedDevice2.id } }
                    });
                    if (webcamRef2.current) webcamRef2.current.srcObject = stream2;
                }
            } catch (err) {
                console.error("Erro ao reativar cameras:", err);
            }
        }, 300); // pequeno delay pro QR Reader liberar a câmera
    }, [selectedDevice1, selectedDevice2]);

    const webcamRef1 = useRef(null);
    const webcamRef2 = useRef(null);

    const [webCamFrame1, setWebCamFrame] = useState("");
    const [webCamFrame2, setWebCamFrame2] = useState("");

    const [capturaImagens, setCapturaImagens] = useState({
        captura1: "",
        captura2: ""
    })

    const [medidas, setMedidas] = useState({
        largura_cm: 0,
        comprimento_cm: 0,
        altura_cm: 0
    })

    const [devices, setDevices] = useState([]);

    const [cameras, setCameras] = useState([0, 1]);

    const [status, setStatus] = useState(false)

    useEffect(() => {
        // Lista as câmeras disponíveis
        navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
            const videoDevices = deviceInfos.filter((device) => device.kind === "videoinput");
            setDevices(videoDevices);

            if (videoDevices.length > 0) {
                setSelectedDevice1({ posicao: "baixo", id: videoDevices[cameras[1]].deviceId });
                setSelectedDevice2({ posicao: "cima", id: videoDevices[cameras[0]].deviceId });
            }
        });
    }, [cameras]);

    useEffect(() => {
        medidas.comprimento_cm != 0 ? formData.dimensoes = medidas : ``;
        // console.log(formData);
    })

    return (
        <>
            <div className='flex flex-col lg:flex-row min-h-[calc(100vh-120px)] xs:min-h-[calc(100vh-125px)] sm:min-h-[calc(100vh-135px)] md:min-h-[calc(100vh-145px)] lg:min-h-[calc(100vh-151px)] mx-2 xs:mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 gap-3 xs:gap-4 sm:gap-5 md:gap-6 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8'>
                <div className='flex flex-col h-full gap-3 xs:gap-4 sm:gap-5 lg:w-2/3 xl:w-3/5'>
                    <ImagemTempoReal
                        label={'Altura'}
                        selectedDevice={selectedDevice1}
                        refVideo={!showQRReader ? webcamRef1 : null}
                        frameCaptura={setWebCamFrame}
                        status={status}
                        medidas={medidas}
                        qr={!showQRReader}
                    />

                    <ImagemTempoReal
                        label={'Comprimento e Largura'}
                        selectedDevice={selectedDevice2}
                        refVideo={webcamRef2}
                        frameCaptura={setWebCamFrame2}
                        status={status}
                        medidas={medidas}
                        qr={!showQRReader}
                    />
                </div>
                <div className='flex flex-col gap-6 w-full lg:w-1/2 max-lg:pb-5'>
                    <div className='overflow-y-auto'>


                        <CardInputs className='h-full w-full flex flex-col justify-between bg-cinza_claro rounded-2xl p-4 sm:p-6 border border-cinza '>
                            <Input
                                label={'CPF*'}
                                placeHolder={'000.000.000-00'}
                                value={formData.cpf}
                                onChange={handleInputChange('cpf')}
                                aria-label="CPF do paciente"
                                aria-required="true"
                            />
                            <Input
                                label={'Nome do paciente*'}
                                placeHolder={'Nome e sobrenome'}
                                value={formData.nomePaciente}
                                onChange={handleInputChange('nomePaciente')}
                                aria-label="Nome completo do paciente"
                                aria-required="true"
                            />
                            <Input
                                label={'Data de nascimento*'}
                                placeHolder={'00/00/0000'}
                                type='date'
                                value={formData.dataNascimento}
                                onChange={handleInputChange('dataNascimento')}
                                max={new Date().toISOString().split('T')[0]}
                                aria-label="Data de nascimento do paciente"
                                aria-required="true"
                                className={'w-full'}
                            />
                            <Input
                                label={'Nome da peça*'}
                                placeHolder={'Pulmão'}
                                value={formData.nomePeca}
                                onChange={handleInputChange('nomePeca')}
                                aria-label="Nome da peça anatômica"
                                aria-required="true"
                            />
                            <Input
                                label={'Comprimento x Largura x Altura*'}
                                placeHolder={'3,5 x 2,0 x 1,2 cm'}
                                // value={formData.dimensoes}
                                onChange={handleInputChange('dimensoes')}
                                aria-label="Dimensões da peça"
                                aria-required="true"
                                value={formData.dimensoes.largura_cm != 0 ? `${formData.dimensoes.comprimento_cm} x ${formData.dimensoes.largura_cm} x ${formData.dimensoes.altura_cm}` : "Medidas não encontradas"}
                            />
                            <Input
                                label={'Possível diagnóstico*'}
                                placeHolder={'Carcinoma de pulmão'}
                                value={formData.diagnostico}
                                onChange={handleInputChange('diagnostico')}
                                aria-label="Diagnóstico preliminar"
                                aria-required="true"
                            />
                        </CardInputs>
                    </div>

                    {/* Container dos botões */}
                    <div className='space-y-2 xs:space-y-3'>
                        {/* Primeira linha: Cancelar, QR Code e Continuar */}
                        <div className='flex flex-row gap-2 xs:gap-3'>
                            <Link href='/Home' className='flex-1'>
                                <Button classes={'text-white p-2 xs:p-3 sm:p-4 py-2 xs:py-3 sm:py-4 bg-gray-400 px-3 xs:px-4 sm:px-6 hover:bg-gray-600 w-full rounded-lg xs:rounded-xl transition-all duration-200 text-sm xs:text-base'}>
                                    Cancelar
                                </Button>
                            </Link>

                            <Button
                                classes={'p-2 xs:p-3 sm:p-4 py-2 xs:py-3 sm:py-4 px-2 xs:px-3 sm:px-4 bg-gradient-to-r from-azul to-azul_escuro hover:opacity-90 flex items-center justify-center relative group min-w-[44px] xs:min-w-[50px] sm:min-w-[56px] rounded-lg xs:rounded-xl transition-all duration-200'}
                                onClick={handleQRScan}
                                title="Ler QR Code"
                                aria-label="Abrir leitor de QR Code"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="xs:w-5 xs:h-5 sm:w-[22px] sm:h-[22px]">
                                    <path d="M0 9.375H9.375V0H0V9.375ZM3.125 3.125H6.25V6.25H3.125V3.125ZM12.5 0V9.375H21.875V0H12.5ZM18.75 6.25H15.625V3.125H18.75V6.25ZM0 21.875H9.375V12.5H0V21.875ZM3.125 15.625H6.25V18.75H3.125V15.625ZM20.3125 12.5H21.875V18.75H17.1875V17.1875H15.625V21.875H12.5V12.5H17.1875V14.0625H20.3125V12.5ZM20.3125 20.3125H21.875V21.875H20.3125V20.3125ZM17.1875 20.3125H18.75V21.875H17.1875V20.3125Z" fill="white" />
                                </svg>
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Ler QR Code
                                </div>
                            </Button>

                            <Link
                                href={{
                                    pathname: '/GeraPDF',
                                    query: {
                                        cpf: formData.cpf,
                                        nomePaciente: formData.nomePaciente,
                                        dataNascimento: formData.dataNascimento,
                                        nomePeca: formData.nomePeca,
                                        comprimento: formData.dimensoes.comprimento_cm,
                                        largura: formData.dimensoes.largura_cm,
                                        altura: formData.dimensoes.altura_cm,
                                        diagnostico: formData.diagnostico,
                                        observacoes: formData.observacoes,
                                        inicio_analise: formData.inicio_analise
                                    }
                                }}
                                className={`flex-1 ${!isFormValid ? 'pointer-events-none' : ''}`}
                                aria-label="Continuar para geração do PDF"
                                onClick={() => {
                                    localStorage.setItem("ImagemCapturada1", formData.imagens.captura1)
                                    localStorage.setItem("ImagemCapturada2", formData.imagens.captura2)
                                }}
                            >
                                <Button
                                    classes={`text-white p-2 xs:p-3 sm:p-4 py-2 xs:py-3 sm:py-4 px-3 xs:px-4 sm:px-6 w-full rounded-lg xs:rounded-xl transition-all duration-200 text-sm xs:text-base ${isFormValid
                                        ? 'bg-gradient-to-r from-azul to-azul_escuro hover:opacity-90 '
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    disabled={!isFormValid}
                                >
                                    Continuar
                                </Button>
                            </Link>
                        </div>

                        {/* Segunda linha: Capturar imagem */}
                        <div className='w-full'>
                            <Button
                                classes={'text-white p-4 py-4 px-6 bg-gradient-to-r from-azul to-azul_escuro hover:opacity-90 w-full rounded-xl transition-all duration-200'}
                                onClick={() => {
                                    if (!status) {
                                        setStatus(!status)
                                        setCapturaImagens({
                                            captura1: webCamFrame1,
                                            captura2: webCamFrame2,
                                        })
                                        setFormData(prev => ({
                                            ...prev,
                                            imagens: {
                                                captura1: webCamFrame1,
                                                captura2: webCamFrame2,
                                            }
                                        }))
                                    } else {
                                        setStatus(!status)
                                        setCapturaImagens({
                                            captura1: "",
                                            captura2: "",
                                        })
                                        setFormData(prev => ({
                                            ...prev,
                                            imagens: {
                                                captura1: "",
                                                captura2: "",
                                            }
                                        }))
                                    }
                                }}
                                aria-label="Capturar imagem"
                            >
                                {status ? "Desfazer captura" : "Capturar imagem"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Leitura QR Code */}
            {showQRReader && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-azul"
                            onClick={handleCloseQRReader}
                            aria-label="Fechar leitor de QR Code"
                        >
                            ✕
                        </button>

                        {videoDevices.length > 0 && (
                            <>
                                <label htmlFor="camera-select" className="mb-2 font-semibold">
                                    Selecione a câmera:
                                </label>
                                <select
                                    id="camera-select"
                                    className="mb-4 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-azul"
                                    value={selectedDeviceId}
                                    onChange={e => setSelectedDeviceId(e.target.value)}
                                    aria-label="Selecionar dispositivo de câmera"
                                >
                                    {videoDevices.map(device => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Câmera ${device.deviceId.slice(0, 8)}`}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        {selectedDeviceId ? (
                            <SimpleQRReader
                                key={selectedDeviceId}
                                constraints={{
                                    facingMode: 'environment',
                                    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : true
                                }}
                                onRead={(value) => {
                                    let scannedData = {};
                                    try {
                                        scannedData = JSON.parse(value);
                                    } catch {
                                        scannedData = { cpf: value };
                                    }
                                    handleScanSuccess(scannedData);
                                }}
                                onClose={handleCloseQRReader}
                            />
                        ) : (
                            <div className="text-center p-4">
                                <p className="text-gray-600 mb-2">Nenhuma câmera detectada</p>
                                <p className="text-sm text-gray-500">Verifique se a câmera está conectada e as permissões estão habilitadas</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div
                    className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Dados carregados via QR Code!</span>
                    </div>
                </div>
            )}
        </>
    )
}