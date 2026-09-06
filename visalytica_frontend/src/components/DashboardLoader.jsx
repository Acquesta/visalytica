"use client";
import dynamic from 'next/dynamic';

const MeuDashboardFuncional = dynamic(
  () => import('./MeuDashboardFuncional'),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex justify-center items-center w-full h-full min-h-[200px] xs:min-h-[250px] sm:min-h-[300px]">
        <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
);

export default function DashboardLoader() {
  return <MeuDashboardFuncional />;
}