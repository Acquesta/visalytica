import Button from "./Button";
import IconSeta from "./IconSeta";

export default function BotoesPaginacao({meta, page, setPage}) {
    return (
        <div className="flex items-center justify-end gap-3 xs:gap-4 sm:gap-5 py-3 xs:py-4">

            {
                meta?.currentPage && page - 1 != 0 ? (
                    <>
                        <IconSeta cor="#CFCFCF" classe="cursor-pointer" onClick={() => setPage(page - 1)} />
                        {
                            page >= meta.totalPages + 2 && (
                                <>
                                    <Button classes={"text-azul w-[32px] h-[32px] xs:w-[36px] xs:h-[36px] sm:w-[40px] sm:h-[40px] bg-white border-2 border-cinza rounded-xl xs:rounded-2xl hover:bg-gray-50 text-azul text-xs xs:text-sm"} onClick={() => setPage(1)}>
                                        1
                                    </Button>
                                    <span className="text-cinza_escuro text-lg xs:text-xl font-medium px-1 xs:px-2">
                                        ...
                                    </span>
                                </>
                            )
                        }
                        <Button classes={"w-[32px] h-[32px] xs:w-[36px] xs:h-[36px] sm:w-[40px] sm:h-[40px] bg-white border-2 border-cinza rounded-xl xs:rounded-2xl hover:bg-gray-50 text-azul text-xs xs:text-sm"} onClick={() => setPage(page - 1)}>
                            {page - 1}
                        </Button>
                    </>
                ) : ``
            }

            {
                meta && (
                    <Button classes={'w-[32px] h-[32px] xs:w-[36px] xs:h-[36px] sm:w-[40px] sm:h-[40px] bg-gradient-to-b from-azul to-azul_escuro rounded-xl xs:rounded-2xl text-white text-xs xs:text-sm'} onClick={() => setPage(page)}>
                        {page}
                    </Button>
                )
            }

            {
                meta && meta.totalPages != page ? (
                    <>
                        <Button classes={"w-[32px] h-[32px] xs:w-[36px] xs:h-[36px] sm:w-[40px] sm:h-[40px] bg-white border-2 border-cinza rounded-xl xs:rounded-2xl hover:bg-gray-50 text-azul text-xs xs:text-sm"} onClick={() => setPage(page + 1)}>
                            {page + 1}
                        </Button>

                        {
                            page <= meta.totalPages - 2 && (
                                <>
                                    <span className="text-cinza_escuro text-lg xs:text-xl font-medium px-1 xs:px-2">
                                        ...
                                    </span>
                                    <Button classes={"w-[32px] h-[32px] xs:w-[36px] xs:h-[36px] sm:w-[40px] sm:h-[40px] bg-white border-2 border-cinza rounded-xl xs:rounded-2xl hover:bg-gray-50 text-azul text-xs xs:text-sm"} onClick={() => setPage(meta.totalPages)}>
                                        {meta.totalPages}
                                    </Button>
                                </>
                            )
                        }
                        <IconSeta cor="#CFCFCF" classe="rotate-180 cursor-pointer" onClick={() => setPage(page + 1)} />
                    </>
                ) : ``
            }
        </div>
    )
}