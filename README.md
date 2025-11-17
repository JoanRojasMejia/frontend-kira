<div align="center">

# Kira Payments Links Frontend

A modern payment link management application built with Vue 3, TypeScript, and Clean Architecture.

<img style="border-radius: 20px;" src="https://raw.githubusercontent.com/JoanRojasMejia/frontend-kira/refs/heads/main/public/preview.png">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-1.6-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#️-architecture) • [Testing](#-testing)

</div>

## 📋 Description

**Kira Link Frontend** is a web application that allows merchants to easily create and manage payment links. Customers can make payments via these links using their credit cards, with support for currency conversion (USD → MXN).

### ✨ Main Features

- **Payment Link Creation**: Generate unique links with description, amount, and expiration date  
- **Payment Processing**: Accept credit card payments with real-time validation  
- **Currency Conversion**: Automatic USD → MXN conversion with fee calculation  
- **Transaction Status**: View payment status (pending, completed, failed)  
- **Responsive Design**: Mobile and desktop-friendly interface  
- **Centralized Design System**: Reusable design tokens and styles  
- **Accessibility**: Meets web accessibility standards  
- **100% Test Coverage**: 135 passing tests with full coverage  


## 🚀 Installation

### Prerequisites

- Node.js >= 18.x  
- npm >= 9.x  

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd kira-link-front
```

2. **Install dependencies**
```bash
npm install
```

3. **Set environment variables**
```bash
cp .env.example .env
```

Edit your `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. **Run in development mode**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📖 Usage

### Create a Payment Link

1. Go to the home page (`/`)
2. Fill out the form:
   - **Merchant Name**  
   - **Payment Description** (min. 10 characters)  
   - **Amount in USD**  
   - **Expiration Option** (expires in 24h)  
3. Click **"Create Payment Link"**  
4. Share the generated link with your customers  

### Make a Payment

1. Open the shared payment link (`/pay/:id`)  
2. Review payment details  
3. Enter card information:  
   - Card Number (Luhn validated)  
   - Expiry Date (MM/YY)  
   - CVV (3–4 digits)  
   - Cardholder Name  
4. Accept terms  
5. Confirm payment  

### Test Cards

```
Mastercard: 4532015112830366
Visa:       5425233430109903
Amex:       374245455400126

Use any future date, valid CVV, and name.
```

---

## 🏗️ Architecture

The project follows **Clean Architecture**, separating business logic from frameworks and infrastructure.

```
┌───────────────────────────────────────────────┐
│         Presentation Layer                    │
│  (Views, Components, Composables)             │
├───────────────────────────────────────────────┤
│         Domain Layer                          │
│  (Entities, Use Cases, Repository Interfaces) │
├───────────────────────────────────────────────┤
│         Infrastructure Layer                  │
│  (API Services, Repositories Impl)            │
└───────────────────────────────────────────────┘

```

### 📁 Project Structure

