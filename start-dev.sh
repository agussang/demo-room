#!/bin/bash
echo "🚀 Starting Hotel Management System Development Server..."
echo "=================================================="
echo "🌐 Server will be available at: http://localhost:8000 and http://[your-ip]:8000"
echo "📱 Mobile testing: http://[your-ip]:8000"
echo ""
echo "🔗 Quick Access:"
echo "   • Main Portal: http://localhost:8000"
echo "   • Hotel Manager: http://localhost:8000/hotel-manager/"
echo "   • Pemda Admin: http://localhost:8000/admin/pemda/"
echo "   • Central Gov: http://localhost:8000/admin/pusat/"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

php -S 0.0.0.0:8000
