import "../globals.css";
import Hotbar from '../../components/Hotbar'
import PrivateRoute from "../../components/PrivateRoute";

export default function RootLayout({ children }) {
  return (
    <PrivateRoute> 
      <div className="flex flex-col min-h-screen">
        <Hotbar />
        <main className="flex-1 pt-[70px] xs:pt-[75px] sm:pt-[85px] md:pt-[95px] lg:pt-[101px] overflow-y-auto">
          <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 max-md:py-4 pt-4">
            {children}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}