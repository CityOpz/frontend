import { Outlet } from "react-router"

export default function RootLayout() {
    return (
        <>
            <header>

            </header>
            <main>
                <Outlet />
            </main>
            <footer>

            </footer>
        </>
    )
}
