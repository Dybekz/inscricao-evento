import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpa o DOM entre os testes, já que o Vitest roda sem globals
afterEach(() => {
  cleanup();
});
