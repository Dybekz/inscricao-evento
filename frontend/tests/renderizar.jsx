import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from '../src/App.jsx';

// Renderiza o App inteiro já na rota pedida, como se a pessoa tivesse aberto esse endereço
export function renderizar(caminho = '/') {
  return {
    usuario: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={[caminho]}>
        <App />
      </MemoryRouter>,
    ),
  };
}
