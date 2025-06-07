import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Layout, ChevronRight, ChevronLeft, Save, Calendar, Users, Maximize, Wifi, PlusCircle, Edit, Trash2, Check, Upload, Image, Info, ArrowLeft } from 'lucide-react';
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
export default function MICEmanagement() {
    // State for managing current step
    const [currentStep, setCurrentStep] = useState(1);
    // State for MICE venues
    const [venues, setVenues] = useState([
        {
            id: 1,
            name: "Ballroom Malang",
            type: "Ballroom",
            capacity: {
                theater: 200,
                classroom: 120,
                ushape: 50,
                boardroom: 40,
                banquet: 150,
                reception: 250
            },
            dimensions: {
                area: 250,
                length: 25,
                width: 10,
                height: 4.5
            },
            specifications: {
                audioVisual: true,
                lighting: true,
                soundproofing: true,
                stage: true,
                flooring: "Marble"
            },
            connectivity: {
                wifi: true,
                bandwidth: 100,
                powerOutlets: 20,
                backup: true
            },
            support: {
                technicalStaff: true,
                eventPlanning: true,
                catering: true
            },
            facilities: {
                preFunction: true,
                businessCenter: true,
                secretariat: true,
                vipRoom: true,
                registration: true,
                exhibition: true
            },
            notes: "Ballroom utama hotel dengan fasilitas lengkap",
            image: null
        },
        {
            id: 2,
            name: "Meeting Room A",
            type: "Meeting Room",
            capacity: {
                theater: 50,
                classroom: 30,
                ushape: 20,
                boardroom: 16,
                banquet: 0,
                reception: 60
            },
            dimensions: {
                area: 75,
                length: 15,
                width: 5,
                height: 3
            },
            specifications: {
                audioVisual: true,
                lighting: false,
                soundproofing: false,
                stage: false,
                flooring: "Carpet"
            },
            connectivity: {
                wifi: true,
                bandwidth: 50,
                powerOutlets: 10,
                backup: false
            },
            support: {
                technicalStaff: false,
                eventPlanning: false,
                catering: true
            },
            facilities: {
                preFunction: false,
                businessCenter: false,
                secretariat: false,
                vipRoom: false,
                registration: true,
                exhibition: false
            },
            notes: "Ruang rapat kecil untuk pertemuan bisnis",
            image: null
        }
    ]);
    // State for form data
    const [formData, setFormData] = useState({
        name: "",
        type: "Meeting Room",
        capacity: {
            theater: 0,
            classroom: 0,
            ushape: 0,
            boardroom: 0,
            banquet: 0,
            reception: 0
        },
        dimensions: {
            area: 0,
            length: 0,
            width: 0,
            height: 0
        },
        specifications: {
            audioVisual: false,
            lighting: false,
            soundproofing: false,
            stage: false,
            flooring: "Carpet"
        },
        connectivity: {
            wifi: false,
            bandwidth: 0,
            powerOutlets: 0,
            backup: false
        },
        support: {
            technicalStaff: false,
            eventPlanning: false,
            catering: false
        },
        facilities: {
            preFunction: false,
            businessCenter: false,
            secretariat: false,
            vipRoom: false,
            registration: false,
            exhibition: false
        },
        notes: "",
        image: null
    });
    // State for editing
    const [editId, setEditId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(Object.assign(Object.assign({}, formData), { [parent]: Object.assign(Object.assign({}, formData[parent]), { [child]: type === 'checkbox' ? checked : value }) }));
        }
        else {
            setFormData(Object.assign(Object.assign({}, formData), { [name]: type === 'checkbox' ? checked : value }));
        }
    };
    // Handle capacity input changes
    const handleCapacityChange = (e) => {
        const { name, value } = e.target;
        setFormData(Object.assign(Object.assign({}, formData), { capacity: Object.assign(Object.assign({}, formData.capacity), { [name]: parseInt(value) || 0 }) }));
    };
    // Handle dimensions input changes
    const handleDimensionsChange = (e) => {
        const { name, value } = e.target;
        // Calculate area automatically if length and width are changed
        if (name === 'length' || name === 'width') {
            const length = name === 'length' ? parseFloat(value) || 0 : formData.dimensions.length;
            const width = name === 'width' ? parseFloat(value) || 0 : formData.dimensions.width;
            setFormData(Object.assign(Object.assign({}, formData), { dimensions: Object.assign(Object.assign({}, formData.dimensions), { [name]: parseFloat(value) || 0, area: length * width }) }));
        }
        else {
            setFormData(Object.assign(Object.assign({}, formData), { dimensions: Object.assign(Object.assign({}, formData.dimensions), { [name]: parseFloat(value) || 0 }) }));
        }
    };
    // Handle specifications changes
    const handleSpecificationsChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setFormData(Object.assign(Object.assign({}, formData), { specifications: Object.assign(Object.assign({}, formData.specifications), { [name]: type === 'checkbox' ? checked : value }) }));
    };
    // Handle connectivity changes
    const handleConnectivityChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setFormData(Object.assign(Object.assign({}, formData), { connectivity: Object.assign(Object.assign({}, formData.connectivity), { [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value) }) }));
    };
    // Handle support changes
    const handleSupportChange = (e) => {
        const { name, checked } = e.target;
        setFormData(Object.assign(Object.assign({}, formData), { support: Object.assign(Object.assign({}, formData.support), { [name]: checked }) }));
    };
    // Handle facilities changes
    const handleFacilitiesChange = (e) => {
        const { name, checked } = e.target;
        setFormData(Object.assign(Object.assign({}, formData), { facilities: Object.assign(Object.assign({}, formData.facilities), { [name]: checked }) }));
    };
    // Clear form
    const clearForm = () => {
        setFormData({
            name: "",
            type: "Meeting Room",
            capacity: {
                theater: 0,
                classroom: 0,
                ushape: 0,
                boardroom: 0,
                banquet: 0,
                reception: 0
            },
            dimensions: {
                area: 0,
                length: 0,
                width: 0,
                height: 0
            },
            specifications: {
                audioVisual: false,
                lighting: false,
                soundproofing: false,
                stage: false,
                flooring: "Carpet"
            },
            connectivity: {
                wifi: false,
                bandwidth: 0,
                powerOutlets: 0,
                backup: false
            },
            support: {
                technicalStaff: false,
                eventPlanning: false,
                catering: false
            },
            facilities: {
                preFunction: false,
                businessCenter: false,
                secretariat: false,
                vipRoom: false,
                registration: false,
                exhibition: false
            },
            notes: "",
            image: null
        });
        setEditId(null);
        setIsEditing(false);
        setCurrentStep(1);
    };
    // Save venue
    const saveVenue = () => {
        if (isEditing) {
            // Update existing venue
            setVenues(venues.map(venue => venue.id === editId ? Object.assign(Object.assign({}, formData), { id: editId }) : venue));
        }
        else {
            // Add new venue
            const newId = venues.length ? Math.max(...venues.map(v => v.id)) + 1 : 1;
            setVenues([...venues, Object.assign(Object.assign({}, formData), { id: newId })]);
        }
        // Show success message (would add actual toast in real implementation)
        alert(isEditing ? "Venue updated successfully!" : "New venue added successfully!");
        // Reset form
        clearForm();
    };
    // Edit venue
    const editVenue = (id) => {
        const venueToEdit = venues.find(venue => venue.id === id);
        if (venueToEdit) {
            // Need to ensure we have all required properties
            const completeVenue = Object.assign(Object.assign(Object.assign({}, formData), venueToEdit), { 
                // Make sure these objects exist even if they're not in venueToEdit
                specifications: venueToEdit.specifications || formData.specifications, connectivity: venueToEdit.connectivity || formData.connectivity, support: venueToEdit.support || formData.support, facilities: venueToEdit.facilities || formData.facilities, notes: venueToEdit.notes || formData.notes });
            setFormData(completeVenue);
            setEditId(id);
            setIsEditing(true);
            setCurrentStep(1);
        }
    };
    // Delete venue
    const deleteVenue = (id) => {
        if (window.confirm("Are you sure you want to delete this venue?")) {
            setVenues(venues.filter(venue => venue.id !== id));
        }
    };
    // Next step
    const nextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };
    // Previous step
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    // Handle image upload
    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            // In a real implementation, you'd handle actual file upload
            // Here we just store the file object
            setFormData(Object.assign(Object.assign({}, formData), { image: file }));
        }
    };
    // Render form step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (_jsxs("div", { children: [_jsxs("div", { className: "form-header mb-4", children: [_jsxs("h3", { className: "font-bold text-xl", style: { color: PRIMARY }, children: [_jsx(Layout, { className: "inline mr-2" }), "Jumlah Ruang Meeting/Konferensi"] }), _jsx("p", { className: "text-gray-600", children: "Masukkan informasi umum ruangan MICE" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-gray-700 font-medium mb-2", children: ["Nama Ruangan ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Contoh: Ballroom Malang", required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-gray-700 font-medium mb-2", children: ["Tipe Ruangan ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { name: "type", value: formData.type, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "Meeting Room", children: "Meeting Room" }), _jsx("option", { value: "Ballroom", children: "Ballroom" }), _jsx("option", { value: "Function Room", children: "Function Room" }), _jsx("option", { value: "Board Room", children: "Board Room" }), _jsx("option", { value: "Conference Hall", children: "Conference Hall" })] })] })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start", children: [_jsx(Info, { className: "text-blue-500 mt-1 mr-2 flex-shrink-0", size: 20 }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-blue-700", children: "Tips pengisian data" }), _jsx("p", { className: "text-sm text-blue-600 mt-1", children: "Pastikan mengisi nama yang unik dan deskriptif untuk memudahkan identifikasi ruangan. Contoh: \"Ballroom Malang\", \"Meeting Room Executive\", dsb." })] })] }) }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Upload Foto Ruangan" }), _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center", children: [_jsx("input", { type: "file", id: "room-image", className: "hidden", accept: "image/*", onChange: handleImageUpload }), _jsxs("label", { htmlFor: "room-image", className: "cursor-pointer", children: [_jsx("div", { className: "mb-3", children: _jsx(Upload, { className: "inline-block text-gray-400", size: 48 }) }), _jsx("p", { className: "text-gray-500 mb-1", children: "Klik untuk upload foto ruangan" }), _jsx("p", { className: "text-xs text-gray-400", children: "Format: JPG, PNG (Maks. 5MB)" })] }), formData.image && (_jsx("div", { className: "mt-3 text-left", children: _jsxs("p", { className: "text-green-600 flex items-center", children: [_jsx(Check, { size: 16, className: "mr-1" }), " ", formData.image.name || "Foto terupload"] }) }))] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Catatan Tambahan" }), _jsx("textarea", { name: "notes", value: formData.notes, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 3, placeholder: "Informasi tambahan tentang ruangan..." })] })] }));
            case 2:
                return (_jsxs("div", { children: [_jsxs("div", { className: "form-header mb-4", children: [_jsxs("h3", { className: "font-bold text-xl", style: { color: PRIMARY }, children: [_jsx(Users, { className: "inline mr-2" }), "Kapasitas Ruangan per Konfigurasi"] }), _jsx("p", { className: "text-gray-600", children: "Masukkan kapasitas untuk berbagai konfigurasi ruangan" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 border rounded-lg bg-white", children: [_jsxs("div", { className: "text-center mb-3", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2", children: _jsx(Users, { size: 24, className: "text-blue-700" }) }), _jsx("h4", { className: "font-medium", children: "Theater Style" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", name: "theater", value: formData.capacity.theater, onChange: handleCapacityChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", placeholder: "0" }), _jsx("span", { className: "absolute right-3 top-2 text-gray-500", children: "orang" })] }), _jsx("p", { className: "text-xs text-gray-500 text-center mt-2", children: "Tempat duduk menghadap ke satu arah" })] }), _jsxs("div", { className: "p-4 border rounded-lg bg-white", children: [_jsxs("div", { className: "text-center mb-3", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2", children: _jsx(Users, { size: 24, className: "text-blue-700" }) }), _jsx("h4", { className: "font-medium", children: "Classroom Style" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", name: "classroom", value: formData.capacity.classroom, onChange: handleCapacityChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", placeholder: "0" }), _jsx("span", { className: "absolute right-3 top-2 text-gray-500", children: "orang" })] }), _jsx("p", { className: "text-xs text-gray-500 text-center mt-2", children: "Tempat duduk dengan meja" })] }), _jsxs("div", { className: "p-4 border rounded-lg bg-white", children: [_jsxs("div", { className: "text-center mb-3", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2", children: _jsx(Users, { size: 24, className: "text-blue-700" }) }), _jsx("h4", { className: "font-medium", children: "U-Shape Style" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", name: "ushape", value: formData.capacity.ushape, onChange: handleCapacityChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", placeholder: "0" }), _jsx("span", { className: "absolute right-3 top-2 text-gray-500", children: "orang" })] }), _jsx("p", { className: "text-xs text-gray-500 text-center mt-2", children: "Meja dan kursi bentuk U" })] }), _jsxs("div", { className: "p-4 border rounded-lg bg-white", children: [_jsxs("div", { className: "text-center mb-3", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2", children: _jsx(Users, { size: 24, className: "text-blue-700" }) }), _jsx("h4", { className: "font-medium", children: "Boardroom Style" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", name: "boardroom", value: formData.capacity.boardroom, onChange: handleCapacityChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", placeholder: "0" }), _jsx("span", { className: "absolute right-3 top-2 text-gray-500", children: "orang" })] }), _jsx("p", { className: "text-xs text-gray-500 text-center mt-2", children: "Satu meja besar dengan kursi di sekeliling" })] }), _jsxs("div", { className: "p-4 border rounded-lg bg-white", children: [_jsxs("div", { className: "text-center mb-3", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2", children: _jsx(Users, { size: 24, className: "text-blue-700" }) }), _jsx("h4", { className: "font-medium", children: "Banquet Style" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", name: "banquet", value: formData.capacity.banquet, onChange: handleCapacityChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", placeholder: "0" }), _jsx("span", { className: "absolute right-3 top-2 text-gray-500", children: "orang" })] }), _jsx("p", { className: "text-xs text-gray-500 text-center mt-2", children: "Meja bundar untuk jamuan makan" })] }), _jsxs("div", { className: "p-4 border rounded-lg bg-white", children: [_jsxs("div", { className: "text-center mb-3", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2", children: _jsx(Users, { size: 24, className: "text-blue-700" }) }), _jsx("h4", { className: "font-medium", children: "Reception Style" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", name: "reception", value: formData.capacity.reception, onChange: handleCapacityChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", placeholder: "0" }), _jsx("span", { className: "absolute right-3 top-2 text-gray-500", children: "orang" })] }), _jsx("p", { className: "text-xs text-gray-500 text-center mt-2", children: "Standing (berdiri) untuk resepsi" })] })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start", children: [_jsx(Info, { className: "text-yellow-500 mt-1 mr-2 flex-shrink-0", size: 20 }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-yellow-700", children: "Rekomendasi Kapasitas" }), _jsx("p", { className: "text-sm text-yellow-600 mt-1", children: "Anda tidak perlu mengisi semua konfigurasi. Isi sesuai dengan konfigurasi yang tersedia untuk ruangan ini." })] })] }) })] }));
            case 3:
                return (_jsxs("div", { children: [_jsxs("div", { className: "form-header mb-4", children: [_jsxs("h3", { className: "font-bold text-xl", style: { color: PRIMARY }, children: [_jsx(Maximize, { className: "inline mr-2" }), "Dimensi dan Spesifikasi Ruangan"] }), _jsx("p", { className: "text-gray-600", children: "Masukkan ukuran dan spesifikasi teknis ruangan" })] }), _jsxs("div", { className: "mb-5", children: [_jsx("h4", { className: "font-medium text-lg mb-3", style: { color: PRIMARY }, children: "Dimensi Ruangan" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 text-sm font-medium mb-2", children: "Luas Ruangan (m\u00B2)" }), _jsx("input", { type: "number", name: "area", value: formData.dimensions.area, onChange: handleDimensionsChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", step: "0.1", readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 text-sm font-medium mb-2", children: "Panjang (m)" }), _jsx("input", { type: "number", name: "length", value: formData.dimensions.length, onChange: handleDimensionsChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", step: "0.1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 text-sm font-medium mb-2", children: "Lebar (m)" }), _jsx("input", { type: "number", name: "width", value: formData.dimensions.width, onChange: handleDimensionsChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", step: "0.1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 text-sm font-medium mb-2", children: "Tinggi (m)" }), _jsx("input", { type: "number", name: "height", value: formData.dimensions.height, onChange: handleDimensionsChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", step: "0.1" })] })] })] }), _jsxs("div", { className: "mb-5", children: [_jsx("h4", { className: "font-medium text-lg mb-3", style: { color: PRIMARY }, children: "Spesifikasi Teknis" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "audioVisual", checked: formData.specifications.audioVisual, onChange: handleSpecificationsChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Sistem Audio Visual Built-in" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "lighting", checked: formData.specifications.lighting, onChange: handleSpecificationsChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Sistem Pencahayaan Khusus" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "soundproofing", checked: formData.specifications.soundproofing, onChange: handleSpecificationsChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Soundproofing" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "stage", checked: formData.specifications.stage, onChange: handleSpecificationsChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Backdrop/Stage Area" })] }) }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-gray-700 text-sm font-medium mb-2", children: "Jenis Lantai" }), _jsxs("select", { name: "flooring", value: formData.specifications.flooring, onChange: handleSpecificationsChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "Carpet", children: "Karpet" }), _jsx("option", { value: "Marble", children: "Marmer" }), _jsx("option", { value: "Wood", children: "Kayu" }), _jsx("option", { value: "Vinyl", children: "Vinyl" }), _jsx("option", { value: "Ceramic", children: "Keramik" })] })] })] })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start", children: [_jsx(Info, { className: "text-blue-500 mt-1 mr-2 flex-shrink-0", size: 20 }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-blue-700", children: "Informasi Dimensi Ruangan" }), _jsx("p", { className: "text-sm text-blue-600 mt-1", children: "Luas ruangan akan dihitung otomatis berdasarkan panjang dan lebar yang dimasukkan." })] })] }) }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Upload Denah/Layout Ruangan" }), _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center", children: [_jsx("input", { type: "file", id: "room-layout", className: "hidden", accept: "image/*,.pdf" }), _jsxs("label", { htmlFor: "room-layout", className: "cursor-pointer", children: [_jsx("div", { className: "mb-3", children: _jsx(Image, { className: "inline-block text-gray-400", size: 48 }) }), _jsx("p", { className: "text-gray-500 mb-1", children: "Klik untuk upload denah ruangan" }), _jsx("p", { className: "text-xs text-gray-400", children: "Format: JPG, PNG, PDF (Maks. 5MB)" })] })] })] })] }));
            case 4:
                return (_jsxs("div", { children: [_jsxs("div", { className: "form-header mb-4", children: [_jsxs("h3", { className: "font-bold text-xl", style: { color: PRIMARY }, children: [_jsx(Wifi, { className: "inline mr-2" }), "Kapasitas Koneksi dan Fasilitas Pendukung"] }), _jsx("p", { className: "text-gray-600", children: "Masukkan informasi koneksi dan fasilitas pendukung MICE" })] }), _jsxs("div", { className: "mb-5", children: [_jsx("h4", { className: "font-medium text-lg mb-3", style: { color: PRIMARY }, children: "Koneksi Internet & Daya" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "wifi", checked: formData.connectivity.wifi, onChange: handleConnectivityChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Tersedia WiFi Khusus" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "backup", checked: formData.connectivity.backup, onChange: handleConnectivityChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Tersedia Generator Cadangan" })] }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 text-sm font-medium mb-2", children: "Bandwidth Internet (Mbps)" }), _jsx("input", { type: "number", name: "bandwidth", value: formData.connectivity.bandwidth, onChange: handleConnectivityChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 text-sm font-medium mb-2", children: "Jumlah Stop Kontak" }), _jsx("input", { type: "number", name: "powerOutlets", value: formData.connectivity.powerOutlets, onChange: handleConnectivityChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0" })] })] })] }), _jsxs("div", { className: "mb-5", children: [_jsx("h4", { className: "font-medium text-lg mb-3", style: { color: PRIMARY }, children: "Fasilitas Pendukung MICE" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "preFunction", checked: formData.facilities.preFunction, onChange: handleFacilitiesChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Pre-function Area" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "businessCenter", checked: formData.facilities.businessCenter, onChange: handleFacilitiesChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Business Center" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "secretariat", checked: formData.facilities.secretariat, onChange: handleFacilitiesChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Ruang Sekretariat" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "vipRoom", checked: formData.facilities.vipRoom, onChange: handleFacilitiesChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "VIP Room / Holding Room" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "registration", checked: formData.facilities.registration, onChange: handleFacilitiesChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Area Registrasi" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "exhibition", checked: formData.facilities.exhibition, onChange: handleFacilitiesChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Area Pameran" })] }) })] })] }), _jsxs("div", { className: "mb-5", children: [_jsx("h4", { className: "font-medium text-lg mb-3", style: { color: PRIMARY }, children: "Layanan MICE" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "technicalStaff", checked: formData.support.technicalStaff, onChange: handleSupportChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Staf Teknis Tersedia" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "eventPlanning", checked: formData.support.eventPlanning, onChange: handleSupportChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Dukungan Event Planning" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", name: "catering", checked: formData.support.catering, onChange: handleSupportChange, className: "rounded text-blue-600 focus:ring-blue-500 h-4 w-4" }), _jsx("span", { className: "text-gray-700", children: "Layanan Katering Khusus Event" })] }) })] })] })] }));
            case 5:
                return (_jsxs("div", { children: [_jsxs("div", { className: "form-header mb-4", children: [_jsxs("h3", { className: "font-bold text-xl", style: { color: PRIMARY }, children: [_jsx(Check, { className: "inline mr-2" }), "Konfirmasi Data"] }), _jsx("p", { className: "text-gray-600", children: "Tinjau dan konfirmasi informasi yang telah dimasukkan" })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 mb-4", children: [_jsx("h4", { className: "font-bold mb-2", style: { color: PRIMARY }, children: "Informasi Umum" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-3", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Nama Ruangan:" }), _jsx("p", { className: "font-medium", children: formData.name || "-" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Tipe Ruangan:" }), _jsx("p", { className: "font-medium", children: formData.type || "-" })] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Catatan:" }), _jsx("p", { className: "font-medium", children: formData.notes || "-" })] })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 mb-4", children: [_jsx("h4", { className: "font-bold mb-2", style: { color: PRIMARY }, children: "Kapasitas Ruangan" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Theater:" }), _jsxs("p", { className: "font-medium", children: [formData.capacity.theater || "0", " orang"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Classroom:" }), _jsxs("p", { className: "font-medium", children: [formData.capacity.classroom || "0", " orang"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "U-Shape:" }), _jsxs("p", { className: "font-medium", children: [formData.capacity.ushape || "0", " orang"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Boardroom:" }), _jsxs("p", { className: "font-medium", children: [formData.capacity.boardroom || "0", " orang"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Banquet:" }), _jsxs("p", { className: "font-medium", children: [formData.capacity.banquet || "0", " orang"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Reception:" }), _jsxs("p", { className: "font-medium", children: [formData.capacity.reception || "0", " orang"] })] })] })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 mb-4", children: [_jsx("h4", { className: "font-bold mb-2", style: { color: PRIMARY }, children: "Dimensi Ruangan" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Luas:" }), _jsxs("p", { className: "font-medium", children: [formData.dimensions.area || "0", " m\u00B2"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Panjang:" }), _jsxs("p", { className: "font-medium", children: [formData.dimensions.length || "0", " m"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Lebar:" }), _jsxs("p", { className: "font-medium", children: [formData.dimensions.width || "0", " m"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Tinggi:" }), _jsxs("p", { className: "font-medium", children: [formData.dimensions.height || "0", " m"] })] })] })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 mb-4", children: [_jsx("h4", { className: "font-bold mb-2", style: { color: PRIMARY }, children: "Spesifikasi & Fasilitas" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-3", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Spesifikasi:" }), _jsxs("ul", { className: "list-disc list-inside mt-1 ml-2", children: [formData.specifications.audioVisual && _jsx("li", { children: "Sistem Audio Visual" }), formData.specifications.lighting && _jsx("li", { children: "Sistem Pencahayaan" }), formData.specifications.soundproofing && _jsx("li", { children: "Soundproofing" }), formData.specifications.stage && _jsx("li", { children: "Backdrop/Stage Area" }), _jsxs("li", { children: ["Lantai: ", formData.specifications.flooring] })] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Koneksi:" }), _jsxs("ul", { className: "list-disc list-inside mt-1 ml-2", children: [formData.connectivity.wifi && _jsx("li", { children: "WiFi Khusus" }), formData.connectivity.backup && _jsx("li", { children: "Generator Cadangan" }), _jsxs("li", { children: ["Bandwidth: ", formData.connectivity.bandwidth.toString(), " Mbps"] }), _jsxs("li", { children: ["Stop Kontak: ", formData.connectivity.powerOutlets, " buah"] })] })] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Fasilitas Pendukung:" }), _jsxs("div", { className: "flex flex-wrap mt-1 ml-2", children: [formData.facilities.preFunction && _jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "Pre-function Area" }), formData.facilities.businessCenter && _jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "Business Center" }), formData.facilities.secretariat && _jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "Ruang Sekretariat" }), formData.facilities.vipRoom && _jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "VIP Room" }), formData.facilities.registration && _jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "Area Registrasi" }), formData.facilities.exhibition && _jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "Area Pameran" })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Layanan MICE:" }), _jsxs("div", { className: "flex flex-wrap mt-1 ml-2", children: [formData.support.technicalStaff && _jsx("span", { className: "bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "Staf Teknis" }), formData.support.eventPlanning && _jsx("span", { className: "bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "Event Planning" }), formData.support.catering && _jsx("span", { className: "bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2", children: "Katering Event" })] })] })] }), _jsxs("div", { className: "p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start", children: [_jsx(Info, { className: "text-yellow-500 mt-1 mr-2 flex-shrink-0", size: 20 }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-yellow-700", children: "Konfirmasi Data" }), _jsx("p", { className: "text-sm text-yellow-600 mt-1", children: "Pastikan semua data yang dimasukkan sudah benar sebelum menyimpan. Data yang tersimpan akan ditampilkan pada sistem MICE ID INVENTORY." })] })] })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 font-sans", children: [_jsxs("header", { className: "bg-primary text-white shadow-md relative", style: { backgroundColor: PRIMARY }, children: [_jsx("div", { className: "container mx-auto px-4 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-0", children: "Manajemen Data MICE" }), _jsx("p", { className: "text-sm opacity-80", children: "Kelola informasi venue MICE hotel" })] }), _jsxs("div", { className: "flex items-center", children: [_jsxs("a", { href: "../dashboard/", className: "bg-white text-primary px-3 py-2 rounded-lg flex items-center mr-3", style: { color: PRIMARY, textDecoration: 'none' }, children: [_jsx(ArrowLeft, { size: 18, className: "mr-2" }), _jsx("span", { children: "Kembali ke Dashboard" })] }), _jsxs("button", { className: "bg-white text-primary px-3 py-2 rounded-lg flex items-center", style: { color: PRIMARY }, children: [_jsx(PlusCircle, { size: 18, className: "mr-2" }), _jsx("span", { children: "Tambah Venue Baru" })] })] })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 w-full h-1", style: { backgroundColor: ACCENT } })] }), _jsx("div", { className: "container mx-auto px-4 py-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [_jsxs("div", { className: "flex justify-between px-4 py-3 border-b", style: { backgroundColor: LIGHT_GRAY }, children: [_jsxs("div", { className: `flex items-center ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'} cursor-pointer`, onClick: () => setCurrentStep(1), children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`, children: "1" }), _jsx("span", { className: "hidden md:inline", children: "Informasi Umum" })] }), _jsxs("div", { className: `flex items-center ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'} cursor-pointer`, onClick: () => currentStep > 1 && setCurrentStep(2), children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`, children: "2" }), _jsx("span", { className: "hidden md:inline", children: "Kapasitas" })] }), _jsxs("div", { className: `flex items-center ${currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'} cursor-pointer`, onClick: () => currentStep > 2 && setCurrentStep(3), children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`, children: "3" }), _jsx("span", { className: "hidden md:inline", children: "Dimensi" })] }), _jsxs("div", { className: `flex items-center ${currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'} cursor-pointer`, onClick: () => currentStep > 3 && setCurrentStep(4), children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`, children: "4" }), _jsx("span", { className: "hidden md:inline", children: "Fasilitas" })] }), _jsxs("div", { className: `flex items-center ${currentStep >= 5 ? 'text-blue-600 font-medium' : 'text-gray-500'} cursor-pointer`, onClick: () => currentStep > 4 && setCurrentStep(5), children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 5 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`, children: "5" }), _jsx("span", { className: "hidden md:inline", children: "Konfirmasi" })] })] }), _jsxs("div", { className: "p-6", children: [renderStepContent(), _jsxs("div", { className: "flex justify-between mt-6", children: [currentStep > 1 ? (_jsxs("button", { type: "button", onClick: prevStep, className: "flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50", children: [_jsx(ChevronLeft, { size: 18, className: "mr-1" }), " Sebelumnya"] })) : (_jsx("button", { type: "button", onClick: clearForm, className: "flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50", children: "Reset" })), currentStep < 5 ? (_jsxs("button", { type: "button", onClick: nextStep, className: "flex items-center px-4 py-2 text-white rounded-md", style: { backgroundColor: PRIMARY }, children: ["Selanjutnya ", _jsx(ChevronRight, { size: 18, className: "ml-1" })] })) : (_jsxs("button", { type: "button", onClick: saveVenue, className: "flex items-center px-4 py-2 text-white rounded-md", style: { backgroundColor: SUCCESS }, children: [_jsx(Save, { size: 18, className: "mr-1" }), " Simpan"] }))] })] })] }) }), _jsxs("div", { className: "lg:col-span-1", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b flex justify-between items-center", style: { backgroundColor: PRIMARY }, children: [_jsx("h3", { className: "font-bold text-white", children: "Daftar Venue MICE" }), _jsxs("span", { className: "bg-white text-primary px-2 py-1 rounded-lg text-sm font-medium", style: { color: PRIMARY }, children: [venues.length, " Venue"] })] }), _jsx("div", { className: "p-4", children: venues.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Layout, { size: 48, className: "mx-auto text-gray-300 mb-2" }), _jsx("p", { className: "text-gray-500", children: "Belum ada venue MICE yang ditambahkan" }), _jsxs("button", { className: "mt-3 px-4 py-2 text-sm text-white rounded-md", style: { backgroundColor: PRIMARY }, children: [_jsx(PlusCircle, { size: 16, className: "inline mr-1" }), " Tambah Venue"] })] })) : (_jsx("div", { className: "space-y-3", children: venues.map((venue) => (_jsxs("div", { className: "border rounded-lg p-3 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h4", { className: "font-medium", children: venue.name }), _jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full", children: venue.type })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm mb-3", children: [_jsxs("div", { className: "flex items-center text-gray-600", children: [_jsx(Users, { size: 14, className: "mr-1" }), " Theater: ", venue.capacity.theater] }), _jsxs("div", { className: "flex items-center text-gray-600", children: [_jsx(Users, { size: 14, className: "mr-1" }), " Classroom: ", venue.capacity.classroom] }), _jsxs("div", { className: "flex items-center text-gray-600", children: [_jsx(Maximize, { size: 14, className: "mr-1" }), " ", venue.dimensions.area, " m\u00B2"] }), _jsxs("div", { className: "flex items-center text-gray-600", children: [_jsx(Calendar, { size: 14, className: "mr-1" }), " ", venue.capacity.banquet > 0 ? "Banquet: " + venue.capacity.banquet : "No Banquet"] })] }), _jsxs("div", { className: "flex space-x-2 mt-3", children: [_jsxs("button", { onClick: () => editVenue(venue.id), className: "flex-1 flex items-center justify-center px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50", children: [_jsx(Edit, { size: 14, className: "mr-1" }), " Edit"] }), _jsxs("button", { onClick: () => deleteVenue(venue.id), className: "flex items-center justify-center px-3 py-1 text-xs border border-gray-300 rounded-md text-red-600 bg-white hover:bg-red-50", children: [_jsx(Trash2, { size: 14, className: "mr-1" }), " Hapus"] })] })] }, venue.id))) })) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden mt-4", children: [_jsx("div", { className: "px-4 py-3 border-b", style: { backgroundColor: ACCENT }, children: _jsx("h3", { className: "font-bold text-primary", style: { color: PRIMARY }, children: "Informasi MICE" }) }), _jsxs("div", { className: "p-4", children: [_jsx("p", { className: "text-gray-600 mb-3", children: "MICE adalah singkatan dari:" }), _jsxs("ul", { className: "list-disc list-inside text-gray-600 space-y-1 mb-3", children: [_jsxs("li", { children: [_jsx("strong", { children: "M" }), "eetings (Pertemuan)"] }), _jsxs("li", { children: [_jsx("strong", { children: "I" }), "ncentives (Insentif)"] }), _jsxs("li", { children: [_jsx("strong", { children: "C" }), "onferences (Konferensi)"] }), _jsxs("li", { children: [_jsx("strong", { children: "E" }), "xhibitions (Pameran)"] })] }), _jsx("p", { className: "text-gray-600 text-sm", children: "Data yang lengkap dan akurat akan membantu meningkatkan visibilitas venue MICE hotel Anda dalam sistem MICE ID INVENTORY." })] })] })] })] }) })] }));
}
