import { Outlet } from 'react-router-dom';

import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function RootLayout() {
    return (
        <>
            <div>
                <Navbar />
            </div>
            <main>
                <Outlet />
            </main>
            <div>
                <Footer />
            </div>
        </>
    )
}
