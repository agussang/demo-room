# Hotel Management System

Sistem manajemen hotel dengan workflow verifikasi Pemda dan approval Pemerintah Pusat.

## Struktur Proyek

```
hotel-management-system/
├── admin/                  # Panel admin
│   ├── pemda/             # Dashboard Pemda
│   ├── pusat/             # Dashboard Pemerintah Pusat
│   └── shared/            # Komponen bersama
├── api/                   # REST API endpoints
├── assets/                # CSS, JS, images
├── config/                # Konfigurasi database dan aplikasi
└── docs/                  # Dokumentasi
```

## Color Palette

- **Primary**: #2A4061 (Navy Blue)
- **Accent**: #D6A955 (Gold)
- **Success**: #10b981
- **Warning**: #f59e0b
- **Danger**: #ef4444

## Workflow

1. **Hotel Manager**: Submit pengajuan
2. **Pemda**: Verifikasi dokumen dan compliance
3. **Pemerintah Pusat**: Final approval dan penerbitan SK

## Installation

1. Clone repository
2. Run `chmod +x setup.sh && ./setup.sh`
3. Configure database in `config/database.php`
4. Import database schema
5. Start development server

## Development

- Frontend: HTML5, CSS3, JavaScript ES6+
- Backend: PHP 7.4+
- Database: MySQL 5.7+
- Icons: Font Awesome 6

## API Endpoints

- `POST /api/hotel-submissions.php` - Hotel submissions
- `POST /api/pemda-verification.php` - Pemda verification
- `POST /api/pusat-approval.php` - Final approval

## License

MIT License - Internal Use Only
