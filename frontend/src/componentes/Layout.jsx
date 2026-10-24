import { Outlet } from 'react-router';
import Cabecalho from './Cabecalho.jsx';

export default function Layout() {
  return (
    <>
      <Cabecalho />
      <main className="conteudo">
        <Outlet />
      </main>
    </>
  );
}
