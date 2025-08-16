import "@/style/globals.css";

export const metadata = {
  title: "Hệ thống chấm điểm tự động",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
