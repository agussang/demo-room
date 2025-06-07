import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
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
        { id: 'venue', name: 'Data MICE', progress: 0 },
        { id: 'facilities', name: 'Fasilitas Hotel', progress: 50 },
        { id: 'gallery', name: 'Galeri Foto', progress: 30 },
    ]);
    // Calculate total completion percentage
    const totalProgress = Math.round(progressData.reduce((sum, item) => sum + item.progress, 0) / progressData.length);
    // Recent activities
    const [activities, setActivities] = useState([
        { id: 1, type: 'registration', title: 'Pendaftaran Hotel', time: '2 jam yang lalu', description: 'Hotel Mulia Malang berhasil didaftarkan dalam sistem MICE ID INVENTORY' },
        { id: 2, type: 'location', title: 'Lokasi Terverifikasi', time: '1.5 jam yang lalu', description: 'Koordinat lokasi hotel berhasil diverifikasi dan disimpan dalam sistem' },
        { id: 3, type: 'nib', title: 'Verifikasi NIB', time: '1 jam yang lalu', description: 'Permohonan verifikasi NIB telah dikirim. Menunggu proses verifikasi' },
        { id: 4, type: 'chse', title: 'Verifikasi CHSE', time: '1 jam yang lalu', description: 'Permohonan verifikasi sertifikat CHSE telah dikirim. Menunggu proses verifikasi' },
    ]);
    // Verification statuses
    const [verifications, setVerifications] = useState([
        { id: 'nib', name: 'NIB (Nomor Induk Berusaha)', status: 'pending', icon: _jsx(FileText, { size: 18 }), message: 'Proses verifikasi 1-2 hari kerja' },
        { id: 'chse', name: 'Sertifikat CHSE', status: 'pending', icon: _jsx(Check, { size: 18 }), message: 'Proses verifikasi 1-2 hari kerja' },
        { id: 'property', name: 'Data Property', status: 'incomplete', icon: _jsx(Hotel, { size: 18 }), message: 'Lengkapi data hotel' },
        { id: 'location', name: 'Lokasi', status: 'verified', icon: _jsx(MapPin, { size: 18 }), message: 'Koordinat tersimpan' },
    ]);
    // Stat cards for dashboard
    const statCards = [
        { title: 'Total Kamar', value: 50, icon: _jsx(Bed, { size: 24 }), color: PRIMARY, change: '+5', changeType: 'up' },
        { title: 'Total Venue', value: 3, icon: _jsx(Layout, { size: 24 }), color: ACCENT, change: 'Baru', changeType: 'new' },
        { title: 'Kelengkapan Data', value: `${totalProgress}%`, icon: _jsx(FileText, { size: 24 }), color: WARNING, change: '+8%', changeType: 'up' },
        { title: 'Status', value: 'Menunggu', icon: _jsx(Clock, { size: 24 }), color: SUCCESS, change: '1-2 hari', changeType: 'time' }
    ];
    // State for Google Maps
    const [mapLoaded, setMapLoaded] = useState(false);
    const [nearbyPlaces, setNearbyPlaces] = useState([
        { name: 'Bandara Abdulrachman Saleh', type: 'airport', distance: '12.5 km' },
        { name: 'Stasiun Malang', type: 'train_station', distance: '3.2 km' },
        { name: 'Mall Olympic Garden', type: 'shopping_mall', distance: '1.8 km' },
        { name: 'RS Saiful Anwar', type: 'hospital', distance: '2.4 km' }
    ]);
    // Effect to initialize Google Maps
    useEffect(() => {
        // Function to load Google Maps script
        const loadGoogleMapsScript = () => {
            const googleWindow = window;
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
        if (!mapLoaded)
            return;
        const initializeMap = () => {
            const mapElement = document.getElementById('hotel-map');
            if (!mapElement)
                return;
            // Type casting window to include google property
            const googleWindow = window;
            if (!googleWindow.google)
                return;
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
    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return SUCCESS;
            case 'pending': return WARNING;
            case 'incomplete':
            case 'rejected': return DANGER;
            default: return WARNING;
        }
    };
    // Helper function for status badges
    const getStatusBadge = (status) => {
        switch (status) {
            case 'verified': return 'Terverifikasi';
            case 'pending': return 'Menunggu';
            case 'incomplete': return 'Belum Lengkap';
            case 'rejected': return 'Ditolak';
            default: return 'Menunggu';
        }
    };
    // Get activity icon background and icon based on type
    const getActivityDetails = (type) => {
        switch (type) {
            case 'registration':
                return { bgColor: PRIMARY, icon: _jsx(Hotel, { size: 16, color: "white" }) };
            case 'location':
                return { bgColor: SUCCESS, icon: _jsx(MapPin, { size: 16, color: "white" }) };
            case 'nib':
                return { bgColor: WARNING, icon: _jsx(FileText, { size: 16, color: "white" }) };
            case 'chse':
                return { bgColor: WARNING, icon: _jsx(Check, { size: 16, color: "white" }) };
            default:
                return { bgColor: PRIMARY, icon: _jsx(AlertCircle, { size: 16, color: "white" }) };
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 font-sans", children: [_jsxs("header", { className: "bg-primary text-white shadow-md relative", style: { backgroundColor: PRIMARY }, children: [_jsx("div", { className: "container mx-auto px-4 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-0", children: "MICE ID INVENTORY" }), _jsx("p", { className: "text-sm opacity-80", children: "Professional Data Management for Business" })] }), _jsx("div", { className: "flex items-center", children: _jsxs("button", { className: "bg-white text-primary px-3 py-2 rounded-lg flex items-center", children: [_jsx(User, { size: 18, className: "mr-2" }), _jsx("span", { children: "Hotel Manager" })] }) })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 w-full h-1", style: { backgroundColor: ACCENT } })] }), _jsx("div", { className: "container mx-auto px-4 py-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [_jsxs("div", { className: "lg:w-1/5", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden mb-6", children: [_jsx("div", { className: "p-4 border-b-4", style: { backgroundColor: PRIMARY, borderColor: ACCENT }, children: _jsx("h5", { className: "font-bold text-white", children: "Menu Hotel" }) }), _jsx("div", { className: "p-2", children: _jsxs("ul", { className: "space-y-1", children: [_jsx("li", { children: _jsxs("a", { href: "#", className: "flex items-center px-4 py-2 text-primary bg-gray-100 border-l-4 font-medium rounded", style: { color: PRIMARY, borderColor: ACCENT }, children: [_jsx(BarChart2, { size: 18, className: "mr-3" }), " Dashboard"] }) }), _jsx("li", { children: _jsxs("a", { href: "../form/", className: "flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded", children: [_jsx(Hotel, { size: 18, className: "mr-3" }), " Informasi Hotel"] }) }), _jsx("li", { children: _jsxs("a", { href: "../room/", className: "flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded", children: [_jsx(Bed, { size: 18, className: "mr-3" }), " Data Kamar"] }) }), _jsx("li", { children: _jsxs("a", { href: "../venue/index.html", className: "flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded", children: [_jsx(Layout, { size: 18, className: "mr-3" }), " Data MICE"] }) }), _jsx("li", { children: _jsxs("a", { href: "#", className: "flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded", children: [_jsx(Map, { size: 18, className: "mr-3" }), " Peta Lokasi"] }) }), _jsx("li", { children: _jsxs("a", { href: "#", className: "flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded", children: [_jsx(Image, { size: 18, className: "mr-3" }), " Galeri Foto"] }) }), _jsx("li", { children: _jsxs("a", { href: "#", className: "flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-l-4 transition-colors rounded", children: [_jsx(Settings, { size: 18, className: "mr-3" }), " Pengaturan"] }) })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [_jsxs("div", { className: "text-center p-6 relative", style: { backgroundColor: PRIMARY }, children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center text-3xl mx-auto mb-3", style: { color: PRIMARY, border: `3px solid ${ACCENT}` }, children: _jsx(Hotel, { size: 40 }) }), _jsx("h4", { className: "font-bold text-white", children: hotel.name }), _jsx("p", { className: "text-sm text-gray-200", children: "Malang, Jawa Timur" }), _jsxs("div", { className: "inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs", style: { backgroundColor: `${WARNING}20`, color: WARNING }, children: [_jsx(Clock, { size: 12, className: "mr-1" }), " Menunggu Verifikasi"] })] }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex mb-2", children: [_jsx(Briefcase, { size: 16, className: "mr-2 flex-shrink-0", style: { color: ACCENT } }), _jsx("p", { className: "text-sm", children: hotel.company })] }), _jsxs("div", { className: "flex mb-2", children: [_jsx(FileText, { size: 16, className: "mr-2 flex-shrink-0", style: { color: ACCENT } }), _jsxs("p", { className: "text-sm", children: ["NIB: ", hotel.nib] })] }), _jsxs("div", { className: "flex mb-2", children: [_jsx(Check, { size: 16, className: "mr-2 flex-shrink-0", style: { color: ACCENT } }), _jsxs("p", { className: "text-sm", children: ["CHSE: ", hotel.chse] })] }), _jsxs("div", { className: "flex mb-2", children: [_jsx(Star, { size: 16, className: "mr-2 flex-shrink-0", style: { color: ACCENT } }), _jsx("p", { className: "text-sm", children: hotel.classification })] }), _jsxs("div", { className: "flex mb-2", children: [_jsx(MapPin, { size: 16, className: "mr-2 flex-shrink-0", style: { color: ACCENT } }), _jsx("p", { className: "text-sm", children: hotel.location })] }), _jsxs("div", { className: "flex mb-2", children: [_jsx(Phone, { size: 16, className: "mr-2 flex-shrink-0", style: { color: ACCENT } }), _jsx("p", { className: "text-sm", children: hotel.phoneNumber })] }), _jsxs("div", { className: "flex mb-2", children: [_jsx(Mail, { size: 16, className: "mr-2 flex-shrink-0", style: { color: ACCENT } }), _jsx("p", { className: "text-sm", children: hotel.email })] }), _jsxs("a", { href: "../form/index.html", className: "w-full block mt-3 text-center text-white p-2 rounded hover:bg-opacity-90 transition-colors", style: { backgroundColor: PRIMARY }, children: [_jsx(FileText, { size: 16, className: "inline mr-2" }), " Edit Informasi Hotel"] })] })] })] }), _jsxs("div", { className: "lg:w-4/5", children: [_jsx("div", { className: "flex justify-between items-center mb-6", children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-2", style: { color: PRIMARY }, children: "Selamat Datang di Dashboard" }), _jsxs("p", { className: "text-gray-600", children: ["Hotel Mulia Malang | Terakhir diperbarui: ", new Date().toLocaleString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: statCards.map((card, index) => (_jsx("div", { className: "bg-white p-4 rounded-lg shadow-md border-l-4", style: { borderLeftColor: card.color }, children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "rounded-full p-3 mr-4", style: { backgroundColor: `${card.color}20`, color: card.color }, children: card.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: card.title }), _jsxs("div", { className: "flex items-center", children: [_jsx("p", { className: "text-xl font-bold", style: { color: TEXT_DARK }, children: card.value }), card.change && (_jsx("span", { className: "ml-2 text-xs px-2 py-1 rounded-full", style: {
                                                                        backgroundColor: card.changeType === 'up' ? `${SUCCESS}20` :
                                                                            card.changeType === 'down' ? `${DANGER}20` :
                                                                                card.changeType === 'new' ? `${PRIMARY}20` : `${WARNING}20`,
                                                                        color: card.changeType === 'up' ? SUCCESS :
                                                                            card.changeType === 'down' ? DANGER :
                                                                                card.changeType === 'new' ? PRIMARY : WARNING
                                                                    }, children: card.change }))] })] })] }) }, index))) }), _jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden mb-6", children: [_jsx("div", { className: "p-4 border-b", style: { backgroundColor: PRIMARY, borderColor: ACCENT }, children: _jsxs("h3", { className: "font-bold text-white flex items-center", children: [_jsx(MapPin, { size: 18, className: "mr-2" }), " Lokasi Hotel & Tempat Terdekat"] }) }), _jsx("div", { className: "p-4", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx("div", { id: "hotel-map", className: "w-full h-64 lg:h-80 rounded-lg border", style: { borderColor: MID_GRAY } }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold mb-3", style: { color: PRIMARY }, children: "Tempat Terdekat" }), _jsx("div", { className: "space-y-3", children: nearbyPlaces.map((place, index) => (_jsxs("div", { className: "p-3 rounded-lg border flex items-center", style: { borderColor: MID_GRAY }, children: [_jsx("div", { className: "rounded-full p-2 mr-3 flex items-center justify-center", style: {
                                                                                backgroundColor: place.type === 'airport' ? `${PRIMARY}20` :
                                                                                    place.type === 'train_station' ? `${SUCCESS}20` :
                                                                                        place.type === 'shopping_mall' ? `${ACCENT}20` : `${WARNING}20`,
                                                                                color: place.type === 'airport' ? PRIMARY :
                                                                                    place.type === 'train_station' ? SUCCESS :
                                                                                        place.type === 'shopping_mall' ? ACCENT : WARNING,
                                                                                width: "32px",
                                                                                height: "32px"
                                                                            }, children: place.type === 'airport' ? _jsx(MapPin, { size: 16 }) :
                                                                                place.type === 'train_station' ? _jsx(MapPin, { size: 16 }) :
                                                                                    place.type === 'shopping_mall' ? _jsx(MapPin, { size: 16 }) :
                                                                                        _jsx(MapPin, { size: 16 }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", style: { color: TEXT_DARK }, children: place.name }), _jsx("p", { className: "text-xs", style: { color: TEXT_MEDIUM }, children: place.distance })] })] }, index))) })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b flex justify-between items-center", style: { borderColor: MID_GRAY }, children: [_jsx("h5", { className: "font-bold text-lg", style: { color: PRIMARY }, children: "Status Kelengkapan Data" }), _jsxs("div", { className: "bg-primary text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center", style: { backgroundColor: PRIMARY }, children: [totalProgress, "%"] })] }), _jsxs("div", { className: "p-4", children: [progressData.map((item) => (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-medium", style: { color: TEXT_DARK }, children: item.name }), _jsxs("span", { className: "font-medium", style: {
                                                                                color: getStatusColor(item.progress >= 100 ? 'verified' : item.progress > 50 ? 'pending' : 'incomplete')
                                                                            }, children: [item.progress, "%"] })] }), _jsx("div", { className: "h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full rounded-full", style: {
                                                                            width: `${item.progress}%`,
                                                                            backgroundColor: item.progress >= 100 ? SUCCESS : item.progress > 50 ? WARNING : PRIMARY
                                                                        } }) })] }, item.id))), _jsx("div", { className: "text-sm mt-3", style: { color: TEXT_MEDIUM }, children: "Lengkapi semua bagian untuk mendapatkan verifikasi dari sistem" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [_jsx("div", { className: "p-4 border-b", style: { borderColor: MID_GRAY }, children: _jsx("h5", { className: "font-bold text-lg", style: { color: PRIMARY }, children: "Status Verifikasi" }) }), _jsx("div", { className: "p-4", children: _jsx("div", { className: "space-y-4", children: verifications.map((item) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3", style: {
                                                                        backgroundColor: `${getStatusColor(item.status)}20`,
                                                                        color: getStatusColor(item.status)
                                                                    }, children: item.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("h6", { className: "font-medium", children: item.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "inline-flex items-center px-2 py-1 text-xs rounded font-medium mr-2", style: {
                                                                                        backgroundColor: `${getStatusColor(item.status)}20`,
                                                                                        color: getStatusColor(item.status)
                                                                                    }, children: getStatusBadge(item.status) }), _jsx("span", { className: "text-sm", style: { color: TEXT_MEDIUM }, children: item.message })] })] })] }, item.id))) }) })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b flex justify-between items-center", style: { borderColor: MID_GRAY }, children: [_jsx("h5", { className: "font-bold text-lg", style: { color: PRIMARY }, children: "Aktivitas Terbaru" }), _jsx("button", { className: "px-3 py-1 rounded text-sm text-white", style: { backgroundColor: PRIMARY }, children: "Lihat Semua" })] }), _jsx("div", { className: "p-4", children: activities.map((activity, index) => {
                                                const { bgColor, icon } = getActivityDetails(activity.type);
                                                return (_jsxs("div", { className: "flex mb-4 last:mb-0", children: [_jsxs("div", { className: "flex-shrink-0 mr-4 flex flex-col items-center", children: [_jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center", style: { backgroundColor: bgColor }, children: icon }), index < activities.length - 1 && (_jsx("div", { className: "w-0.5 h-full my-2", style: { backgroundColor: MID_GRAY } }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx("h6", { className: "font-medium", style: { color: TEXT_DARK }, children: activity.title }), _jsx("small", { className: "ml-auto", style: { color: TEXT_MEDIUM }, children: activity.time })] }), _jsx("p", { className: "text-sm", style: { color: TEXT_MEDIUM }, children: activity.description })] })] }, activity.id));
                                            }) })] })] })] }) }), _jsxs("footer", { className: "mt-8 py-4 relative", style: { backgroundColor: PRIMARY }, children: [_jsx("div", { className: "border-b mb-4", style: { borderColor: ACCENT } }), _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center", children: [_jsx("p", { className: "text-sm text-gray-300", children: "\u00A9 2025 MICE ID INVENTORY. All rights reserved." }), _jsxs("div", { className: "flex mt-2 md:mt-0", children: [_jsxs("a", { href: "#", className: "text-white text-sm hover:text-accent mr-4", children: [_jsx(Mail, { size: 14, className: "inline mr-1" }), " Kontak"] }), _jsxs("a", { href: "#", className: "text-white text-sm hover:text-accent", children: [_jsx(AlertCircle, { size: 14, className: "inline mr-1" }), " Bantuan"] })] })] }) })] })] }));
}
