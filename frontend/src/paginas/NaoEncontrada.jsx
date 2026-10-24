import { Link } from 'react-router';

export default function NaoEncontrada() {
  return (
    <section className="nao-encontrada">
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe.</p>
      <Link to="/" className="botao">
        Voltar para o início
      </Link>
    </section>
  );
}
