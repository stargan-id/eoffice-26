import { DropdownMenuTrigger,DropdownMenu } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut, Bell } from "lucide-react"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';


export const NotificationDropdown = () => {
    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-0 h-5"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start p-3">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">Peringatan Stok Rendah</span>
                <span className="text-xs text-gray-500">2 menit lalu</span>
              </div>
              <span className="text-sm text-gray-600 mt-1">
                Stok bahan makanan di SPPG Jakarta Utara menipis
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start p-3">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">Laporan Harian</span>
                <span className="text-xs text-gray-500">1 jam lalu</span>
              </div>
              <span className="text-sm text-gray-600 mt-1">
                Laporan harian dari 15 SPPG telah diterima
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start p-3">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">System Update</span>
                <span className="text-xs text-gray-500">3 jam lalu</span>
              </div>
              <span className="text-sm text-gray-600 mt-1">
                Sistem telah diperbarui ke versi 2.1.0
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center p-2">
              <span className="text-sm text-blue-600 hover:text-blue-800">
                Lihat semua notifikasi
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    )
}