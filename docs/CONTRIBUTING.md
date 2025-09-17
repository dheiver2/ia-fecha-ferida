# Contributing to Fecha Ferida IA

Obrigado por considerar contribuir para o projeto Fecha Ferida IA! Este documento fornece diretrizes para contribuições.

## 🤝 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/fecha-ferida-ia.git
cd fecha-ferida-ia

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original-owner/fecha-ferida-ia.git
```

### 2. Configuração do Ambiente

```bash
# Instale as dependências
npm run install:all

# Configure as variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Inicie o ambiente de desenvolvimento
npm run dev
```

### 3. Criando uma Branch

```bash
# Crie uma branch para sua feature/fix
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

## 📝 Padrões de Código

### Backend (Node.js/Express)

#### Estrutura de Arquivos
```
backend/
├── routes/          # Rotas da API
├── services/        # Lógica de negócio
├── middleware/      # Middlewares customizados
├── database/        # Configuração e schemas do banco
├── templates/       # Templates de relatórios
└── uploads/         # Arquivos enviados
```

#### Convenções
- Use `camelCase` para variáveis e funções
- Use `PascalCase` para classes
- Use `UPPER_CASE` para constantes
- Sempre use `async/await` ao invés de callbacks
- Valide todos os inputs com express-validator

#### Exemplo de Rota
```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/endpoint',
  auth,
  [
    body('field').notEmpty().withMessage('Campo obrigatório'),
    body('email').isEmail().withMessage('Email inválido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      // Lógica aqui
      
      res.json({
        success: true,
        message: 'Operação realizada com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);
```

### Frontend (React/TypeScript)

#### Estrutura de Arquivos
```
frontend/src/
├── components/      # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── services/       # Serviços de API
├── contexts/       # Contexts do React
├── hooks/          # Custom hooks
├── lib/            # Utilitários
├── styles/         # Estilos globais
└── templates/      # Templates de relatórios
```

#### Convenções
- Use `PascalCase` para componentes
- Use `camelCase` para funções e variáveis
- Use TypeScript para tipagem forte
- Use Tailwind CSS para estilização
- Prefira hooks funcionais sobre classes

#### Exemplo de Componente
```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ComponentProps {
  title: string;
  onAction: (data: string) => void;
}

export const ExampleComponent: React.FC<ComponentProps> = ({ 
  title, 
  onAction 
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, []);

  const handleClick = async () => {
    setLoading(true);
    try {
      // Action logic
      onAction('data');
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Button 
        onClick={handleClick} 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Carregando...' : 'Ação'}
      </Button>
    </div>
  );
};
```

## 🧪 Testes

### Executando Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Escrevendo Testes

#### Backend (Jest)
```javascript
const request = require('supertest');
const app = require('../server');

describe('POST /api/endpoint', () => {
  it('should create resource successfully', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({
        field: 'value'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it('should return error for invalid data', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });
});
```

#### Frontend (React Testing Library)
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExampleComponent } from './ExampleComponent';

describe('ExampleComponent', () => {
  it('renders title correctly', () => {
    render(
      <ExampleComponent 
        title="Test Title" 
        onAction={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', async () => {
    const mockOnAction = jest.fn();
    
    render(
      <ExampleComponent 
        title="Test" 
        onAction={mockOnAction} 
      />
    );
    
    fireEvent.click(screen.getByText('Ação'));
    
    await waitFor(() => {
      expect(mockOnAction).toHaveBeenCalledWith('data');
    });
  });
});
```

## 📋 Processo de Pull Request

### 1. Antes de Submeter

- [ ] Código segue os padrões estabelecidos
- [ ] Testes foram escritos e passam
- [ ] Documentação foi atualizada se necessário
- [ ] Commit messages são descritivos
- [ ] Branch está atualizada com a main

### 2. Commit Messages

Use o padrão Conventional Commits:

```
type(scope): description

feat(auth): add two-factor authentication
fix(api): resolve patient creation bug
docs(readme): update installation instructions
style(frontend): improve button styling
refactor(backend): optimize database queries
test(api): add tests for patient endpoints
```

Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, sem mudança de lógica
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

### 3. Template de Pull Request

```markdown
## Descrição
Breve descrição das mudanças realizadas.

## Tipo de Mudança
- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## Como Testar
1. Passos para reproduzir
2. Comportamento esperado
3. Screenshots se aplicável

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Mudanças foram testadas localmente
```

## 🐛 Reportando Bugs

### Template de Issue

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Versão: [e.g. 1.0.0]

**Informações Adicionais**
Qualquer outra informação relevante.
```

## 💡 Sugerindo Funcionalidades

### Template de Feature Request

```markdown
**Problema Relacionado**
Descrição do problema que esta funcionalidade resolveria.

**Solução Proposta**
Descrição clara da funcionalidade desejada.

**Alternativas Consideradas**
Outras soluções que foram consideradas.

**Informações Adicionais**
Contexto adicional, screenshots, etc.
```

## 📚 Recursos Úteis

### Documentação
- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Ferramentas
- [VS Code](https://code.visualstudio.com/) - Editor recomendado
- [Postman](https://www.postman.com/) - Teste de APIs
- [React DevTools](https://react-devtools-tutorial.vercel.app/) - Debug React

## 🏷️ Versionamento

O projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Funcionalidades adicionadas de forma compatível
- **PATCH**: Correções de bugs compatíveis

## 📞 Suporte

- **Issues**: Para bugs e feature requests
- **Discussions**: Para perguntas e discussões gerais
- **Email**: Para questões sensíveis

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

---

Obrigado por contribuir! 🚀