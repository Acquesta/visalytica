import "../globals.css";
import Sidebar from '../../components/Sidebar'
import PrivateRoute from "../../components/PrivateRoute";

export default function RootLayout({ children }) {
  return (
    <PrivateRoute> 
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="max-md:mt-[76px] md:ml-[270px] flex-1 overflow-y-auto bg-[radial-gradient(circle,_#0077FF39,_#F3F5F729)]
              dark:bg-[radial-gradient(circle,_#0077FF_10%,_#1D232C_82%)] dark:opacity-65">
          <div className="h-full flex flex-col items-center justify-center">
            {children}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}