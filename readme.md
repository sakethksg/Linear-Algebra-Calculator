
# Linear Algebra Calculator

A modern, elegant web application for performing advanced linear algebra operations with a beautiful glassmorphism UI.

![Linear Algebra Calculator](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### Matrix Operations
- **Basic Operations**: Addition, Multiplication, Transpose
- **Advanced Computations**: Determinant, Inverse, Rank
- **Eigenanalysis**: Eigenvalues & Eigenvectors
- **Decompositions**: LU, QR decomposition

### Vector Operations
- **Dot Product**: For vectors of any dimension
- **Cross Product**: For 3D vectors

### System Solving
- **Linear Systems**: Solve Ax = b equations
- **Multiple solution types**: Unique, infinite, or least-squares solutions

### Design Features
- 🎨 **Glassmorphism UI**: Beautiful transparent glass-like interface with black and gray theme
- 🌑 **Modern Dark Theme**: Elegant black to gray gradient backgrounds
- 🔍 **Real-time Feedback**: Instant error handling and validation
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Fast Performance**: Server-side calculations with Next.js API routes
- 🎯 **Type Safety**: Full TypeScript implementation with strict type checking

## 🚀 Technology Stack

| Component       | Technology                                  |
|-----------------|---------------------------------------------|
| **Framework**   | Next.js 15 (App Router)                     |
| **Language**    | TypeScript 5.7                              |
| **UI Library**  | shadcn/ui (Radix UI primitives)            |
| **Styling**     | Tailwind CSS with glassmorphism            |
| **Math Engine** | mathjs 14.0                                 |
| **Icons**       | Lucide React                                |

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Modern web browser

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sakethksg/Linear-Algebra-Calculator.git
   cd Linear-Algebra-Calculator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Matrix Input Format
Matrices are entered as text with rows separated by semicolons:
```
1 2 3; 4 5 6; 7 8 9
```
This represents:
```
[ 1  2  3 ]
[ 4  5  6 ]
[ 7  8  9 ]
```

### Vector Input Format
Vectors are space-separated values:
```
1 2 3 4 5
```

### Available Operations

#### Basic Matrix Operations
- **Addition**: Add two matrices of same dimensions
- **Multiplication**: Multiply compatible matrices
- **Transpose**: Flip rows and columns
- **Determinant**: Calculate determinant of square matrices
- **Inverse**: Find inverse of non-singular matrices
- **Rank**: Determine matrix rank

#### Advanced Operations
- **Eigenvalues & Eigenvectors**: Compute with complex number support
- **System Solver**: Solve linear systems Ax = b

#### Vector Operations
- **Dot Product**: Scalar product of vectors
- **Cross Product**: Vector product (3D only)

#### Decompositions
- **LU Decomposition**: Lower-Upper factorization
- **QR Decomposition**: Orthogonal-triangular factorization

## 🏗️ Project Structure

```
Linear-Algebra-Calculator/
├── app/
│   ├── api/              # Next.js API routes
│   │   ├── matrix/       # Matrix operations endpoints
│   │   ├── vector/       # Vector operations endpoints
│   │   └── system/       # System solver endpoint
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles with glassmorphism
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── MatrixOperation.tsx
│   ├── VectorOperation.tsx
│   ├── EigenCalculator.tsx
│   ├── SystemSolver.tsx
│   └── DecompositionCalculator.tsx
├── lib/
│   ├── matrix-utils.ts   # Matrix calculation utilities
│   ├── vector-utils.ts   # Vector calculation utilities
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy automatically

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Modify Glassmorphism Theme

Edit `app/globals.css` to customize the glass effects:

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
}
```

### Change Color Scheme

Edit `tailwind.config.ts` to customize colors and theme. Current theme uses black to gray gradients for a modern, elegant look.

## 🐳 Docker Deployment

Build and run with Docker:

```bash
docker build -f Dockerfile.nextjs -t linear-algebra-calc .
docker run -p 3000:3000 linear-algebra-calc
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [mathjs](https://mathjs.org/) for mathematical operations
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📧 Contact

Project Link: [https://github.com/sakethksg/Linear-Algebra-Calculator](https://github.com/sakethksg/Linear-Algebra-Calculator)

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**

