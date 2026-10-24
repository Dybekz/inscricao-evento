import { Link } from 'react-router';
import { evento } from '../dados/evento.js';
import CartaoPalestrante from '../componentes/CartaoPalestrante.jsx';
import '../estilos/evento.css';

export default function Evento() {
  return (
    <>
      <section className="evento-hero">
        <h1 className="evento-titulo">{evento.nome}</h1>

        <dl className="evento-info">
          <div>
            <dt>Data</dt>
            <dd>{evento.data}</dd>
          </div>
          <div>
            <dt>Local</dt>
            <dd>{evento.local}</dd>
          </div>
        </dl>

        <p className="evento-descricao">{evento.descricao}</p>

        <Link to="/inscricao" className="botao evento-botao">
          Inscreva-se
        </Link>
      </section>

      <section className="evento-palestrantes" aria-labelledby="titulo-palestrantes">
        <h2 id="titulo-palestrantes">Palestrantes</h2>
        <ul className="evento-grade">
          {evento.palestrantes.map((palestrante) => (
            <li key={palestrante.nome}>
              <CartaoPalestrante palestrante={palestrante} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
