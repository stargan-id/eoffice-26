import LoginForm from "./components/index";
import Image from "next/image";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">EO</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">E-Office</h1>
                <p className="text-sm text-slate-600">Sistem Administrasi Perkantoran Digital</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              Kementerian/Lembaga Anda
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Hero Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Sistem Administrasi Perkantoran Terpadu
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  Selamat Datang di
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> E-Office</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                  Platform digital untuk manajemen surat, dokumen, disposisi, dan arsip perkantoran secara efisien dan aman.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Manajemen Surat & Dokumen</h3>
                    <p className="text-sm text-slate-600">Kelola surat masuk, keluar, dan arsip digital</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Keamanan Data</h3>
                    <p className="text-sm text-slate-600">Enkripsi & otorisasi akses dokumen</p>
                  </div>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden lg:block relative">
                <div className="w-full h-64 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium">Disposisi & Tracking Surat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-center text-slate-900">
                    Masuk ke E-Office
                  </CardTitle>
                  <CardDescription className="text-center text-slate-600">
                    Gunakan akun resmi Anda untuk mengakses sistem administrasi perkantoran digital
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Suspense fallback={
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  }>
                    <LoginForm />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <p className="text-sm text-slate-600">
              © 2025 E-Office. Semua hak dilindungi.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Bantuan
              </a>
              <Separator orientation="vertical" className="h-4" />
              <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
