export const metadata = {
  title: "Panier",
  robots: { index: false, follow: false },
};

export default function PanierLayout({ children }: LayoutProps<"/panier">) {
  return children;
}
