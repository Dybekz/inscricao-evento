import { Routes, Route } from 'react-router';
import Layout from './componentes/Layout.jsx';
import Evento from './paginas/Evento.jsx';
import Inscricao from './paginas/Inscricao.jsx';
import Inscritos from './paginas/Inscritos.jsx';
import NaoEncontrada from './paginas/NaoEncontrada.jsx';

// O BrowserRouter fica no main.jsx; nos testes, o App é envolvido num MemoryRouter (DT-02)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Evento />} />
        <Route path="/inscricao" element={<Inscricao />} />
        <Route path="/inscritos" element={<Inscritos />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}
