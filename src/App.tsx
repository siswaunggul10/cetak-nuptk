/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  GraduationCap, 
  Phone, 
  Rss, 
  Upload, 
  RefreshCcw, 
  Printer, 
  CheckCircle2,
  ChevronDown,
  ShoppingBag,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { cn } from './lib/utils';

// Types
interface FormData {
  nuptk: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  gender: string;
  photo: string | null;
}

const INITIAL_DATA: FormData = {
  nuptk: '',
  nama: '',
  tempatLahir: '',
  tanggalLahir: '',
  gender: '',
  photo: null,
};

export default function App() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [printCount, setPrintCount] = useState(1004287);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 250 * 1024) {
        alert('Ukuran file maksimal 250KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(INITIAL_DATA);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Print/Download Card
  const handlePrint = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54], // Standard ID card size
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54);
      pdf.save(`Kartu_NUPTK_${formData.nama || 'User'}.pdf`);
      setPrintCount(prev => prev + 1);
    } catch (error) {
      console.error('Error generating card:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-md">
                <CreditCard className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-800">Cetak Kartu</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Home className="w-4 h-4" /> Home
              </a>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <CreditCard className="w-4 h-4" /> Cetak Kartu <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <GraduationCap className="w-4 h-4" /> PPDB 2024 <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4" /> Kontak Kami <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full flex items-center gap-2 transition-all">
                <Rss className="w-4 h-4" /> Blog
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-10 no-print">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-slate-800 mb-2">
            <div className="bg-emerald-100 p-1 rounded text-emerald-600">
              <CreditCard className="w-6 h-6" />
            </div>
            Form Isian Kartu NUPTK
          </div>
          <p className="text-slate-500">Silahkan masukkan informasi di form untuk mengisi Kartu Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-container no-print"
          >
            <div className="bg-gray-50 px-4 py-3 border-bottom border-gray-200 flex items-center gap-2 font-semibold text-slate-700">
              <div className="bg-white p-1 rounded border border-gray-200 shadow-sm">
                <CreditCard className="w-4 h-4 text-slate-500" />
              </div>
              *Form Isian
            </div>
            
            <div className="p-6 space-y-5">
              {/* Photo Upload */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-24 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Home className="w-4 h-4" /> Photo
                </div>
                <div className="flex-1">
                  <div className="relative flex items-center">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      id="photo-upload"
                    />
                    <label 
                      htmlFor="photo-upload"
                      className="flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-l-md bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-slate-500 truncate">
                        {fileInputRef.current?.files?.[0]?.name || 'Tidak ada file yang dipilih'}
                      </span>
                      <span className="bg-gray-100 px-3 py-1 rounded text-xs font-semibold text-slate-600 border border-gray-200">
                        Pilih File
                      </span>
                    </label>
                    <div className="bg-slate-100 p-2.5 border border-l-0 border-gray-300 rounded-r-md">
                      <Upload className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-[10px] text-red-500 font-medium">
                      File Pas Photo | 3x4* | Max size 250KB | Format (.jpg/.jpeg/.png)
                    </p>
                    <p className="text-[10px] text-emerald-600">
                      ( Ukuran 3x4 yaitu 2,79 x 3,81 cm resolusi 300 dpi atau 354 x 472 pixels resolusi 300 dpi )
                    </p>
                  </div>
                </div>
              </div>

              {/* NUPTK */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-24 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <CreditCard className="w-4 h-4" /> NUPTK
                </div>
                <input 
                  type="text"
                  name="nuptk"
                  value={formData.nuptk}
                  onChange={handleInputChange}
                  placeholder="NUPTK (16 Digit, Hanya Angka)"
                  className="input-field flex-1"
                  maxLength={16}
                />
              </div>

              {/* Nama */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-24 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Home className="w-4 h-4" /> Nama
                </div>
                <input 
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama Lengkap (Min 3, Max 29)"
                  className="input-field flex-1"
                  maxLength={29}
                />
              </div>

              {/* Tempat Lahir */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-24 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Home className="w-4 h-4" /> Tempat Lahir
                </div>
                <input 
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleInputChange}
                  placeholder="Tempat Lahir (Min 3, Max 24)"
                  className="input-field flex-1"
                  maxLength={24}
                />
              </div>

              {/* Tanggal Lahir & Gender */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-24 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Home className="w-4 h-4" /> Tanggal Lahir
                </div>
                <div className="flex-1 flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    placeholder="Tanggal Lahir (Min 3, Max 20)"
                    className="input-field flex-1"
                    maxLength={20}
                  />
                  <div className="flex items-center gap-2 min-w-[150px]">
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
                      <Home className="w-4 h-4" /> Gender
                    </div>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input-field py-1.5"
                    >
                      <option value="">Pilih</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-between pt-4">
                <button onClick={handlePrint} className="btn-primary">
                  <Printer className="w-4 h-4" /> Cetak Kartu
                </button>
                <button onClick={handleReset} className="btn-secondary">
                  <RefreshCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card-container">
              <div className="bg-gray-50 px-4 py-3 border-bottom border-gray-200 flex items-center gap-2 font-semibold text-slate-700 no-print">
                <div className="bg-white p-1 rounded border border-gray-200 shadow-sm">
                  <Home className="w-4 h-4 text-slate-500" />
                </div>
                Live Preview Kartu NUPTK
              </div>
              
              <div className="p-6 flex flex-col items-center">
                {/* The Card Itself */}
                <div 
                  ref={cardRef}
                  className="relative w-[400px] h-[250px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 select-none"
                  style={{ 
                    backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Kementerian_Pendidikan_dan_Kebudayaan.png/600px-Logo_Kementerian_Pendidikan_dan_Kebudayaan.png")',
                    backgroundSize: '40%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backgroundBlendMode: 'overlay'
                  }}
                >
                  {/* Card Header */}
                  <div className="p-3 flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Kementerian_Pendidikan_dan_Kebudayaan.png/600px-Logo_Kementerian_Pendidikan_dan_Kebudayaan.png" 
                        alt="Logo" 
                        className="h-8 w-auto"
                      />
                      <div className="leading-tight">
                        <p className="text-[8px] font-bold text-blue-900 uppercase">Kementerian</p>
                        <p className="text-[8px] font-bold text-blue-900 uppercase">Pendidikan Dasar</p>
                        <p className="text-[8px] font-bold text-blue-900 uppercase">Dan Menengah</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-blue-600 font-black text-lg leading-none">KARTU NUPTK</h2>
                      <p className="text-[6px] font-bold text-blue-800 uppercase tracking-tighter">Nomor Unik Pendidik Dan Tenaga Kependidikan</p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-4 flex gap-4 mt-2">
                    {/* Left Side: Logo & Photo */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-blue-500 text-white p-1 rounded flex items-center gap-1">
                        <span className="text-[6px] font-bold">Ruang</span>
                        <span className="text-[10px] font-black italic">GTK</span>
                      </div>
                      <div className="w-20 h-28 bg-gray-100 border-2 border-gray-200 rounded-sm overflow-hidden flex items-center justify-center relative">
                        {formData.photo ? (
                          <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-1">
                            <p className="text-[8px] font-bold text-gray-400">Ukuran</p>
                            <p className="text-[8px] font-bold text-gray-400">Photo:</p>
                            <p className="text-[10px] font-black text-red-500">3x4</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Data */}
                    <div className="flex-1 space-y-1.5 pt-2">
                      <div className="grid grid-cols-[60px_1fr] gap-1 items-start">
                        <span className="text-[9px] font-bold text-gray-600">NUPTK</span>
                        <span className="text-[9px] font-bold text-blue-900">: {formData.nuptk || '-'}</span>
                      </div>
                      <div className="grid grid-cols-[60px_1fr] gap-1 items-start">
                        <span className="text-[9px] font-bold text-gray-600">Nama</span>
                        <span className="text-[9px] font-bold text-blue-900">: {formData.nama || '-'}</span>
                      </div>
                      <div className="grid grid-cols-[60px_1fr] gap-1 items-start">
                        <span className="text-[9px] font-bold text-gray-600">Tempat Lahir</span>
                        <span className="text-[9px] font-bold text-blue-900">: {formData.tempatLahir || '-'}</span>
                      </div>
                      <div className="grid grid-cols-[60px_1fr] gap-1 items-start">
                        <span className="text-[9px] font-bold text-gray-600">Tanggal Lahir</span>
                        <span className="text-[9px] font-bold text-blue-900">: {formData.tanggalLahir || '-'}</span>
                      </div>
                      <div className="grid grid-cols-[60px_1fr] gap-1 items-start">
                        <span className="text-[9px] font-bold text-gray-600">Jenis Kelamin</span>
                        <span className="text-[9px] font-bold text-blue-900">: {formData.gender || '-'}</span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1">
                      <div className="bg-white p-1 border border-gray-200 rounded shadow-sm">
                        <QRCodeSVG value={formData.nuptk || 'NUPTK'} size={40} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[6px] font-bold text-gray-400">WWW.</span>
                        <span className="text-[7px] font-black text-blue-600">DAPODIK</span>
                        <span className="text-[6px] font-bold text-gray-400">.COM</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Decoration */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
                </div>

                {/* Marketplace Links */}
                <div className="mt-8 text-center no-print">
                  <p className="text-xs text-slate-500 mb-4">
                    Bagi yang Ingin Dibantu Cetak Dalam Bentuk Fisik Bisa Klik di link marketplace kesukaan anda dibawah ini.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href="#" className="bg-[#00AA5B] hover:bg-[#00944F] text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all">
                      <Store className="w-3 h-3" /> Tokopedia
                    </a>
                    <a href="#" className="bg-[#EE4D2D] hover:bg-[#D44428] text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all">
                      <ShoppingBag className="w-3 h-3" /> Shopee
                    </a>
                    <a href="#" className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all">
                      <Store className="w-3 h-3" /> Siplah
                    </a>
                  </div>
                </div>
              </div>

              {/* Counter & Floating Button */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
                <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                  <Printer className="w-4 h-4" />
                  <span>{printCount.toLocaleString('id-ID')} orang mencetak kartu ini</span>
                </div>
                <button 
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" /> Cetak Kartu NUPTK
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="mt-12 py-8 bg-white border-t border-gray-200 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Cetak Kartu NUPTK Online | By: Zainal Abidin, S.Pd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
