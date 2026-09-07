import "../globals.css";
import Hotbar from '../../components/Sidebar'
import PrivateRoute from "../../components/PrivateRoute";

export default function RootLayout({ children }) {
  return (
    <PrivateRoute> 
      <div className="flex min-h-screen">
        <Hotbar />
        <main className="max-md:mt-[76px] relative isolate flex-1 overflow-y-auto md:ml-[270px]">
          <div 
            className="
              absolute inset-0 z-[-1]
              bg-[radial-gradient(circle,_#0077FF39,_#F3F5F729)]
              dark:bg-[radial-gradient(circle,_#0077FF_10%,_#1D232C_82%)] dark:opacity-65
            "
            aria-hidden="true"
          />

          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}