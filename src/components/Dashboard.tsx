import React, { useState, useEffect } from 'react';
import { BarChart2, Hotel, User, MapPin, Phone, Mail, Star, Check, AlertCircle, Briefcase, Bed, Layout, Image, Settings, Clock, FileText, Map } from 'lucide-react';

// Color constants based on MICE color palette
const PRIMARY = '#2A4061';
const ACCENT = '#E5BC6D';
const LIGHT_GRAY = '#f5f7fa';
const MID_GRAY = '#e2e8f0';
const TEXT_DARK = '#1a202c';
const TEXT_MEDIUM = '#4a5568';
const SUCCESS = '#047857';
const WARNING = '#b45309';
const DANGER = '#b91c1c';

export default function HotelDashboard() {
  // State for hotel profile data
  const [hotel, setHotel] = useState({
    name: "Hotel Mulia Malang",
    company: "PT Mulia Hospitality Indonesia",
    location: "Jl. Sukarno Hatta No. 123, Malang, Jawa Timur",
    coordinates: { lat: -7.9666, lng: 112.6326 }, // Malang coordinates
    classification: "Bintang 4",
    nib: "812345678910",
    chse: "CH2024-0012345",
    verificationStatus: "pending", // 'verified', 'pending', 'rejected'
    contactPerson: "Ahmad Fauzi",
    phoneNumber: "+62 812-3456-7890",
    email: "contact@hotelmuliamalang.com",
    website: "www.hotelmuliamalang.com"
  });

  // Data completion progress
  const [progressData, setProgressData] = useState([
    { id: 'generalInfo', name: 'Informasi Umum', progress: 100 },
    { id: 'location', name: 'Lokasi Properti', progress: 100 },
    { id: 'contact', name: 'Informasi Kontak', progress: 75 },
    { id: 'room', name: 'Data Kamar', progress: 25 },
    { id: 'mice-management', name: 'Ruang Meeting', progress: 0 },
    { id: 'facilities', name: 'Fasilitas Hotel', progress: 50 },
    { id: 'gallery', name: 'Galeri Foto', progress: 30 },
  ]);

  // Calculate total completion percentage
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
    { id: 'nib', name: 'NIB (Nomor Induk Berusaha)', status: 'pending', icon: <FileText size={18} />, message: 'Proses verifikasi 1-2 hari kerja' },
    { id: 'chse', name: 'Sertifikat CHSE', status: 'pending', icon: <Check size={18} />, message: 'Proses verifikasi 1-2 hari kerja' },
    { id: 'property', name: 'Data Property', status: 'incomplete', icon: <Hotel size={18} />, message: 'Lengkapi data hotel' },
    { id: 'location', name: 'Lokasi', status: 'verified', icon: <MapPin size={18} />, message: 'Koordinat tersimpan' },
  ]);

  // Stat cards for dashboard
  const statCards = [
    { title: 'Total Kamar', value: 50, icon: <Bed size={24} />, color: PRIMARY, change: '+5', changeType: 'up' },
    { title: 'Total Venue', value: 3, icon: <Layout size={24} />, color: ACCENT, change: 'Baru', changeType: 'new' },
    { title: 'Kelengkapan Data', value: `${totalProgress}%`, icon: <FileText size={24} />, color: WARNING, change: '+8%', changeType: 'up' },
    { title: 'Status', value: 'Menunggu', icon: <Clock size={24} />, color: SUCCESS, change: '1-2 hari', changeType: 'time' }
  ];

  // State for Google Maps
  const [mapLoaded, setMapLoaded] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState([
    { name: 'Bandara Abdulrachman Saleh', type: 'airport', distance: '12.5 km' },
    { name: 'Stasiun Malang', type: 'train_station', distance: '3.2 km' },
    { name: 'Mall Olympic Garden', type: 'shopping_mall', distance: '1.8 km' },
    { name: 'RS Saiful Anwar', type: 'hospital', distance: '2.4 km' }
  ]);
  
  // Define interface for Google Maps API
  interface GoogleMapWindow extends Window {
    google?: any;
  }

  // Effect to initialize Google Maps
  useEffect(() => {
    // Function to load Google Maps script
    const loadGoogleMapsScript = () => {
      const googleWindow = window as GoogleMapWindow;
      if (googleWindow.google) {
        setMapLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAS5Vc3Ixr-TYcoAdmTAWqfsuQchoQtEHs&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    };
    
    loadGoogleMapsScript();
  }, []);
  
  // Effect to initialize map after script loads

  useEffect(() => {
    if (!mapLoaded) return;
    
    const initializeMap = () => {
      const mapElement = document.getElementById('hotel-map');
      if (!mapElement) return;
      
      // Type casting window to include google property
      const googleWindow = window as GoogleMapWindow;
      if (!googleWindow.google) return;
      
      const map = new googleWindow.google.maps.Map(mapElement, {
        center: hotel.coordinates,
        zoom: 15,
        mapTypeId: googleWindow.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true
      });
      
      // Add marker for hotel location
      const marker = new googleWindow.google.maps.Marker({
        position: hotel.coordinates,
        map: map,
        animation: googleWindow.google.maps.Animation.DROP,
        title: hotel.name,
        icon: {
          path: googleWindow.google.maps.SymbolPath.CIRCLE,
          fillColor: ACCENT,
          fillOpacity: 1,
          strokeColor: PRIMARY,
          strokeWeight: 2,
          scale: 10
        }
      });
      
      // Add info window
      const infoWindow = new googleWindow.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h5 style="margin: 0 0 5px; color: ${PRIMARY}; font-weight: bold;">${hotel.name}</h5>
            <p style="margin: 0 0 5px; font-size: 12px;">${hotel.location}</p>
            <p style="margin: 0; font-size: 12px; color: ${TEXT_MEDIUM};">${hotel.classification}</p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      // Initially open the info window
      infoWindow.open(map, marker);
    };
    
    initializeMap();
  }, [mapLoaded, hotel]);

  // Define status type
  type VerificationStatus = 'verified' | 'pending' | 'incomplete' | 'rejected' | string;

  // Define activity type
  type ActivityType = 'registration' | 'location' | 'nib' | 'chse' | string;

  // Helper function to get status color
  const getStatusColor = (status: VerificationStatus): string => {
    switch (status) {
      case 'verified': return SUCCESS;
      case 'pending': return WARNING;
      case 'incomplete': 
      case 'rejected': return DANGER;
      default: return WARNING;
    }
  };

  // Helper function for status badges
  const getStatusBadge = (status: VerificationStatus): string => {
    switch (status) {
      case 'verified': return 'Terverifikasi';
      case 'pending': return 'Menunggu';
      case 'incomplete': return 'Belum Lengkap';
      case 'rejected': return 'Ditolak';
      default: return 'Menunggu';
    }
  };

  // Define activity details return type
  interface ActivityDetails {
    bgColor: string;
    icon: React.ReactNode;
  }

  // Get activity icon background and icon based on type
  const getActivityDetails = (type: ActivityType): ActivityDetails => {
    switch (type) {
      case 'registration':
        return { bgColor: PRIMARY, icon: <Hotel size={16} color="white" /> };
      case 'location':
        return { bgColor: SUCCESS, icon: <MapPin size={16} color="white" /> };
      case 'nib':
        return { bgColor: WARNING, icon: <FileText size={16} color="white" /> };
      case 'chse':
        return { bgColor: WARNING, icon: <Check size={16} color="white" /> };
      default:
        return { bgColor: PRIMARY, icon: <AlertCircle size={16} color="white" /> };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-primary text-white shadow-md relative" style={{ backgroundColor: PRIMARY }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-0">MICE ID INVENTORY</h1>
              <p className="text-sm opacity-80">Professional Data Management for Business</p>
            </div>
            <div className="flex items-center">
              <button className="bg-white text-primary px-3 py-2 rounded-lg flex items-center">
                <User size={18} className="mr-2" />
                <span>Hotel Manager</span>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: ACCENT }}></div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 border-b-4" style={{ backgroundColor: PRIMARY, borderColor: ACCENT }}>
                <h5 className="font-bold text-white">Menu Hotel</h5>
              </div>
              <div className="p-2">
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-primary bg-gray-100 border-l-4 font-medium rounded" 
                       style={{ color: PRIMARY, borderColor: ACCENT }}>
                      <BarChart2 size={18} className="mr-3" /> Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="../form/" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded">
                      <Hotel size={18} className="mr-3" /> Informasi Hotel
                    </a>
                  </li>
                  <li>
                    <a href="../room/" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded">
                      <Bed size={18} className="mr-3" /> Data Kamar
                    </a>
                  </li>
                  <li>
                    <a href="../mice-management/" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded">
                      <Layout size={18} className="mr-3" /> Ruang Meeting
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded">
                      <Map size={18} className="mr-3" /> Peta Lokasi
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded">
                      <Image size={18} className="mr-3" /> Galeri Foto
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded">
                      <Settings size={18} className="mr-3" /> Pengaturan
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Hotel Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="text-center p-6 relative" style={{ backgroundColor: PRIMARY }}>
                <div className="w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center text-3xl mx-auto mb-3" style={{ color: PRIMARY, border: `3px solid ${ACCENT}` }}>
                  <Hotel size={40} />
                </div>
                <h4 className="font-bold text-white">{hotel.name}</h4>
                <p className="text-sm text-gray-200">Malang, Jawa Timur</p>
                <div className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs" style={{ backgroundColor: `${WARNING}20`, color: WARNING }}>
                  <Clock size={12} className="mr-1" /> Menunggu Verifikasi
                </div>
              </div>
              <div className="p-4">
                <div className="flex mb-2">
                  <Briefcase size={16} className="mr-2 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-sm">{hotel.company}</p>
                </div>
                <div className="flex mb-2">
                  <FileText size={16} className="mr-2 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-sm">NIB: {hotel.nib}</p>
                </div>
                <div className="flex mb-2">
                  <Check size={16} className="mr-2 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-sm">CHSE: {hotel.chse}</p>
                </div>
                <div className="flex mb-2">
                  <Star size={16} className="mr-2 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-sm">{hotel.classification}</p>
                </div>
                <div className="flex mb-2">
                  <MapPin size={16} className="mr-2 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-sm">{hotel.location}</p>
                </div>
                <div className="flex mb-2">
                  <Phone size={16} className="mr-2 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-sm">{hotel.phoneNumber}</p>
                </div>
                <div className="flex mb-2">
                  <Mail size={16} className="mr-2 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-sm">{hotel.email}</p>
                </div>
                <a href="../form/index.html" className="w-full block mt-3 text-center text-white p-2 rounded hover:bg-opacity-90 transition-colors" 
                   style={{ backgroundColor: PRIMARY }}>
                  <FileText size={16} className="inline mr-2" /> Edit Informasi Hotel
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-4/5">
            {/* Welcome Section */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: PRIMARY }}>Selamat Datang di Dashboard</h2>
                <p className="text-gray-600">
                  Hotel Mulia Malang | Terakhir diperbarui: {new Date().toLocaleString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statCards.map((card, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: card.color }}>
                  <div className="flex items-center">
                    <div className="rounded-full p-3 mr-4" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{card.title}</p>
                      <div className="flex items-center">
                        <p className="text-xl font-bold" style={{ color: TEXT_DARK }}>{card.value}</p>
                        {card.change && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full" 
                                style={{ 
                                  backgroundColor: card.changeType === 'up' ? `${SUCCESS}20` : 
                                                  card.changeType === 'down' ? `${DANGER}20` : 
                                                  card.changeType === 'new' ? `${PRIMARY}20` : `${WARNING}20`,
                                  color: card.changeType === 'up' ? SUCCESS : 
                                        card.changeType === 'down' ? DANGER : 
                                        card.changeType === 'new' ? PRIMARY : WARNING
                                }}>
                            {card.change}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 border-b" style={{ backgroundColor: PRIMARY, borderColor: ACCENT }}>
                <h3 className="font-bold text-white flex items-center">
                  <MapPin size={18} className="mr-2" /> Lokasi Hotel & Tempat Terdekat
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Map */}
                  <div className="lg:col-span-2">
                    <div id="hotel-map" className="w-full h-64 lg:h-80 rounded-lg border" style={{ borderColor: MID_GRAY }}></div>
                  </div>
                  
                  {/* Nearby Places */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3" style={{ color: PRIMARY }}>Tempat Terdekat</h4>
                    <div className="space-y-3">
                      {nearbyPlaces.map((place, index) => (
                        <div key={index} className="p-3 rounded-lg border flex items-center" style={{ borderColor: MID_GRAY }}>
                          <div className="rounded-full p-2 mr-3 flex items-center justify-center" style={{ 
                            backgroundColor: place.type === 'airport' ? `${PRIMARY}20` :
                                            place.type === 'train_station' ? `${SUCCESS}20` :
                                            place.type === 'shopping_mall' ? `${ACCENT}20` : `${WARNING}20`,
                            color: place.type === 'airport' ? PRIMARY :
                                  place.type === 'train_station' ? SUCCESS :
                                  place.type === 'shopping_mall' ? ACCENT : WARNING,
                            width: "32px",
                            height: "32px"
                          }}>
                            {place.type === 'airport' ? <MapPin size={16} /> :
                            place.type === 'train_station' ? <MapPin size={16} /> :
                            place.type === 'shopping_mall' ? <MapPin size={16} /> : 
                            <MapPin size={16} />}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: TEXT_DARK }}>{place.name}</p>
                            <p className="text-xs" style={{ color: TEXT_MEDIUM }}>{place.distance}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Progress and Status Card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: MID_GRAY }}>
                  <h5 className="font-bold text-lg" style={{ color: PRIMARY }}>Status Kelengkapan Data</h5>
                  <div className="bg-primary text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center" 
                       style={{ backgroundColor: PRIMARY }}>
                    {totalProgress}%
                  </div>
                </div>
                <div className="p-4">
                  {progressData.map((item) => (
                    <div key={item.id} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium" style={{ color: TEXT_DARK }}>{item.name}</span>
                        <span className="font-medium" style={{ 
                          color: getStatusColor(item.progress >= 100 ? 'verified' : item.progress > 50 ? 'pending' : 'incomplete') 
                        }}>
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
                  <div className="text-sm mt-3" style={{ color: TEXT_MEDIUM }}>
                    Lengkapi semua bagian untuk mendapatkan verifikasi dari sistem
                  </div>
                </div>
              </div>

              {/* Verification Status Card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b" style={{ borderColor: MID_GRAY }}>
                  <h5 className="font-bold text-lg" style={{ color: PRIMARY }}>Status Verifikasi</h5>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {verifications.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3" 
                             style={{ 
                               backgroundColor: `${getStatusColor(item.status)}20`, 
                               color: getStatusColor(item.status) 
                             }}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h6 className="font-medium">{item.name}</h6>
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2 py-1 text-xs rounded font-medium mr-2" 
                                  style={{ 
                                    backgroundColor: `${getStatusColor(item.status)}20`, 
                                    color: getStatusColor(item.status) 
                                  }}>
                              {getStatusBadge(item.status)}
                            </span>
                            <span className="text-sm" style={{ color: TEXT_MEDIUM }}>{item.message}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: MID_GRAY }}>
                <h5 className="font-bold text-lg" style={{ color: PRIMARY }}>Aktivitas Terbaru</h5>
                <button className="px-3 py-1 rounded text-sm text-white" style={{ backgroundColor: PRIMARY }}>
                  Lihat Semua
                </button>
              </div>
              <div className="p-4">
                {activities.map((activity, index) => {
                  const { bgColor, icon } = getActivityDetails(activity.type);
                  return (
                    <div key={activity.id} className="flex mb-4 last:mb-0">
                      <div className="flex-shrink-0 mr-4 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                          {icon}
                        </div>
                        {index < activities.length - 1 && (
                          <div className="w-0.5 h-full my-2" style={{ backgroundColor: MID_GRAY }}></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h6 className="font-medium" style={{ color: TEXT_DARK }}>{activity.title}</h6>
                          <small className="ml-auto" style={{ color: TEXT_MEDIUM }}>{activity.time}</small>
                        </div>
                        <p className="text-sm" style={{ color: TEXT_MEDIUM }}>{activity.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 py-4 relative" style={{ backgroundColor: PRIMARY }}>
        <div className="border-b mb-4" style={{ borderColor: ACCENT }}></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">&copy; 2025 MICE ID INVENTORY. All rights reserved.</p>
            <div className="flex mt-2 md:mt-0">
              <a href="#" className="text-white text-sm hover:text-accent mr-4">
                <Mail size={14} className="inline mr-1" /> Kontak
              </a>
              <a href="#" className="text-white text-sm hover:text-accent">
                <AlertCircle size={14} className="inline mr-1" /> Bantuan
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}