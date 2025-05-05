import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapPin, Hotel, User, Phone, Mail, Star, Calendar, Check, AlertCircle, BarChart2, Briefcase, Bed, Layout, Image, Settings, LogOut, Plus, Edit, Eye, FileText, Key } from 'lucide-react';

// Define our color constants from the MICE color palette
const PRIMARY = '#2A4061';
const ACCENT = '#E5BC6D';
const LIGHT_GRAY = '#f5f7fa';
const TEXT_DARK = '#1a202c';
const SUCCESS = '#047857';
const WARNING = '#b45309';
const DANGER = '#b91c1c';

export default function Dashboard() {
  // Hotel profile data (would come from API)
  const [hotel, setHotel] = useState({
    name: "Hotel Mulia Malang",
    company: "PT Mulia Hospitality Indonesia",
    location: "Jl. Sukarno Hatta No. 123, Malang",
    classification: "Bintang 4",
    nib: "812345678910",
    chse: "CH2024-0012345",
    verificationStatus: "pending", // 'verified', 'pending', 'rejected'
    contactPerson: "Ahmad Fauzi",
    phoneNumber: "+62 812-3456-7890",
    email: "contact@hotelmuliamalang.com",
    website: "www.hotelmuliamalang.com"
  });

  // Data completion progress (would come from API)
  const [progressData, setProgressData] = useState([
    { id: 'generalInfo', name: 'Informasi Umum', progress: 100 },
    { id: 'location', name: 'Lokasi Properti', progress: 100 },
    { id: 'contact', name: 'Informasi Kontak', progress: 75 },
    { id: 'room', name: 'Data Kamar', progress: 25 },
    { id: 'venue', name: 'Data Venue', progress: 0 },
    { id: 'facilities', name: 'Fasilitas Hotel', progress: 50 },
    { id: 'gallery', name: 'Galeri Foto', progress: 30 },
  ]);

  // Total completion percentage
  const totalProgress = Math.round(
    progressData.reduce((sum, item) => sum + item.progress, 0) / progressData.length
  );

  // Recent activities
  const [activities, setActivities] = useState([
    { id: 1, type: 'registration', title: 'Pendaftaran Hotel', time: '2 jam yang lalu', description: 'Hotel Mulia Malang berhasil didaftarkan dalam sistem MICE ID INVENTORY' },
    { id: 2, type: 'location', title: 'Lokasi Terverifikasi', time: '1.5 jam yang lalu', description: 'Koordinat lokasi hotel berhasil diverifikasi dan disimpan dalam sistem' },
    { id: 3, type: 'nib', title: 'Verifikasi NIB', time: '1 jam yang lalu', description: 'Permohonan verifikasi NIB telah dikirim. Menunggu proses verifikasi' },
    { id: 4, type: 'chse', title: 'Verifikasi CHSE', time: '1 jam yang lalu', description: 'Permohonan verifikasi sertifikat CHSE telah dikirim. Menunggu proses verifikasi' },
  ]);

  // Verification statuses
  const [verifications, setVerifications] = useState([
    { id: 'nib', name: 'NIB (Nomor Induk Berusaha)', status: 'pending', icon: <FileText />, message: 'Proses verifikasi 1-2 hari kerja' },
    { id: 'chse', name: 'Sertifikat CHSE', status: 'pending', icon: <Check />, message: 'Proses verifikasi 1-2 hari kerja' },
    { id: 'property', name: 'Data Property', status: 'incomplete', icon: <Hotel />, message: 'Lengkapi data hotel' },
    { id: 'location', name: 'Lokasi', status: 'verified', icon: <MapPin />, message: 'Koordinat tersimpan' },
  ]);

  // Room statistics (would come from API)
  const roomStats = [
    { name: 'Standard Room', value: 30, color: PRIMARY },
    { name: 'Deluxe Room', value: 15, color: ACCENT },
    { name: 'Junior Suite', value: 5, color: '#718096' },
  ];

  const totalRooms = roomStats.reduce((sum, item) => sum + item.value, 0);

  // Venue statistics (would come from API)
  const venueStats = [
    { name: 'Meeting Room', value: 2, color: PRIMARY },
    { name: 'Ballroom', value: 1, color: ACCENT },
    { name: 'Outdoor', value: 0, color: '#718096' },
  ];

  // Get status color based on verification status
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return SUCCESS;
      case 'pending': return WARNING;
      case 'incomplete': 
      case 'rejected': return DANGER;
      default: return WARNING;
    }
  };

  // Get status badge based on verification status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified': return 'Terverifikasi';
      case 'pending': return 'Menunggu';
      case 'incomplete': return 'Belum Lengkap';
      case 'rejected': return 'Ditolak';
      default: return 'Menunggu';
    }
  };

  // Get icon background color based on activity type
  const getActivityIconBg = (type) => {
    switch (type) {
      case 'registration': return PRIMARY;
      case 'location': return SUCCESS;
      case 'nib':
      case 'chse': return WARNING;
      default: return PRIMARY;
    }
  };

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration': return <Plus size={16} />;
      case 'location': return <MapPin size={16} />;
      case 'nib': return <FileText size={16} />;
      case 'chse': return <Check size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-[#2A4061] text-white py-4 shadow-md relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-0">MICE ID INVENTORY</h1>
              <p className="text-sm text-gray-300">Professional Data Management for Business</p>
            </div>
            <div className="flex items-center">
              <div className="dropdown relative">
                <button className="bg-white text-[#2A4061] px-3 py-2 rounded flex items-center">
                  <User size={18} className="mr-2" />
                  <span>Hotel Manager</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#E5BC6D]"></div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-[#2A4061] text-white p-4 border-b-4 border-[#E5BC6D]">
                <h5 className="font-bold">Menu Hotel</h5>
              </div>
              <div className="p-2">
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-[#2A4061] bg-gray-100 border-l-4 border-[#E5BC6D] font-medium rounded">
                      <BarChart2 size={18} className="mr-3" /> Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="../form/" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#2A4061] hover:border-l-4 hover:border-[#E5BC6D] transition-colors rounded">
                      <Hotel size={18} className="mr-3" /> Informasi Hotel
                    </a>
                  </li>
                  <li>
                    <a href="../room/" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#2A4061] hover:border-l-4 hover:border-[#E5BC6D] transition-colors rounded">
                      <Bed size={18} className="mr-3" /> Data Kamar
                    </a>
                  </li>
                  <li>
                    <a href="../venue/index.html" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#2A4061] hover:border-l-4 hover:border-[#E5BC6D] transition-colors rounded">
                      <Layout size={18} className="mr-3" /> Data Venue
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#2A4061] hover:border-l-4 hover:border-[#E5BC6D] transition-colors rounded">
                      <Image size={18} className="mr-3" /> Galeri Foto
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#2A4061] hover:border-l-4 hover:border-[#E5BC6D] transition-colors rounded">
                      <Settings size={18} className="mr-3" /> Pengaturan
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Hotel Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#2A4061] text-white p-4 text-center border-b-4 border-[#E5BC6D]">
                <div className="w-20 h-20 rounded-full bg-white text-[#2A4061] flex items-center justify-center text-3xl mx-auto mb-3 border-3 border-[#E5BC6D]">
                  <Hotel size={40} />
                </div>
                <h4 className="font-bold">{hotel.name}</h4>
                <p className="text-sm">Malang, Jawa Timur</p>
                <div className="inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  <Clock size={12} className="mr-1" /> Menunggu Verifikasi
                </div>
              </div>
              <div className="p-4">
                <div className="flex mb-2">
                  <Briefcase size={16} className="text-[#E5BC6D] mr-2 flex-shrink-0" />
                  <p className="text-sm">{hotel.company}</p>
                </div>
                <div className="flex mb-2">
                  <FileText size={16} className="text-[#E5BC6D] mr-2 flex-shrink-0" />
                  <p className="text-sm">NIB: {hotel.nib}</p>
                </div>
                <div className="flex mb-2">
                  <Check size={16} className="text-[#E5BC6D] mr-2 flex-shrink-0" />
                  <p className="text-sm">CHSE: {hotel.chse}</p>
                </div>
                <div className="flex mb-2">
                  <Star size={16} className="text-[#E5BC6D] mr-2 flex-shrink-0" />
                  <p className="text-sm">{hotel.classification}</p>
                </div>
                <div className="flex mb-2">
                  <MapPin size={16} className="text-[#E5BC6D] mr-2 flex-shrink-0" />
                  <p className="text-sm">{hotel.location}</p>
                </div>
                <a href="../form/index.html" className="w-full block mt-3 text-center bg-[#2A4061] text-white p-2 rounded hover:bg-[#3A5071] transition-colors">
                  <Edit size={16} className="inline mr-2" /> Edit Informasi Hotel
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-4/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Progress and Status Card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h5 className="font-bold text-lg text-[#2A4061]">Status Kelengkapan Data</h5>
                  <div className="bg-[#2A4061] text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center">
                    {totalProgress}%
                  </div>
                </div>
                <div className="p-4">
                  {progressData.map((item) => (
                    <div key={item.id} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="font-medium" style={{ color: getStatusColor(item.progress >= 100 ? 'verified' : item.progress > 50 ? 'pending' : 'incomplete') }}>
                          {item.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.progress}%`,
                            backgroundColor: item.progress >= 100 ? SUCCESS : item.progress > 50 ? WARNING : PRIMARY
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="text-sm text-gray-600 mt-3">
                    Lengkapi semua bagian untuk mendapatkan verifikasi dari sistem
                  </div>
                </div>
              </div>

              {/* Verification Status Card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h5 className="font-bold text-lg text-[#2A4061]">Status Verifikasi</h5>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {verifications.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: getStatusColor(item.status) + '20', color: getStatusColor(item.status) }}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h6 className="font-medium">{item.name}</h6>
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2 py-1 text-xs rounded font-medium mr-2" style={{ backgroundColor: getStatusColor(item.status) + '20', color: getStatusColor(item.status) }}>
                              {getStatusBadge(item.status)}
                            </span>
                            <span className="text-sm text-gray-600">{item.message}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Rooms */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-[#2A4061] text-white">
                  <h5 className="font-bold">Data Kamar</h5>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roomStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value}`}
                        >
                          {roomStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-3xl font-bold text-[#2A4061]">{totalRooms}</div>
                    <p className="text-gray-600">Total Kamar</p>
                  </div>
                  <a href="../room/index.html" className="mt-4 px-4 py-2 bg-[#2A4061] text-white rounded-lg hover:bg-opacity-90 transition-all text-sm flex items-center">
                    <Edit size={14} className="mr-2" /> Kelola Data Kamar
                  </a>
                </div>
              </div>

              {/* Venue Data */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-[#2A4061] text-white">
                  <h5 className="font-bold">Data Venue</h5>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={venueStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value}`}
                        >
                          {venueStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-3xl font-bold text-[#2A4061]">{venueStats.reduce((sum, item) => sum + item.value, 0)}</div>
                    <p className="text-gray-600">Total Venue</p>
                  </div>
                  <a href="../venue/index.html" className="mt-4 px-4 py-2 bg-[#2A4061] text-white rounded-lg hover:bg-opacity-90 transition-all text-sm flex items-center">
                    <Edit size={14} className="mr-2" /> Kelola Data Venue
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-[#2A4061] text-white">
                  <h5 className="font-bold">Informasi Kontak</h5>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex">
                      <User size={18} className="text-[#E5BC6D] mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{hotel.contactPerson}</p>
                        <p className="text-sm text-gray-600">PIC Hotel</p>
                      </div>
                    </div>
                    <div className="flex">
                      <Phone size={18} className="text-[#E5BC6D] mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{hotel.phoneNumber}</p>
                        <p className="text-sm text-gray-600">Nomor Telepon</p>
                      </div>
                    </div>
                    <div className="flex">
                      <Mail size={18} className="text-[#E5BC6D] mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{hotel.email}</p>
                        <p className="text-sm text-gray-600">Email</p>
                      </div>
                    </div>
                    <div className="flex">
                      <Globe size={18} className="text-[#E5BC6D] mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{hotel.website}</p>
                        <p className="text-sm text-gray-600">Website</p>
                      </div>
                    </div>
                  </div>
                  <a href="../form/index.html" className="mt-4 block w-full px-4 py-2 bg-[#2A4061] text-white rounded-lg hover:bg-opacity-90 transition-all text-sm text-center">
                    Edit Informasi Kontak
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-[#2A4061] mb-4 pb-2 border-b-2 border-[#E5BC6D] inline-block">Lengkapi Data Hotel</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="../form/index.html" className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-[#E5BC6D]">
                  <div className="w-12 h-12 bg-[#2A4061] text-white rounded-lg flex items-center justify-center mr-4">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">Informasi Umum</h5>
                    <p className="text-sm text-gray-600">Data dasar hotel, NIB, CHSE</p>
                  </div>
                </a>
                <a href="../room/index.html" className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-[#E5BC6D]">
                  <div className="w-12 h-12 bg-[#2A4061] text-white rounded-lg flex items-center justify-center mr-4">
                    <Bed size={20} />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">Data Kamar</h5>
                    <p className="text-sm text-gray-600">Tipe kamar, fasilitas</p>
                  </div>
                </a>
                <a href="../venue/index.html" className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-[#E5BC6D]">
                  <div className="w-12 h-12 bg-[#2A4061] text-white rounded-lg flex items-center justify-center mr-4">
                    <Layout size={20} />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">Data Venue</h5>
                    <p className="text-sm text-gray-600">Ruang meeting, ballroom</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h5 className="font-bold text-lg text-[#2A4061]">Aktivitas Terbaru</h5>
              </div>
              <div className="p-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex mb-4 last:mb-0">
                    <div className="flex-shrink-0 mr-4 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: getActivityIconBg(activity.type) }}>
                        {getActivityIcon(activity.type)}
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h6 className="font-medium">{activity.title}</h6>
                        <small className="text-gray-500 ml-auto">{activity.time}</small>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2A4061] text-white mt-8 py-4">
        <div className="border-b border-[#E5BC6D] mb-4"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">&copy; 2025 MICE ID INVENTORY. All rights reserved.</p>
            <div className="flex mt-2 md:mt-0">
              <a href="#" className="text-white text-sm hover:text-[#E5BC6D] mr-4">
                <Mail size={14} className="inline mr-1" /> Kontak
              </a>
              <a href="#" className="text-white text-sm hover:text-[#E5BC6D]">
                <AlertCircle size={14} className="inline mr-1" /> Bantuan
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}