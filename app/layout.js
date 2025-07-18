import "@/style/globals.css";
import Header from "../components/header/header";

export const metadata = {
  title: "Hệ thống chấm điểm tự động",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{ margin: 0, height: "100vh", background: "var(--background)" }}
      >
        <Header />
        <div >{children}</div>
      </body>
    </html>
  );
}
