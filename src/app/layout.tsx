import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "白癜风问答知识库",
  description: "面向患者与家属的白癜风诊断、治疗、护理和就诊准备科普问答页面。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
