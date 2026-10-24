// Primeira letra do primeiro e do último nome: "Ana Ribeiro" → "AR"; um nome só → uma letra
export function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function CartaoPalestrante({ palestrante }) {
  const { nome, cargo, empresa, tema } = palestrante;

  return (
    <article className="palestrante">
      {/* O círculo é decorativo: o nome já aparece logo abaixo */}
      <div className="palestrante-iniciais" aria-hidden="true">
        {iniciais(nome)}
      </div>
      <h3 className="palestrante-nome">{nome}</h3>
      <p className="palestrante-cargo">
        {cargo} · {empresa}
      </p>
      <p className="palestrante-tema">{tema}</p>
    </article>
  );
}
