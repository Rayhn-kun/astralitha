import os

def clear_console():
    sistem_operasi = os.name
    match sistem_operasi:
        case "posix": os.system("clear")
        case "nt": os.system("cls")

def tampilkan_menu():
    print("Manajer Karakter 3D Anime")
    print("==========================")
    print("1. Tampilkan semua karakter")
    print("2. Tambah karakter baru")
    print("3. Ubah data karakter")
    print("4. Hapus karakter")
    print("5. Keluar")

def tampilkan_karakter(karakter_list):
    if not karakter_list:
        print("Belum ada data karakter.")
        return
    print("Daftar Karakter 3D Anime:")
    for idx, karakter in enumerate(karakter_list, start=1):
        print(f"{idx}. Nama: {karakter['Nama karakter']}, Asal Anime: {karakter['Asal anime']}, Software: {karakter['Software yang digunakan']}, File Model: {karakter['Nama file model']}, Status Rigging: {karakter['Status rigging']}")

def tambah_karakter(karakter_list):
    nama = input("Masukkan Nama karakter: ")
    asal = input("Masukkan Asal anime: ")
    software = input("Masukkan Software yang digunakan: ")
    file_model = input("Masukkan Nama file model (.vrm / .fbx): ")
    status_rigging = input_status_rigging()
    karakter_baru = {
        "Nama karakter": nama,
        "Asal anime": asal,
        "Software yang digunakan": software,
        "Nama file model": file_model,
        "Status rigging": status_rigging
    }
    karakter_list.append(karakter_baru)
    print("Karakter berhasil ditambahkan.")

def input_status_rigging():
    valid_status = ["Belum", "Proses", "Selesai"]
    while True:
        status = input("Masukkan Status rigging (Belum / Proses / Selesai): ")
        if status in valid_status:
            return status
        else:
            print("Status rigging tidak valid. Silakan masukkan salah satu dari: Belum, Proses, Selesai.")

def ubah_karakter(karakter_list):
    if not karakter_list:
        print("Belum ada data karakter untuk diubah.")
        return
    tampilkan_karakter(karakter_list)
    try:
        idx = int(input("Masukkan nomor karakter yang ingin diubah: "))
        if idx < 1 or idx > len(karakter_list):
            print("Nomor karakter tidak valid.")
            return
    except ValueError:
        print("Input tidak valid.")
        return
    karakter = karakter_list[idx - 1]
    print("Masukkan data baru (kosongkan jika tidak ingin mengubah):")
    nama = input(f"Nama karakter [{karakter['Nama karakter']}]: ") or karakter['Nama karakter']
    asal = input(f"Asal anime [{karakter['Asal anime']}]: ") or karakter['Asal anime']
    software = input(f"Software yang digunakan [{karakter['Software yang digunakan']}]: ") or karakter['Software yang digunakan']
    file_model = input(f"Nama file model [{karakter['Nama file model']}]: ") or karakter['Nama file model']
    print(f"Status rigging saat ini: {karakter['Status rigging']}")
    status_rigging = input_status_rigging()
    karakter_list[idx - 1] = {
        "Nama karakter": nama,
        "Asal anime": asal,
        "Software yang digunakan": software,
        "Nama file model": file_model,
        "Status rigging": status_rigging
    }
    print("Data karakter berhasil diubah.")

def hapus_karakter(karakter_list):
    if not karakter_list:
        print("Belum ada data karakter untuk dihapus.")
        return
    tampilkan_karakter(karakter_list)
    try:
        idx = int(input("Masukkan nomor karakter yang ingin dihapus: "))
        if idx < 1 or idx > len(karakter_list):
            print("Nomor karakter tidak valid.")
            return
    except ValueError:
        print("Input tidak valid.")
        return
    karakter_list.pop(idx - 1)
    print("Karakter berhasil dihapus.")

def main():
    karakter_list = []
    while True:
        clear_console()
        tampilkan_menu()
        pilihan = input("Masukkan pilihan Anda: ")
        clear_console()
        match pilihan:
            case "1":
                tampilkan_karakter(karakter_list)
            case "2":
                tambah_karakter(karakter_list)
            case "3":
                ubah_karakter(karakter_list)
            case "4":
                hapus_karakter(karakter_list)
            case "5":
                print("Terima kasih telah menggunakan Manajer Karakter 3D Anime. Sampai jumpa!")
                break
            case _:
                print("Pilihan tidak valid. Silakan coba lagi.")
        input("\nTekan Enter untuk melanjutkan...")

if __name__ == "__main__":
    main()
