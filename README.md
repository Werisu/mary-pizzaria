# 🍕 Mary Pizzaria - Sistema de Delivery

Um aplicativo Angular completo de delivery para pizzaria com metodologia **Mobile First** e suporte a pizzas de **dois sabores**.

## ✨ Funcionalidades

### 🎯 Principais

- **Menu de Pizzas**: Visualização de pizzas salgadas e doces
- **Pizzas de Dois Sabores**: Opção de escolher dois sabores diferentes
- **Carrinho de Compras**: Gerenciamento de itens e quantidades
- **Checkout Completo**: Formulário de dados do cliente e pagamento
- **Confirmação de Pedido**: Tela de confirmação com detalhes

### 📱 Mobile First

- Design responsivo otimizado para dispositivos móveis
- Interface intuitiva e fácil de usar
- Navegação fluida entre telas
- Componentes adaptáveis a diferentes tamanhos de tela

### 🍕 Sistema de Pizzas

- **Pizzas Salgadas**: Margherita, Pepperoni, Quatro Queijos, Calabresa, Frango com Catupiry, Portuguesa
- **Pizzas Doces**: Chocolate, Banana com Canela
- **Tamanhos**: Pequena (80%), Média (100%), Grande (130%)
- **Personalização**: Observações especiais, quantidade, segundo sabor

### 💳 Sistema de Pagamento

- **Dinheiro**: Com opção de troco
- **Cartão**: Pagamento com cartão
- **PIX**: Pagamento via PIX

### 🚚 Entrega

- **Taxa de Entrega**: R$ 5,00 (grátis para pedidos acima de R$ 50,00)
- **Tempo Estimado**: 30-45 minutos
- **Rastreamento**: Status do pedido em tempo real

## 🛠️ Tecnologias Utilizadas

- **Angular 20**: Framework principal
- **Angular Material**: Componentes de UI
- **TypeScript**: Linguagem de programação
- **RxJS**: Programação reativa
- **CSS3**: Estilos e animações
- **HTML5**: Estrutura semântica

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── menu/                 # Menu principal de pizzas
│   │   ├── cart/                 # Carrinho de compras
│   │   ├── checkout/             # Finalização do pedido
│   │   ├── order-confirmation/   # Confirmação do pedido
│   │   └── pizza-detail/         # Detalhes da pizza
│   ├── models/
│   │   └── pizza.model.ts        # Interfaces e tipos
│   ├── services/
│   │   └── pizza.service.ts      # Lógica de negócio
│   ├── app.routes.ts             # Configuração de rotas
│   ├── app.config.ts             # Configuração do app
│   └── app.ts                    # Componente principal
├── assets/
│   └── images/                   # Imagens do projeto
└── styles.scss                   # Estilos globais
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]
cd mary-pizzaria

# Instale as dependências
npm install

# Execute o projeto
npm start
```

### Comandos Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o servidor de desenvolvimento
npm run build          # Compila para produção
npm run test           # Executa os testes
npm run lint           # Verifica o código
```

## 📱 Funcionalidades Detalhadas

### 1. Menu de Pizzas

- **Abas**: Separação entre pizzas salgadas e doces
- **Cards**: Exibição visual com imagem, nome, descrição e preço
- **Ingredientes**: Chips mostrando os principais ingredientes
- **Adicionar**: Botão para adicionar ao carrinho

### 2. Detalhes da Pizza

- **Modal**: Abre ao clicar em uma pizza
- **Personalização**: Tamanho, quantidade, segundo sabor
- **Observações**: Campo para instruções especiais
- **Preço Dinâmico**: Cálculo automático baseado nas escolhas

### 3. Carrinho de Compras

- **Lista de Itens**: Visualização de todos os itens adicionados
- **Remoção**: Botão para remover itens
- **Resumo**: Subtotal, taxa de entrega e total
- **Frete Grátis**: Informação sobre pedidos acima de R$ 50,00

### 4. Checkout

- **Dados do Cliente**: Nome, telefone e endereço
- **Forma de Pagamento**: Dinheiro, cartão ou PIX
- **Troco**: Campo para troco quando pagamento em dinheiro
- **Resumo do Pedido**: Confirmação final dos itens

### 5. Confirmação

- **Detalhes Completos**: Informações do pedido e cliente
- **Status**: Indicação do status atual
- **Tempo de Entrega**: Estimativa de entrega
- **Ações**: Fazer novo pedido ou ver menu

## 🎨 Design System

### Cores

- **Primária**: `#ff6b6b` (Vermelho pizza)
- **Secundária**: `#ee5a24` (Laranja)
- **Sucesso**: `#4caf50` (Verde)
- **Aviso**: `#ffd700` (Amarelo para pizzas doces)

### Tipografia

- **Família**: Roboto, Helvetica Neue, sans-serif
- **Tamanhos**: 14px (mobile), 16px (desktop)

### Componentes

- **Cards**: Bordas arredondadas (12px)
- **Botões**: Bordas arredondadas (8px)
- **Sombras**: Suaves para profundidade

## 📊 Fluxo do Usuário

1. **Entrada**: Menu principal com pizzas
2. **Seleção**: Escolha da pizza e personalização
3. **Carrinho**: Adição e revisão dos itens
4. **Checkout**: Preenchimento dos dados
5. **Confirmação**: Finalização e acompanhamento

## 🔧 Configurações

### Angular Material

O projeto utiliza Angular Material para componentes de UI, garantindo:

- Acessibilidade
- Design consistente
- Responsividade
- Animações suaves

### Mobile First

- Breakpoints otimizados para mobile
- Touch-friendly interfaces
- Navegação por gestos
- Performance otimizada

## 🚀 Deploy

### Produção

```bash
npm run build
```

### Servidor Local

```bash
npm start
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através dos canais disponíveis.

---

**Desenvolvido com ❤️ para a Mary Pizzaria**