```
src/
├── domain/                    # Capa de Dominio (Lógica de Negocio)
│   ├── entities/             # Entidades y DTOs
│   │   ├── PaymentLink.ts
│   │   └── Payment.ts
│   ├── repositories/         # Interfaces de repositorios
│   │   └── PaymentLinkRepository.ts
│   └── use-cases/           # Casos de uso
│       ├── CreatePaymentLink.ts
│       ├── GetPaymentLinkById.ts
│       └── ProcessPayment.ts
│
├── infrastructure/           # Capa de Infraestructura
│   ├── api/                 # Configuración de API
│   │   └── apiClient.ts
│   └── repositories/        # Implementaciones de repositorios
│       └── PaymentLinkRepositoryImpl.ts
│
├── presentation/            # Capa de Presentación
│   ├── components/         # Componentes Vue
│   │   ├── create-link/   # Componentes de creación de links
│   │   │   ├── CreateLinkForm.vue
│   │   │   └── LinkCreatedSuccess.vue
│   │   ├── payment/       # Componentes de pago
│   │   │   ├── CreditCardForm.vue
│   │   │   ├── PaymentInfo.vue
│   │   │   ├── PaymentStatusView.vue
│   │   │   └── FeeBreakdown.vue
│   │   └── shared/        # Componentes compartidos
│   │       ├── ErrorMessage.vue
│   │       └── LoadingSpinner.vue
│   ├── composables/       # Composables de Vue
│   │   ├── useCreatePaymentLink.ts
│   │   ├── usePaymentLink.ts
│   │   ├── useCreditCardValidation.ts
│   │   ├── useCreateLinkValidation.ts
│   │   ├── usePayment.ts
│   │   ├── useClipboard.ts
│   │   └── useTokenization.ts
│   ├── views/            # Vistas principales
│   │   ├── CreateLinkView.vue
│   │   └── PaymentView.vue
│   └── router/          # Configuración de rutas
│       └── index.ts
│
├── assets/              # Recursos estáticos
│   └── styles/         # Sistema de diseño SCSS
│       ├── _variables.scss  # Tokens de diseño
│       ├── _mixins.scss     # Mixins reutilizables
│       └── App.scss         # Estilos globales
│
└── utils/              # Utilidades
    ├── formatters.ts   # Funciones de formato
    ├── validators.ts   # Validaciones
    └── idGenerators.ts # Generadores de ID

```

## 🎨 Design System

The project includes a centralized design system based on SCSS tokens, ensuring visual consistency across the entire application.

### Design Tokens

#### Colors
```scss
$color-primary: #c21092;
$color-primary-light: #c210930a;
$color-primary-hover: #a00d78;
$color-primary-active: #8a0b66;

$color-success: #10b981;
$color-error: #ef4444;
$color-warning: #f59e0b;

$color-text-primary: #1f2937;
$color-text-secondary: #6b7280;
$color-text-inverse: #ffffff;
```

#### Spacing
```scss
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-2xl: 3rem;
$spacing-3xl: 4rem;
```

#### Typography
```scss
$font-family-base: system-ui, -apple-system, 'Segoe UI', sans-serif;

$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;
$font-size-3xl: 1.875rem;

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

#### Other Tokens
```scss
$border-radius-sm: 0.375rem;
$border-radius-md: 0.5rem;
$border-radius-lg: 0.75rem;
$border-radius-full: 9999px;

$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

$transition-fast: 150ms ease-in-out;
$transition-base: 200ms ease-in-out;
$transition-slow: 300ms ease-in-out;

$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;

$z-index-dropdown: 1000;
$z-index-modal: 1050;
$z-index-tooltip: 1100;
```

## 🧪 Testing

The project features **100% test coverage**, with 135 total passing tests.

### Run Tests
```bash
npm run test
npm run test:watch
npm run test:ui
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/
│   ├── domain/
│   ├── utils/
│   └── composables/
├── components/
├── integration/
├── factories/
└── setup.ts
```

## 📦 Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:watch
npm run test:ui
npm run test:coverage
npm run lint
npm run format
npm run type-check
```

## 🛠 Technologies Used

### Core
- Vue 3  
- TypeScript 5.6  
- Vite 5.4  

### UI/Styling
- Vue Router  
- SCSS  
- Custom Design System  

### Testing
- Vitest  
- Vue Test Utils  
- Happy DOM  

## 🔒 Security

### Implemented Validations

#### Credit Cards
- Luhn algorithm  
- 13–19 digit validation  
- CVV length  
- Expiry date validation  
- Cardholder name validation  

#### Forms
- Sanitization  
- Positive amounts  
- Description length  
- Required merchant ID  

## 🌐 Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | CreateLinkView | Main page to create payment links |
| `/pay/:id` | PaymentView | Payment page displaying link details |


## 📱 UI/UX Features

### Responsiveness
- Mobile-first  
- Adaptive components  
- Flexbox and grid layouts  

### User Feedback
- Loading states  
- Real-time validation  
- Error and success messages  
- Countdown timers  

### Accessibility
- Semantic labels  
- ARIA attributes  
- WCAG 2.1 AA contrast  
- Keyboard navigation

<div align="center">

**Built with ❤️ to Kira**

</div>