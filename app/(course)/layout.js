import "@/style/globals.css";
import Header from "../../components/header/header.js";

export const metadata = {
  title: "Hệ thống chấm điểm tự động",
};

export default async function RootLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
