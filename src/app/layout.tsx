import './globals.css';

export const metadata = {
  title: 'CP Tracker',
  description: 'Gerenciamento e documentação de problemas e ideias de programação competitiva',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}