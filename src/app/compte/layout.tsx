export const metadata = {
  robots: { index: false, follow: false },
};

export default function CompteLayout({ children }: LayoutProps<"/compte">) {
  return children;
}
