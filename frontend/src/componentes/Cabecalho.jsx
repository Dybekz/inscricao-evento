import { Link, NavLink } from 'react-router';

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho-interno">
        <Link to="/" className="cabecalho-marca">
          Conecta Tech 2027
        </Link>
        <nav aria-label="Navegação principal">
          <ul className="cabecalho-links">
            <li>
              {/* end: sem ele, o link de "/" ficaria ativo em todas as telas */}
              <NavLink to="/" end className="cabecalho-link">
                Evento
              </NavLink>
            </li>
            <li>
              <NavLink to="/inscricao" className="cabecalho-link">
                Inscrição
              </NavLink>
            </li>
            <li>
              <NavLink to="/inscritos" className="cabecalho-link">
                Inscritos
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
